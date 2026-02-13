/**
 * AI SDK Integration for Paid
 *
 * This module provides OpenInference auto-instrumentation for AI SDKs.
 * Simply call initializeTracing() and tracing is automatically enabled
 * for any installed AI packages (OpenAI, Anthropic, etc.)
 *
 * @example
 * ```typescript
 * import { initializeTracing, trace } from "@paid-ai/paid-node/ai-sdk";
 * import { generateText } from "ai";
 * import { openai } from "@ai-sdk/openai";
 *
 * // Initialize tracing (auto-detects installed AI packages)
 * await initializeTracing();
 *
 * // Use with AI SDK - traces are captured automatically!
 * const result = await trace(
 *   { externalCustomerId: "customer-123", externalProductId: "product-456" },
 *   async () => {
 *     return await generateText({
 *       model: openai("gpt-4"),
 *       prompt: "Hello!",
 *     });
 *   }
 * );
 * ```
 *
 * Environment variables:
 * - PAID_API_KEY: Your Paid API key (required)
 * - PAID_OTEL_COLLECTOR_ENDPOINT: Custom collector endpoint (optional)
 */

// Re-export everything from the main tracing module
export {
    initializeTracing,
    trace,
    getPaidTracer,
    getPaidTracerProvider,
    getToken,
    logger,
} from "../tracing/tracing.js";

export type { InitializeTracingOptions } from "../tracing/tracing.js";

// Re-export GenAI span processor and constants for advanced users
export {
    GenAISpanProcessor,
    GenAIAttributes,
    AISDKAttributes,
    OpenInferenceSpanKinds,
    OPENINFERENCE_SPAN_KIND,
} from "../tracing/genAISpanProcessor.js";

// Re-export signal for manual signal sending (if needed)
export { signal } from "../tracing/index.js";
