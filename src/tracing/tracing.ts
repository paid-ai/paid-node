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

let _isShuttingDown = false;

export function initializeTracing(apiKey: string, collectorEndpoint: string) {
    try {
        if (getToken()) {
            console.warn('Tracing SDK already initialized with a token. Skipping re-initialization.');
            return;
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
        ['SIGINT', 'SIGTERM', 'beforeExit', 'uncaughtException', 'unhandledRejection'].forEach(signal => {
            process.on(signal, () => {
                if (_isShuttingDown) {
                    console.warn('Paid tracing SDK is already shutting down. Ignoring signal:', signal);
                    return;
                }
                _isShuttingDown = true;
                sdk.shutdown()
                    .then(() => console.log('Paid tracing SDK shut down from signal:', signal))
                    .catch(error => console.error('Error shutting down Paid tracing SDK', error));
            });
        });
    } catch (error) {
        console.error('Error initializing Paid tracing SDK:', error);
        throw error;
    }

    console.log('Paid tracing SDK initialized with collector endpoint:', collectorEndpoint);
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
