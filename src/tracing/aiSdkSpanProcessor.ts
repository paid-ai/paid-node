/**
 * AI SDK Span Processor
 *
 * This processor transforms spans from Vercel AI SDK (ai package) to follow
 * OpenTelemetry GenAI semantic conventions for billing attribution.
 *
 * It ONLY processes spans from the AI SDK's experimental_telemetry feature,
 * NOT spans from OpenAI/Anthropic instrumentation (which are handled by PaidSpanProcessor).
 */

import type { Context, SpanAttributeValue } from "@opentelemetry/api";
import type { SpanProcessor, Span, ReadableSpan } from "@opentelemetry/sdk-trace-base";
import { getTracingContext } from "./tracingContext.js";

/**
 * GenAI Semantic Conventions Attributes
 * https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/
 */
export const GenAIAttributes = {
    OPERATION_NAME: "gen_ai.operation.name",
    SYSTEM: "gen_ai.system",
    REQUEST_MODEL: "gen_ai.request.model",
    REQUEST_TEMPERATURE: "gen_ai.request.temperature",
    REQUEST_MAX_TOKENS: "gen_ai.request.max_tokens",
    REQUEST_TOP_P: "gen_ai.request.top_p",
    RESPONSE_MODEL: "gen_ai.response.model",
    RESPONSE_ID: "gen_ai.response.id",
    RESPONSE_FINISH_REASONS: "gen_ai.response.finish_reasons",
    USAGE_INPUT_TOKENS: "gen_ai.usage.input_tokens",
    USAGE_OUTPUT_TOKENS: "gen_ai.usage.output_tokens",
    USAGE_TOTAL_TOKENS: "gen_ai.usage.total_tokens",
} as const;

/**
 * AI SDK (Vercel) specific attributes
 */
export const AISDKAttributes = {
    MODEL_ID: "ai.model.id",
    MODEL_PROVIDER: "ai.model.provider",
    USAGE_PROMPT_TOKENS: "ai.usage.promptTokens",
    USAGE_COMPLETION_TOKENS: "ai.usage.completionTokens",
    RESPONSE_MODEL: "ai.response.model",
    RESPONSE_ID: "ai.response.id",
    RESPONSE_FINISH_REASON: "ai.response.finishReason",
    SETTINGS_TEMPERATURE: "ai.settings.temperature",
    SETTINGS_MAX_TOKENS: "ai.settings.maxTokens",
    SETTINGS_TOP_P: "ai.settings.topP",
    OPERATION_ID: "ai.operationId",
    TELEMETRY_FUNCTION_ID: "ai.telemetry.functionId",
} as const;

/**
 * Mapping from AI SDK attributes to GenAI attributes
 */
const ATTRIBUTE_MAPPING: Record<string, string> = {
    [AISDKAttributes.MODEL_ID]: GenAIAttributes.REQUEST_MODEL,
    [AISDKAttributes.MODEL_PROVIDER]: GenAIAttributes.SYSTEM,
    [AISDKAttributes.USAGE_PROMPT_TOKENS]: GenAIAttributes.USAGE_INPUT_TOKENS,
    [AISDKAttributes.USAGE_COMPLETION_TOKENS]: GenAIAttributes.USAGE_OUTPUT_TOKENS,
    [AISDKAttributes.RESPONSE_MODEL]: GenAIAttributes.RESPONSE_MODEL,
    [AISDKAttributes.RESPONSE_ID]: GenAIAttributes.RESPONSE_ID,
    [AISDKAttributes.RESPONSE_FINISH_REASON]: GenAIAttributes.RESPONSE_FINISH_REASONS,
    [AISDKAttributes.SETTINGS_TEMPERATURE]: GenAIAttributes.REQUEST_TEMPERATURE,
    [AISDKAttributes.SETTINGS_MAX_TOKENS]: GenAIAttributes.REQUEST_MAX_TOKENS,
    [AISDKAttributes.SETTINGS_TOP_P]: GenAIAttributes.REQUEST_TOP_P,
};

/**
 * Check if a span is from AI SDK telemetry (not from OpenInference instrumentation)
 */
function isAISDKSpan(span: ReadableSpan): boolean {
    const attrs = span.attributes;
    const name = span.name.toLowerCase();

    // Check for AI SDK specific attributes
    if (
        attrs[AISDKAttributes.MODEL_ID] ||
        attrs[AISDKAttributes.MODEL_PROVIDER] ||
        attrs[AISDKAttributes.OPERATION_ID] ||
        attrs[AISDKAttributes.TELEMETRY_FUNCTION_ID]
    ) {
        return true;
    }

    // Check span name patterns for Vercel AI SDK
    if (
        name.includes("ai.generatetext") ||
        name.includes("ai.streamtext") ||
        name.includes("ai.generateobject") ||
        name.includes("ai.streamobject") ||
        name.includes("ai.embed") ||
        name.includes("ai.embedmany") ||
        name.includes("ai.toolcall")
    ) {
        return true;
    }

    return false;
}

/**
 * Determine operation name from span
 */
