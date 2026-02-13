/**
 * AI SDK Span Processor
 *
 * Adds billing attribution and maps AI SDK attributes to GenAI semantic conventions.
 * https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/
 *
 * Note: Attribute mapping is done in onEnd() because AI SDK sets usage attributes
 * (like ai.usage.promptTokens) AFTER the API call completes, not at span start.
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
    return !!(
        attrs["ai.model.id"] ||
        attrs["ai.model.provider"] ||
        attrs["ai.operationId"] ||
        span.name.toLowerCase().startsWith("ai.")
    );
}

export class AISDKSpanProcessor implements SpanProcessor {
    onStart(span: Span, _parentContext?: Context): void {
        const { externalCustomerId, externalProductId } = getTracingContext();

        // Add billing attribution to all spans in trace context
        // These are available immediately from our tracing context
        if (externalCustomerId) {
            span.setAttribute("external_customer_id", externalCustomerId);
        }
        if (externalProductId) {
            span.setAttribute("external_agent_id", externalProductId);
        }
    }

    onEnd(span: ReadableSpan): void {
        // Only process AI SDK spans
        if (!isAISDKSpan(span)) {
            return;
        }

        // In JS/TS, ReadableSpan.attributes is readonly but the object itself is mutable
        // This is similar to Python's object.__setattr__ hack but simpler
        const attrs = span.attributes as Record<string, unknown>;

        // Map AI SDK attributes to GenAI format
        for (const [aiKey, genAiKey] of Object.entries(ATTRIBUTE_MAP)) {
            if (attrs[aiKey] !== undefined) {
                attrs[genAiKey] = attrs[aiKey];
            }
        }

        // Calculate total tokens if we have input and output
        const inputTokens = attrs["ai.usage.promptTokens"] as number | undefined;
        const outputTokens = attrs["ai.usage.completionTokens"] as number | undefined;
        if (inputTokens !== undefined && outputTokens !== undefined) {
            attrs["gen_ai.usage.total_tokens"] = inputTokens + outputTokens;
        }

        // Set event_name for billing
        const name = span.name.toLowerCase();
        attrs["event_name"] = name.includes("embed") ? "embedding" : "llm";

        // Add span name prefix for collector
        // SpanImpl.name is a regular property, so we can modify it directly
        if (!span.name.startsWith("paid.trace.")) {
            (span as { name: string }).name = `paid.trace.${span.name}.signal`;
        }
    }

    async shutdown(): Promise<void> {}
    async forceFlush(): Promise<void> {}
}
