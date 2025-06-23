import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { trace, SpanStatusCode } from "@opentelemetry/api";
import { AsyncLocalStorage } from 'async_hooks';

const customerIdStorage = new AsyncLocalStorage<string | null>();
const tokenStorage = new AsyncLocalStorage<string | null>();
export const getCustomerId = (): string | null | undefined => customerIdStorage.getStore();
export const getTokenStorage = (): string | null | undefined => tokenStorage.getStore();

let _token: string | undefined;
const setToken = (token: string) => { _token = token; };
const getToken = () => { return _token; };

export function initializeTracing(apiKey: string) {
    setToken(apiKey);
    const sdk = new NodeSDK({
        traceExporter: new OTLPTraceExporter({
            url: 'https://collector.agentpaid.io:4318/v1/traces',
            // url: 'http://localhost:4318/v1/traces',
        }),
    });

    sdk.start();

    // Graceful shutdown
    ["SIGINT", "SIGTERM", "beforeExit"].forEach((event) => {
        process.on(event, () => {
            sdk.shutdown()
                .then(() => console.log("Paid tracing SDK shut down"))
                .catch((error) => console.error("Error shutting down Paid tracing SDK", error));
        });
    });
}

export async function capture<T extends (...args: any[]) => any>(
    externalCustomerId: string,
    fn: T,
    ...args: Parameters<T>
): Promise<ReturnType<T>> {
    const tracer = trace.getTracer('paid.node');
    const token = getToken();
    
    if (!token) {
        console.warn('No token found - tracing will not be captured');
        return fn(...args) as ReturnType<T>;
    }

    return tracer.startActiveSpan("paid.node", async (span) => {
        span.setAttribute('external_customer_id', externalCustomerId);
        span.setAttribute('token', token);
        
        try {
            const result = await customerIdStorage.run(externalCustomerId, async () => {
                return await tokenStorage.run(token, async () => {
                    return await fn(...args);
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

