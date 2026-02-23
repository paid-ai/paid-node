import { SpanStatusCode, context } from "@opentelemetry/api";
import type { Tracer } from "@opentelemetry/api";
import type { SpanProcessor } from "@opentelemetry/sdk-trace-base";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { runWithTracingContext } from "./tracingContext.js";
import { PaidSpanProcessor } from "./spanProcessor.js";
import { AISDKSpanProcessor } from "./aiSdkSpanProcessor.js";

export interface InitializeTracingOptions {
    collectorEndpoint?: string;
    registerGlobal?: boolean;
}

const DEFAULT_COLLECTOR_ENDPOINT =
    process.env["PAID_OTEL_COLLECTOR_ENDPOINT"] || "https://collector.agentpaid.io:4318/v1/traces";

let paidApiToken: string | undefined = undefined;
export function getToken(): string | undefined {
    return paidApiToken;
}

let paidTracerProvider: NodeTracerProvider | undefined = undefined;
export function getPaidTracerProvider(): NodeTracerProvider | undefined {
    return paidTracerProvider;
}

let paidTracer: Tracer | undefined = undefined;
export function getPaidTracer(): Tracer | undefined {
    return paidTracer;
}

let _isShuttingDown = false;
const setupGracefulShutdown = (shuttable: { shutdown(): Promise<void> }) => {
    ["SIGINT", "SIGTERM", "beforeExit", "uncaughtException", "unhandledRejection"].forEach((signal) => {
        process.on(signal, () => {
            if (_isShuttingDown) {
                return;
            }
            _isShuttingDown = true;
            shuttable
                .shutdown()
                .then(() => console.info(`Paid tracing SDK shut down from signal: ${signal}`))
                .catch((error) => console.error(`Error shutting down Paid tracing SDK ${error}`));
        });
    });
};

export function createPaidSpanProcessors(apiKey: string, collectorEndpoint?: string): SpanProcessor[] {
    const url = collectorEndpoint || DEFAULT_COLLECTOR_ENDPOINT;
    const exporter = new OTLPTraceExporter({ url, headers: { Authorization: `Bearer ${apiKey}` } });
    return [new PaidSpanProcessor(), new AISDKSpanProcessor(), new SimpleSpanProcessor(exporter)];
}

export function initializeTracing(apiKey?: string, options?: InitializeTracingOptions): void {
    const paidEnabled = (process.env.PAID_ENABLED || "true") !== "false";
    if (!paidEnabled) {
        console.info("Paid tracing is disabled via PAID_ENABLED environment variable");
        return;
    }
    const token = getToken();

    if (!!token) {
        console.info("Tracing is already initialized - skipping re-intialization");
        return;
    }

    if (!apiKey) {
        const envKey = process.env.PAID_API_KEY;
        if (!envKey) {
            console.error("API key must be provided via PAID_API_KEY environment variable");
            return;
        }

        paidApiToken = envKey;
    } else {
        paidApiToken = apiKey;
    }

    const { collectorEndpoint, registerGlobal = false } = options || {};

    const url = collectorEndpoint || DEFAULT_COLLECTOR_ENDPOINT;
    const exporter = new OTLPTraceExporter({ url, headers: { Authorization: `Bearer ${paidApiToken}` } });
    const spanProcessor = new SimpleSpanProcessor(exporter);
    // Order matters: processors run in order, and SimpleSpanProcessor exports on onEnd.
    // So we need to run our attribute-modifying processors BEFORE the exporter.
    paidTracerProvider = new NodeTracerProvider({
        spanProcessors: [new PaidSpanProcessor(), new AISDKSpanProcessor(), spanProcessor],
    });

    if (registerGlobal) {
        // Register the provider globally so that any tracer (including the AI SDK's
        // `trace.getTracer("ai")`) routes spans through our span processors.
        // This also sets up an AsyncLocalStorageContextManager for context propagation.
        paidTracerProvider.register();
    } else {
        // Set up context propagation without registering the provider globally.
        // This gives us async parent-child linking via AsyncLocalStorage
        // without polluting the global trace provider.
        const contextManager = new AsyncLocalStorageContextManager();
        contextManager.enable();
        if (!context.setGlobalContextManager(contextManager)) {
            contextManager.disable();
        }
    }

    paidTracer = paidTracerProvider.getTracer("paid.node");
    setupGracefulShutdown(spanProcessor);
    console.info(`Paid tracing SDK initialized with collector endpoint: ${url}`);
}

export async function trace<F extends (...args: any[]) => any>(
    options: {
        externalCustomerId: string;
        externalProductId?: string;
        storePrompt?: boolean;
        metadata?: any;
    },
    fn: F,
    ...args: Parameters<F>
): Promise<ReturnType<F>> {
    const token = getToken();
    const tracer = getPaidTracer();

    if (!token || !tracer) {
        // don't throw, tracing should not crash user app.
        console.error("Paid tracing is not initialized. Make sure to call initializeTracing() first.");
        return await fn(...args);
    }
    const { externalCustomerId, externalProductId: externalAgentId, storePrompt, metadata } = options;

    return await runWithTracingContext(
        {
            externalCustomerId,
            externalProductId: externalAgentId,
            storePrompt,
            metadata,
        },
        async () => {
            return await tracer.startActiveSpan("parent_span", async (span) => {
                try {
                    const res = await fn(...args);
                    span.setStatus({ code: SpanStatusCode.OK });
                    return res;
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
        },
    );
}
