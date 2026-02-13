/**
 * AI SDK Span Processor
 *
 * Adds billing attribution to spans from Vercel AI SDK telemetry.
 */

import type { Context } from "@opentelemetry/api";
import type { SpanProcessor, Span, ReadableSpan } from "@opentelemetry/sdk-trace-base";
import { getTracingContext } from "./tracingContext.js";

/**
 * Check if a span is from AI SDK telemetry
 */
function isAISDKSpan(span: ReadableSpan): boolean {
    const attrs = span.attributes;
    const name = span.name.toLowerCase();

    // Check for AI SDK specific attributes
    if (attrs["ai.model.id"] || attrs["ai.model.provider"] || attrs["ai.operationId"]) {
        return true;
    }

    // Check span name patterns for Vercel AI SDK
    if (name.startsWith("ai.")) {
        return true;
    }

    return false;
}

/**
 * AI SDK Span Processor - adds billing attribution to AI SDK telemetry spans
 */
export class AISDKSpanProcessor implements SpanProcessor {
    onStart(span: Span, _parentContext?: Context): void {
        const { externalCustomerId, externalProductId } = getTracingContext();

        // Add billing attribution
        if (externalCustomerId) {
            span.setAttribute("external_customer_id", externalCustomerId);
        }
        if (externalProductId) {
            span.setAttribute("external_agent_id", externalProductId);
        }

        // For AI SDK spans, add event_name for billing
        const readableSpan = span as unknown as ReadableSpan;
        if (isAISDKSpan(readableSpan)) {
            const name = readableSpan.name.toLowerCase();
            if (name.includes("embed")) {
                span.setAttribute("event_name", "embedding");
            } else {
                span.setAttribute("event_name", "llm");
            }

            // Add span name prefix for collector processing
            if (!readableSpan.name.startsWith("paid.trace.")) {
                span.updateName(`paid.trace.${readableSpan.name}.signal`);
            }
        }
    }

    onEnd(_span: ReadableSpan): void {}
    async shutdown(): Promise<void> {}
    async forceFlush(): Promise<void> {}
}
