/**
 * AI SDK Integration for Paid
 *
 * This module provides OpenInference auto-instrumentation for Vercel AI SDK.
 * Simply import this module and tracing is automatically enabled!
 *
 * @example
 * ```typescript
 * // Just import - tracing is auto-initialized!
 * import "@paid-ai/paid-node/ai-sdk";
 * import { generateText } from "ai";
 * import { openai } from "@ai-sdk/openai";
 *
 * // Use with AI SDK - traces are captured automatically!
 * const result = await generateText({
 *   model: openai("gpt-4"),
 *   prompt: "Hello!",
 * });
 * ```
 *
 * Environment variables:
 * - PAID_API_KEY: Your Paid API key (required)
 * - PAID_OTEL_COLLECTOR_ENDPOINT: Custom collector endpoint (optional)
 */

import type { TracerProvider, Tracer } from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OpenAIInstrumentation } from "@arizeai/openinference-instrumentation-openai";
import {
    GenAISpanProcessor,
    GenAIAttributes,
    AISDKAttributes,
    OpenInferenceSpanKinds,
    OPENINFERENCE_SPAN_KIND,
} from "../tracing/genAISpanProcessor.js";
import { initializeTracing, getPaidTracerProvider, getPaidTracer } from "../tracing/tracing.js";

// Track if instrumentation has been registered
let initialized = false;
let anthropicInitialized = false;

/**
 * Try to load and register Anthropic instrumentation asynchronously
 * This uses dynamic import() for ESM compatibility
 */
async function tryLoadAnthropicInstrumentation(): Promise<void> {
    if (anthropicInitialized) return;

    try {
        const provider = getPaidTracerProvider();
        const { AnthropicInstrumentation } = await import("@arizeai/openinference-instrumentation-anthropic");
        registerInstrumentations({
            instrumentations: [
                new AnthropicInstrumentation({
                    tracerProvider: provider,
                }),
            ],
        });
        anthropicInitialized = true;
    } catch {
        // Anthropic instrumentation not available, skip
    }
}

/**
 * Initialize AI SDK tracing (called automatically on module import)
 *
 * You can also call this manually if you need to pass custom options.
 */
function initialize(): void {
    if (initialized) return;

    // Initialize the base Paid tracing (reads PAID_API_KEY from env)
    initializeTracing();

    // Get the tracer provider and add the GenAI span processor
    const provider = getPaidTracerProvider();
    if (provider) {
        const tracerProvider = provider as TracerProvider & {
            addSpanProcessor?: (processor: import("@opentelemetry/sdk-trace-base").SpanProcessor) => void;
        };

        // Add GenAI span processor if the provider supports it
        if (typeof tracerProvider.addSpanProcessor === "function") {
            tracerProvider.addSpanProcessor(new GenAISpanProcessor());
        }
    }

    // Register OpenAI instrumentation synchronously
    registerInstrumentations({
        instrumentations: [
            new OpenAIInstrumentation({
                tracerProvider: provider,
            }),
        ],
    });

    // Try to load Anthropic instrumentation asynchronously (ESM compatible)
    tryLoadAnthropicInstrumentation().catch(() => {
        // Silently ignore - Anthropic instrumentation is optional
    });

    initialized = true;
}

// Auto-initialize on module import!
initialize();

/**
 * Telemetry configuration options for AI SDK (legacy, not needed with auto-instrumentation)
 */
export interface TelemetryConfig {
    isEnabled: boolean;
    recordInputs?: boolean;
    recordOutputs?: boolean;
    functionId?: string;
    metadata?: Record<string, string | number | boolean>;
    tracer?: Tracer;
}

/**
 * Options for manual initialization (usually not needed)
 */
export interface InitializeAISDKTracingOptions {
    apiKey?: string;
    collectorEndpoint?: string;
    additionalProcessors?: import("@opentelemetry/sdk-trace-base").SpanProcessor[];
}

/**
 * Manually initialize AI SDK tracing with custom options
 *
 * Note: This is usually not needed - tracing is auto-initialized on import.
 * Use this only if you need custom configuration.
 */
export function initializeAISDKTracing(options?: InitializeAISDKTracingOptions): void {
    if (initialized && !options) return;

    // Re-initialize with custom options
    initializeTracing(options?.apiKey, options?.collectorEndpoint);

    const provider = getPaidTracerProvider();
    if (provider && options?.additionalProcessors) {
        const tracerProvider = provider as TracerProvider & {
            addSpanProcessor?: (processor: import("@opentelemetry/sdk-trace-base").SpanProcessor) => void;
        };

        if (typeof tracerProvider.addSpanProcessor === "function") {
            for (const processor of options.additionalProcessors) {
                tracerProvider.addSpanProcessor(processor);
            }
        }
    }

    initialized = true;
}

/**
 * Create telemetry configuration for AI SDK functions (legacy)
 *
 * Note: With auto-instrumentation, you don't need this anymore.
 */
export function createTelemetryConfig(options?: Partial<TelemetryConfig>): TelemetryConfig {
    const tracer = getPaidTracer();

    return {
        isEnabled: options?.isEnabled ?? true,
        recordInputs: options?.recordInputs,
        recordOutputs: options?.recordOutputs,
        functionId: options?.functionId,
        metadata: options?.metadata,
        tracer: options?.tracer ?? tracer ?? undefined,
    };
}

/**
 * Get the GenAI span processor instance
 */
export function getGenAISpanProcessor(): GenAISpanProcessor {
    return new GenAISpanProcessor();
}

// Re-export GenAI span processor and constants
export {
    GenAISpanProcessor,
    GenAIAttributes,
    AISDKAttributes,
    OpenInferenceSpanKinds,
    OPENINFERENCE_SPAN_KIND,
};

// Re-export tracing utilities
export { getPaidTracer, getPaidTracerProvider } from "../tracing/tracing.js";
export { trace, signal } from "../tracing/index.js";
