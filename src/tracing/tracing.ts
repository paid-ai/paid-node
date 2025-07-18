import { NodeSDK } from "@opentelemetry/sdk-node";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchSpanProcessor, SpanProcessor } from "@opentelemetry/sdk-trace-base";
import { SpanStatusCode } from "@opentelemetry/api";
import { AsyncLocalStorage } from "async_hooks";
import winston from "winston";

export const logger = winston.createLogger({
    level: "silent", // Default to 'silent' to avoid logging unless set via environment variable
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
});
const logLevel = process.env.PAID_LOG_LEVEL;
if (logLevel) {
    logger.level = logLevel;
}

const COLLECTOR_ENDPOINT = process.env.PAID_COLLECTOR_ENDPOINT || "https://collector.agentpaid.io:4318/v1/traces";

// set up default tracing provider
let paidExporter = new OTLPTraceExporter({ url: COLLECTOR_ENDPOINT });
let spanProcessor = new BatchSpanProcessor(paidExporter);
let paidTracerProvider = new NodeTracerProvider({ spanProcessors: [spanProcessor] });
export let paidTracer = paidTracerProvider.getTracer("paid.node");

// storage for passing info to child spans
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

function setupGracefulShutdown(shuttable: NodeSDK | SpanProcessor) {
    ["SIGINT", "SIGTERM", "beforeExit", "uncaughtException", "unhandledRejection"].forEach((signal) => {
        process.on(signal, () => {
            if (_isShuttingDown) {
                return;
            }
            _isShuttingDown = true;
            shuttable
                .shutdown()
                .then(() => logger.info(`Paid tracing SDK shut down from signal: ${signal}`))
                .catch((error) => logger.error(`Error shutting down Paid tracing SDK ${error}`));
        });
    });
}

export function _initializeTracing(apiKey: string, collectorEndpoint?: string) {
    if (getToken()) {
        throw new Error("Tracing SDK is already initialized.");
    }
    if (!apiKey) {
        throw new Error("Cannot initialize tracing SDK - first initialize the PaidClient with an API key");
    }

    if (collectorEndpoint) {
        paidExporter = new OTLPTraceExporter({ url: collectorEndpoint });
        spanProcessor = new BatchSpanProcessor(paidExporter);
        paidTracerProvider = new NodeTracerProvider({ spanProcessors: [spanProcessor] });
        paidTracer = paidTracerProvider.getTracer("paid.node");
    }

    setupGracefulShutdown(spanProcessor);

    setToken(apiKey);
    const collectorAddress = collectorEndpoint || COLLECTOR_ENDPOINT;
    logger.info(`Paid tracing SDK initialized with collector endpoint: ${collectorAddress}`);
}

export async function _trace<T extends (...args: any[]) => any>(
    externalCustomerId: string,
    fn: T,
    externalAgentId: string | undefined,
    ...args: Parameters<T>
): Promise<ReturnType<T>> {
    const tracer = paidTracer;
    const token = getToken();

    if (!token || !externalCustomerId) {
        throw new Error(`Paid tracing is not initialized. Make sure to call initializeTracing() first.`);
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
