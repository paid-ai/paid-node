import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { AsyncLocalStorage } from "async_hooks";

const customerIdStorage = new AsyncLocalStorage<string | null>();
const agentIdStorage = new AsyncLocalStorage<string | null>();
const tokenStorage = new AsyncLocalStorage<string | null>();
export const getCustomerIdStorage = (): string | null | undefined => customerIdStorage.getStore();
export const getAgentIdStorage = (): string | null | undefined => agentIdStorage.getStore();
export const getTokenStorage = (): string | null | undefined => tokenStorage.getStore();

let _token: string | undefined;
const setToken = (token: string) => {
    _token = token;
};
const getToken = () => {
    return _token;
};

let _isShuttingDown = false;

export function _initializeTracing(apiKey: string, collectorEndpoint: string) {
    try {
        if (getToken()) {
            throw new Error("Tracing SDK is already initialized.");
        }

        if (!apiKey) {
            throw new Error("Cannot initialize tracing SDK - first initialize the PaidClient with an API key");
        }

        try {
            new URL(collectorEndpoint);
        } catch {
            throw new Error(`Collector endpoint [${collectorEndpoint}] must be a valid URL`);
        }

        setToken(apiKey);
        const sdk = new NodeSDK({
            traceExporter: new OTLPTraceExporter({
                url: collectorEndpoint,
            }),
        });

        sdk.start();

        // Graceful shutdown
        ["SIGINT", "SIGTERM", "beforeExit", "uncaughtException", "unhandledRejection"].forEach((signal) => {
            process.on(signal, () => {
                if (_isShuttingDown) {
                    console.warn("Paid tracing SDK is already shutting down. Ignoring signal:", signal);
                    return;
                }
                _isShuttingDown = true;
                sdk.shutdown()
                    .then(() => console.log("Paid tracing SDK shut down from signal:", signal))
                    .catch((error) => console.error("Error shutting down Paid tracing SDK", error));
            });
        });
    } catch (error) {
        console.error("Error initializing Paid tracing SDK:", error);
        throw error;
    }

    console.log("Paid tracing SDK initialized with collector endpoint:", collectorEndpoint);
}

export async function _trace<T extends (...args: any[]) => any>(
    externalCustomerId: string,
    fn: T,
    externalAgentId: string | undefined,
    ...args: Parameters<T>
): Promise<ReturnType<T>> {
    const tracer = trace.getTracer("paid.node");
    const token = getToken();

    if (!token || !externalCustomerId) {
        throw new Error(`Token [${token}] or external customer ID [${externalCustomerId}] is missing`);
    }

    return tracer.startActiveSpan("paid.node", async (span) => {
        span.setAttribute("external_customer_id", externalCustomerId);
        span.setAttribute("token", token);
        if (externalAgentId) {
            span.setAttribute("external_agent_id", externalAgentId);
        }

        try {
            const result = await customerIdStorage.run(externalCustomerId, async () => {
                return await agentIdStorage.run(externalAgentId ?? null, async () => {
                    return await tokenStorage.run(token, async () => {
                        return await fn(...args);
                    });
                });
            });

            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error: any) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message,
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    });
}

export function _signal(eventName: string, data?: Record<string, any>): void {
    if (!eventName) {
        throw new Error("Event name is required for signal.");
    }

    // Check if there's an active span (from _trace())
    const currentSpan = trace.getActiveSpan();
    if (!currentSpan) {
        throw new Error("Cannot send signal: you should call signal() within trace()");
    }

    const externalCustomerId = getCustomerIdStorage();
    const externalAgentId = getAgentIdStorage();
    const token = getTokenStorage();

    if (!externalCustomerId || !externalAgentId || !token) {
        throw new Error(
            `Missing some of: external_customer_id: ${externalCustomerId}, external_agent_id: ${externalAgentId}, or token. Make sure to call signal() within trace()`,
        );
    }

    const tracer = trace.getTracer("paid.node");
    tracer.startActiveSpan("trace.signal", (span) => {
        try {
            const attributes: Record<string, string | number | boolean> = {
                external_customer_id: externalCustomerId,
                external_agent_id: externalAgentId,
                event_name: eventName,
                token: token,
            };

            // Optional data (ex. manual cost tracking)
            if (data) {
                attributes["data"] = JSON.stringify(data);
            }

            span.setAttributes(attributes);
            // Mark span as successful
            span.setStatus({ code: SpanStatusCode.OK });
        } catch (error: any) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message,
            });
            span.recordException(error);
        } finally {
            span.end();
        }
    });
}
