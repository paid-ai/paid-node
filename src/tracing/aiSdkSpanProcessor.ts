/**
 * AI SDK Span Processor
 *
 * Adds billing attribution and maps AI SDK attributes to GenAI semantic conventions.
 * https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/
 */

import type { Context } from "@opentelemetry/api";
import type { SpanProcessor, Span, ReadableSpan } from "@opentelemetry/sdk-trace-base";
import { getTracingContext } from "./tracingContext.js";

// AI SDK -> GenAI attribute mapping (essential for billing)
const ATTRIBUTE_MAP: Record<string, string> = {
    "ai.model.id": "gen_ai.request.model",
    "ai.model.provider": "gen_ai.system",
    "ai.usage.promptTokens": "gen_ai.usage.input_tokens",
    "ai.usage.completionTokens": "gen_ai.usage.output_tokens",
    "ai.response.model": "gen_ai.response.model",
    "ai.response.id": "gen_ai.response.id",
};

function isAISDKSpan(span: ReadableSpan): boolean {
    const attrs = span.attributes;
    return !!(attrs["ai.model.id"] || attrs["ai.model.provider"] || attrs["ai.operationId"] ||
              span.name.toLowerCase().startsWith("ai."));
}

export class AISDKSpanProcessor implements SpanProcessor {
    onStart(span: Span, _parentContext?: Context): void {
        const { externalCustomerId, externalProductId } = getTracingContext();
        const readableSpan = span as unknown as ReadableSpan;

        // Add billing attribution to all spans in trace context
        if (externalCustomerId) {
            span.setAttribute("external_customer_id", externalCustomerId);
        }
        if (externalProductId) {
            span.setAttribute("external_agent_id", externalProductId);
        }

        // Only process AI SDK spans further
        if (!isAISDKSpan(readableSpan)) {
            return;
        }

        const attrs = readableSpan.attributes;

        // Map AI SDK attributes to GenAI format
        for (const [aiKey, genAiKey] of Object.entries(ATTRIBUTE_MAP)) {
            if (attrs[aiKey] !== undefined) {
                span.setAttribute(genAiKey, attrs[aiKey]);
            }
        }

        // Calculate total tokens if we have input and output
        const inputTokens = attrs["ai.usage.promptTokens"] as number | undefined;
        const outputTokens = attrs["ai.usage.completionTokens"] as number | undefined;
        if (inputTokens !== undefined && outputTokens !== undefined) {
            span.setAttribute("gen_ai.usage.total_tokens", inputTokens + outputTokens);
        }

        // Set event_name for billing
        const name = readableSpan.name.toLowerCase();
        span.setAttribute("event_name", name.includes("embed") ? "embedding" : "llm");

        // Add span name prefix for collector
        if (!readableSpan.name.startsWith("paid.trace.")) {
            span.updateName(`paid.trace.${readableSpan.name}.signal`);
        }
    }

    onEnd(_span: ReadableSpan): void {}
    async shutdown(): Promise<void> {}
    async forceFlush(): Promise<void> {}
}