function determineOperationName(span: ReadableSpan): string {
    const name = span.name.toLowerCase();

    if (name.includes("embed")) {
        return "embeddings";
    }
    if (name.includes("tool")) {
        return "execute_tool";
    }
    return "chat";
}

/**
 * AI SDK Span Processor
 *
 * Transforms AI SDK telemetry spans to GenAI semantic conventions.
 * Only processes spans from AI SDK, not from OpenInference instrumentation.
 */
export class AISDKSpanProcessor implements SpanProcessor {
    private static readonly SPAN_NAME_PREFIX = "paid.trace.";

    onStart(span: Span, _parentContext?: Context): void {
        const readableSpan = span as unknown as ReadableSpan;
        const { externalCustomerId, externalProductId: externalAgentId, storePrompt } = getTracingContext();

        // Check if we're in a trace() context
        const hasTracingContext = !!(externalCustomerId || externalAgentId);

        // Only process AI SDK spans
        if (!isAISDKSpan(readableSpan)) {
            // Still add attribution if we're in a trace context (for non-AI SDK spans in the trace)
            if (hasTracingContext) {
                if (externalCustomerId) {
                    span.setAttribute("external_customer_id", externalCustomerId);
                }
                if (externalAgentId) {
                    span.setAttribute("external_agent_id", externalAgentId);
                }
            }
            return;
        }

        const attrs = readableSpan.attributes;
        const mappedAttrs: Record<string, SpanAttributeValue> = {};

        // Map AI SDK attributes to GenAI format
        for (const [aiSdkKey, genAiKey] of Object.entries(ATTRIBUTE_MAPPING)) {
            const value = attrs[aiSdkKey];
            if (value !== undefined && attrs[genAiKey] === undefined) {
                mappedAttrs[genAiKey] = value;
            }
        }

        // Set operation name
        if (!attrs[GenAIAttributes.OPERATION_NAME]) {
            mappedAttrs[GenAIAttributes.OPERATION_NAME] = determineOperationName(readableSpan);
        }

        // Calculate total tokens
        const inputTokens = (attrs[GenAIAttributes.USAGE_INPUT_TOKENS] ||
            mappedAttrs[GenAIAttributes.USAGE_INPUT_TOKENS] ||
            attrs[AISDKAttributes.USAGE_PROMPT_TOKENS]) as number | undefined;
        const outputTokens = (attrs[GenAIAttributes.USAGE_OUTPUT_TOKENS] ||
            mappedAttrs[GenAIAttributes.USAGE_OUTPUT_TOKENS] ||
            attrs[AISDKAttributes.USAGE_COMPLETION_TOKENS]) as number | undefined;

        if (inputTokens !== undefined && outputTokens !== undefined) {
            mappedAttrs[GenAIAttributes.USAGE_TOTAL_TOKENS] = inputTokens + outputTokens;
        }

        // Set mapped attributes
        if (Object.keys(mappedAttrs).length > 0) {
            span.setAttributes(mappedAttrs);
        }

        // Add billing attribution
        if (externalCustomerId) {
            span.setAttribute("external_customer_id", externalCustomerId);
        }
        if (externalAgentId) {
            span.setAttribute("external_agent_id", externalAgentId);
        }

        // Set event_name for billing
        const operationName = (attrs[GenAIAttributes.OPERATION_NAME] || mappedAttrs[GenAIAttributes.OPERATION_NAME]) as
            | string
            | undefined;
        if (operationName === "embeddings" || operationName === "embed") {
            span.setAttribute("event_name", "embedding");
        } else {
            span.setAttribute("event_name", "llm");
        }

        // Update span name with prefix and .signal suffix
        const name = readableSpan.name;
        if (name && !name.startsWith(AISDKSpanProcessor.SPAN_NAME_PREFIX)) {
            span.updateName(`${AISDKSpanProcessor.SPAN_NAME_PREFIX}${name}.signal`);
        }

        // Handle content filtering if storePrompt is false
        if (!storePrompt) {
            this.filterPromptAttributes(span);
        }
    }

    private filterPromptAttributes(span: Span): void {
        const PROMPT_SUBSTRINGS = [
            "ai.prompt",
            "ai.response.text",
            "gen_ai.prompt",
            "gen_ai.completion",
        ];

        const existingAttrs = (span as unknown as { attributes: Record<string, unknown> }).attributes;
        if (existingAttrs) {
            for (const key of Object.keys(existingAttrs)) {
                if (PROMPT_SUBSTRINGS.some((s) => key.includes(s))) {
                    delete existingAttrs[key];
                }
            }
        }

        // Patch setAttribute for future attributes
        const originalSetAttribute = span.setAttribute;
        span.setAttribute = function (key: string, value: SpanAttributeValue): Span {
            if (PROMPT_SUBSTRINGS.some((s) => key.includes(s))) {
                return this;
            }
            return originalSetAttribute.call(this, key, value);
        };
    }

    onEnd(_span: ReadableSpan): void {
        // No additional processing needed
    }

    async shutdown(): Promise<void> {
        // No cleanup needed
    }

    async forceFlush(): Promise<void> {
        // No buffered data
    }
}
