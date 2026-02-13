/**
 * AI SDK Integration for Paid
 *
 * This module provides tracing support for the Vercel AI SDK (ai package).
 * It captures telemetry from AI SDK's experimental_telemetry feature and
 * attributes it for billing purposes.
 *
 * @example
 * ```typescript
 * import { initializeAISDKTracing, trace } from "@paid-ai/paid-node/ai-sdk";
 * import { generateText } from "ai";
 * import { openai } from "@ai-sdk/openai";
 *
 * // Initialize tracing for AI SDK
 * initializeAISDKTracing();
 *
 * // Use with AI SDK - enable telemetry in your calls
 * const result = await trace(
 *   { externalCustomerId: "customer-123", externalProductId: "product-456" },
 *   async () => {
 *     return await generateText({
 *       model: openai("gpt-4o-mini"),
 *       prompt: "Hello!",
 *       experimental_telemetry: { isEnabled: true },
 *     });
 *   }
 * );
 * ```
 *
 * Environment variables:
 * - PAID_API_KEY: Your Paid API key (required)
 * - PAID_OTEL_COLLECTOR_ENDPOINT: Custom collector endpoint (optional)
 */

import type { Tracer } from "@opentelemetry/api";
import { SpanStatusCode } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import winston from "winston";
import { runWithTracingContext } from "../tracing/tracingContext.js";
import { AISDKSpanProcessor } from "../tracing/aiSdkSpanProcessor.js";

// Re-export span processor for advanced users
export { AISDKSpanProcessor } from "../tracing/aiSdkSpanProcessor.js";

// Re-export signal for manual signal sending
export { signal } from "../tracing/signal.js";

const DEFAULT_COLLECTOR_ENDPOINT =
    process.env["PAID_OTEL_COLLECTOR_ENDPOINT"] || "https://collector.agentpaid.io:4318/v1/traces";

export const logger: winston.Logger = winston.createLogger({
    level: "silent",
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
});

const logLevel = process.env.PAID_LOG_LEVEL;
if (logLevel) {
    logger.level = logLevel;
}

let aiSdkApiToken: string | undefined = undefined;
let aiSdkTracerProvider: NodeTracerProvider | undefined = undefined;
let aiSdkTracer: Tracer | undefined = undefined;

export function getAISDKToken(): string | undefined {
    return aiSdkApiToken;
}

export function getAISDKTracerProvider(): NodeTracerProvider | undefined {
    return aiSdkTracerProvider;
}

export function getAISDKTracer(): Tracer | undefined {
    return aiSdkTracer;
}

export interface InitializeAISDKTracingOptions {
    apiKey?: string;
    collectorEndpoint?: string;
}

/**
 * Initialize tracing for AI SDK.
 *
 * This sets up OpenTelemetry tracing with a span processor optimized for
 * capturing Vercel AI SDK telemetry. It's separate from the standard
 * OpenAI/Anthropic tracing to avoid conflicts.
 *
 * @param options - Configuration options
 * @param options.apiKey - Paid API key (defaults to PAID_API_KEY env var)
 * @param options.collectorEndpoint - OTLP collector endpoint
 */
export function initializeAISDKTracing(options?: InitializeAISDKTracingOptions): void {
    const paidEnabled = (process.env.PAID_ENABLED || "true") !== "false";
    if (!paidEnabled) {
        logger.info("Paid tracing is disabled via PAID_ENABLED environment variable");
        return;
    }

    if (aiSdkApiToken) {
        logger.info("AI SDK tracing is already initialized - skipping re-initialization");
        return;
    }

    const apiKey = options?.apiKey || process.env.PAID_API_KEY;
    if (!apiKey) {
        logger.error("API key must be provided via PAID_API_KEY environment variable or options.apiKey");
        return;
    }

    aiSdkApiToken = apiKey;

    const url = options?.collectorEndpoint || DEFAULT_COLLECTOR_ENDPOINT;
    const exporter = new OTLPTraceExporter({ url });
    const spanProcessor = new SimpleSpanProcessor(exporter);

    // Use AISDKSpanProcessor for AI SDK telemetry
    aiSdkTracerProvider = new NodeTracerProvider({
        resource: resourceFromAttributes({ "api.key": aiSdkApiToken }),
        spanProcessors: [spanProcessor, new AISDKSpanProcessor()],
    });
    aiSdkTracerProvider.register();
    aiSdkTracer = aiSdkTracerProvider.getTracer("paid.ai-sdk");

    // Setup graceful shutdown
    ["SIGINT", "SIGTERM", "beforeExit"].forEach((sig) => {
        process.on(sig, () => {
            spanProcessor.shutdown().catch((err) => logger.error(`Shutdown error: ${err}`));
        });
    });

    logger.info(`AI SDK tracing initialized with collector endpoint: ${url}`);
}

export interface TraceOptions {
    externalCustomerId: string;
    externalProductId?: string;
    storePrompt?: boolean;
    metadata?: Record<string, unknown>;
}

/**
 * Execute a function within a tracing context for billing attribution.
 *
 * All AI SDK calls made within this function will be attributed to the
 * specified customer and product IDs. Make sure to enable telemetry in
 * your AI SDK calls with `experimental_telemetry: { isEnabled: true }`.
 *
 * @example
 * ```typescript
 * const result = await trace(
 *   { externalCustomerId: "customer-123", externalProductId: "product-456" },
 *   async () => {
 *     return await generateText({
 *       model: openai("gpt-4o-mini"),
 *       prompt: "Hello!",
 *       experimental_telemetry: { isEnabled: true },
 *     });
 *   }
 * );
 * ```
 */
export async function trace<F extends (...args: unknown[]) => unknown>(
    options: TraceOptions,
    fn: F,
    ...args: Parameters<F>
): Promise<ReturnType<F>> {
    const token = getAISDKToken();
    const tracer = getAISDKTracer();

    if (!token || !tracer) {
        logger.error("AI SDK tracing is not initialized. Call initializeAISDKTracing() first.");
        return (await fn(...args)) as ReturnType<F>;
    }

    const { externalCustomerId, externalProductId, storePrompt, metadata } = options;

    // Set up tracing context BEFORE creating spans
    return await runWithTracingContext(
        {
            externalCustomerId,
            externalProductId,
            storePrompt,
            metadata,
        },
        async () => {
            return await tracer.startActiveSpan("ai-sdk.trace", async (span) => {
                try {
                    const result = await fn(...args);
                    span.setStatus({ code: SpanStatusCode.OK });
                    return result as ReturnType<F>;
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : String(error);
                    span.setStatus({ code: SpanStatusCode.ERROR, message });
                    if (error instanceof Error) {
                        span.recordException(error);
                    }
                    throw error;
                } finally {
                    span.end();
                }
            });
        },
    );
}
