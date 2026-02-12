import type { Context, SpanAttributeValue } from "@opentelemetry/api";
import type { SpanProcessor, Span, ReadableSpan } from "@opentelemetry/sdk-trace-base";
import { getTracingContext } from "./tracingContext.js";

/**
 * GenAI Semantic Conventions Attributes
 * Based on OpenTelemetry Gen-AI Semantic Conventions
 * https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/
 */
const GenAIAttributes = {
    // Operation attributes
    OPERATION_NAME: "gen_ai.operation.name",
    PROVIDER_NAME: "gen_ai.provider.name",
    SYSTEM: "gen_ai.system",

    // Request attributes
    REQUEST_MODEL: "gen_ai.request.model",
    REQUEST_TEMPERATURE: "gen_ai.request.temperature",
    REQUEST_MAX_TOKENS: "gen_ai.request.max_tokens",
    REQUEST_TOP_P: "gen_ai.request.top_p",
    REQUEST_FREQUENCY_PENALTY: "gen_ai.request.frequency_penalty",
    REQUEST_PRESENCE_PENALTY: "gen_ai.request.presence_penalty",
    REQUEST_STOP_SEQUENCES: "gen_ai.request.stop_sequences",

    // Response attributes
    RESPONSE_MODEL: "gen_ai.response.model",
    RESPONSE_ID: "gen_ai.response.id",
    RESPONSE_FINISH_REASONS: "gen_ai.response.finish_reasons",

    // Usage attributes
    USAGE_INPUT_TOKENS: "gen_ai.usage.input_tokens",
    USAGE_OUTPUT_TOKENS: "gen_ai.usage.output_tokens",
    USAGE_TOTAL_TOKENS: "gen_ai.usage.total_tokens",

    // Content attributes
    PROMPT: "gen_ai.prompt",
    COMPLETION: "gen_ai.completion",

    // Error attributes
    ERROR_TYPE: "error.type",
} as const;

/**
 * AI SDK (Vercel) specific attributes that need to be mapped to GenAI format
 */
const AISDKAttributes = {
    // Model attributes
    MODEL_ID: "ai.model.id",
    MODEL_PROVIDER: "ai.model.provider",

    // Usage attributes
    USAGE_PROMPT_TOKENS: "ai.usage.promptTokens",
    USAGE_COMPLETION_TOKENS: "ai.usage.completionTokens",

    // Response attributes
    RESPONSE_MODEL: "ai.response.model",
    RESPONSE_ID: "ai.response.id",
    RESPONSE_FINISH_REASON: "ai.response.finishReason",

    // Settings attributes
    SETTINGS_TEMPERATURE: "ai.settings.temperature",
    SETTINGS_MAX_TOKENS: "ai.settings.maxTokens",
    SETTINGS_TOP_P: "ai.settings.topP",
    SETTINGS_FREQUENCY_PENALTY: "ai.settings.frequencyPenalty",
    SETTINGS_PRESENCE_PENALTY: "ai.settings.presencePenalty",

    // Operation attributes
    OPERATION_ID: "ai.operationId",
    OPERATION_NAME: "operation.name",

    // Prompt/response
    PROMPT: "ai.prompt",
    RESPONSE_TEXT: "ai.response.text",

    // Telemetry
    TELEMETRY_FUNCTION_ID: "ai.telemetry.functionId",
    TELEMETRY_METADATA: "ai.telemetry.metadata",
} as const;

/**
 * OpenInference span kind attribute
 */
const OPENINFERENCE_SPAN_KIND = "openinference.span.kind";

/**
 * OpenInference span kinds
 */
const OpenInferenceSpanKinds = {
    LLM: "LLM",
    EMBEDDING: "EMBEDDING",
    CHAIN: "CHAIN",
    TOOL: "TOOL",
    AGENT: "AGENT",
} as const;

/**
 * Mapping from AI SDK attributes to GenAI attributes
 */
const ATTRIBUTE_MAPPING: Record<string, string> = {
    // Model mapping
    [AISDKAttributes.MODEL_ID]: GenAIAttributes.REQUEST_MODEL,
    [AISDKAttributes.MODEL_PROVIDER]: GenAIAttributes.PROVIDER_NAME,

    // Usage mapping
    [AISDKAttributes.USAGE_PROMPT_TOKENS]: GenAIAttributes.USAGE_INPUT_TOKENS,
    [AISDKAttributes.USAGE_COMPLETION_TOKENS]: GenAIAttributes.USAGE_OUTPUT_TOKENS,

    // Response mapping
    [AISDKAttributes.RESPONSE_MODEL]: GenAIAttributes.RESPONSE_MODEL,
    [AISDKAttributes.RESPONSE_ID]: GenAIAttributes.RESPONSE_ID,
    [AISDKAttributes.RESPONSE_FINISH_REASON]: GenAIAttributes.RESPONSE_FINISH_REASONS,

    // Settings mapping
    [AISDKAttributes.SETTINGS_TEMPERATURE]: GenAIAttributes.REQUEST_TEMPERATURE,
    [AISDKAttributes.SETTINGS_MAX_TOKENS]: GenAIAttributes.REQUEST_MAX_TOKENS,
    [AISDKAttributes.SETTINGS_TOP_P]: GenAIAttributes.REQUEST_TOP_P,
    [AISDKAttributes.SETTINGS_FREQUENCY_PENALTY]: GenAIAttributes.REQUEST_FREQUENCY_PENALTY,
    [AISDKAttributes.SETTINGS_PRESENCE_PENALTY]: GenAIAttributes.REQUEST_PRESENCE_PENALTY,

    // Content mapping
    [AISDKAttributes.PROMPT]: GenAIAttributes.PROMPT,
    [AISDKAttributes.RESPONSE_TEXT]: GenAIAttributes.COMPLETION,
};

/**
 * Well-known provider names mapping
 */
const PROVIDER_MAPPING: Record<string, string> = {
    openai: "openai",
    "openai.chat": "openai",
    "openai.completion": "openai",
    "openai.embedding": "openai",
    anthropic: "anthropic",
    "anthropic.messages": "anthropic",
    google: "gcp.gemini",
    "google.generative-ai": "gcp.gemini",
    mistral: "mistral_ai",
    cohere: "cohere",
    groq: "groq",
    bedrock: "aws.bedrock",
    azure: "azure.ai.openai",
};

/**
 * Check if a span is from AI SDK based on its attributes
 */
function isAISDKSpan(span: ReadableSpan): boolean {
    const attrs = span.attributes;
    // Check for AI SDK specific attributes
    return !!(
        attrs[AISDKAttributes.MODEL_ID] ||
        attrs[AISDKAttributes.MODEL_PROVIDER] ||
        attrs[AISDKAttributes.OPERATION_ID] ||
        attrs[GenAIAttributes.REQUEST_MODEL] ||
        attrs[GenAIAttributes.PROVIDER_NAME] ||
        // Also check span name patterns
        span.name.includes("ai.generateText") ||
        span.name.includes("ai.streamText") ||
        span.name.includes("ai.generateObject") ||
        span.name.includes("ai.streamObject") ||
        span.name.includes("ai.embed") ||
        span.name.includes("ai.embedMany") ||
        span.name.includes("ai.toolCall")
    );
}

/**
 * Determine the OpenInference span kind based on the span
 */
function determineSpanKind(span: ReadableSpan): string {
    const name = span.name.toLowerCase();
    const operationName = span.attributes[AISDKAttributes.OPERATION_NAME] as string | undefined;

    if (name.includes("embed") || operationName?.includes("embed")) {
        return OpenInferenceSpanKinds.EMBEDDING;
    }
    if (name.includes("tool") || operationName?.includes("tool")) {
        return OpenInferenceSpanKinds.TOOL;
    }
    if (name.includes("agent") || operationName?.includes("agent")) {
        return OpenInferenceSpanKinds.AGENT;
    }
    // Default to LLM for generateText, streamText, generateObject, streamObject
    return OpenInferenceSpanKinds.LLM;
}

/**
 * Determine the operation name for GenAI
 */
function determineOperationName(span: ReadableSpan): string {
    const name = span.name.toLowerCase();

    if (name.includes("embed")) {
        return "embeddings";
    }
    if (name.includes("tool")) {
        return "execute_tool";
    }
    if (name.includes("agent")) {
        return "invoke_agent";
    }
    return "chat";
}

/**
 * Normalize provider name to GenAI semantic convention format
 */
function normalizeProvider(provider: string | undefined): string | undefined {
    if (!provider) return undefined;
    const normalized = provider.toLowerCase();
    return PROVIDER_MAPPING[normalized] || normalized;
}

/**
 * GenAI Span Processor for AI SDK
 *
 * This processor transforms spans from Vercel AI SDK to follow
 * OpenTelemetry GenAI semantic conventions.
 *
 * Key features:
 * - Maps ai.* attributes to gen_ai.* attributes
 * - Adds OpenInference span kind
 * - Preserves original attributes while adding standardized ones
 * - Adds Paid-specific context attributes
 *
 * Usage:
 * 1. Add this processor to your OpenTelemetry SDK configuration
 * 2. Enable telemetry in AI SDK calls: experimental_telemetry: { isEnabled: true }
 *
 * @example
 * ```typescript
 * import { GenAISpanProcessor } from "@paid-ai/paid-node/tracing";
 *
 * const processor = new GenAISpanProcessor();
 * tracerProvider.addSpanProcessor(processor);
 * ```
 */
export class GenAISpanProcessor implements SpanProcessor {
    private static readonly SPAN_NAME_PREFIX = "paid.trace.";

    onStart(span: Span, _parentContext?: Context): void {
        const readableSpan = span as unknown as ReadableSpan;

        // Only process AI SDK spans
        if (!isAISDKSpan(readableSpan)) {
            return;
        }

        const { externalCustomerId, externalProductId: externalAgentId, storePrompt } = getTracingContext();
        const attrs = readableSpan.attributes;

        // Add GenAI semantic convention attributes by mapping from AI SDK attributes
        const mappedAttrs: Record<string, SpanAttributeValue> = {};

        // Map attributes from AI SDK to GenAI format
        for (const [aiSdkKey, genAiKey] of Object.entries(ATTRIBUTE_MAPPING)) {
            const value = attrs[aiSdkKey];
            if (value !== undefined && attrs[genAiKey] === undefined) {
                mappedAttrs[genAiKey] = value;
            }
        }

        // Set operation name if not present
        if (!attrs[GenAIAttributes.OPERATION_NAME]) {
            mappedAttrs[GenAIAttributes.OPERATION_NAME] = determineOperationName(readableSpan);
        }

        // Normalize and set provider name
        const provider = (attrs[AISDKAttributes.MODEL_PROVIDER] || attrs[GenAIAttributes.PROVIDER_NAME]) as
            | string
            | undefined;
        const normalizedProvider = normalizeProvider(provider);
        if (normalizedProvider && !attrs[GenAIAttributes.PROVIDER_NAME]) {
            mappedAttrs[GenAIAttributes.PROVIDER_NAME] = normalizedProvider;
        }
        // Also set gen_ai.system for backwards compatibility
        if (normalizedProvider && !attrs[GenAIAttributes.SYSTEM]) {
            mappedAttrs[GenAIAttributes.SYSTEM] = normalizedProvider;
        }

        // Add OpenInference span kind
        if (!attrs[OPENINFERENCE_SPAN_KIND]) {
            mappedAttrs[OPENINFERENCE_SPAN_KIND] = determineSpanKind(readableSpan);
        }

        // Calculate total tokens if we have input and output tokens
        const inputTokens = (attrs[GenAIAttributes.USAGE_INPUT_TOKENS] || mappedAttrs[GenAIAttributes.USAGE_INPUT_TOKENS]) as number | undefined;
        const outputTokens = (attrs[GenAIAttributes.USAGE_OUTPUT_TOKENS] || mappedAttrs[GenAIAttributes.USAGE_OUTPUT_TOKENS]) as number | undefined;
        if (inputTokens !== undefined && outputTokens !== undefined && !attrs[GenAIAttributes.USAGE_TOTAL_TOKENS]) {
            mappedAttrs[GenAIAttributes.USAGE_TOTAL_TOKENS] = inputTokens + outputTokens;
        }

        // Set mapped attributes on span
        if (Object.keys(mappedAttrs).length > 0) {
            span.setAttributes(mappedAttrs);
        }

        // Add Paid-specific context attributes
        if (externalCustomerId) {
            span.setAttribute("external_customer_id", externalCustomerId);
        }
        if (externalAgentId) {
            span.setAttribute("external_agent_id", externalAgentId);
        }

        // Update span name with prefix
        const name = readableSpan.name;
        if (name && !name.startsWith(GenAISpanProcessor.SPAN_NAME_PREFIX)) {
            span.updateName(`${GenAISpanProcessor.SPAN_NAME_PREFIX}${name}`);
        }

        // Handle content filtering if storePrompt is false
        if (!storePrompt) {
            this.filterPromptAttributes(span);
        }
    }

    /**
     * Filter prompt-related attributes for privacy
     */
    private filterPromptAttributes(span: Span): void {
        const PROMPT_ATTRIBUTES_SUBSTRINGS: string[] = [
            "gen_ai.completion",
            "gen_ai.prompt",
            "gen_ai.request.messages",
            "gen_ai.response.messages",
            "gen_ai.input.messages",
            "gen_ai.output.messages",
            "gen_ai.system_instructions",
            "ai.prompt",
            "ai.response.text",
            "llm.output_message",
            "llm.input_message",
            "llm.prompts",
            "output.value",
            "input.value",
        ];

        // Filter existing attributes
        const existingAttrs = (span as unknown as { attributes: Record<string, unknown> }).attributes;
        if (existingAttrs) {
            for (const key of Object.keys(existingAttrs)) {
                if (PROMPT_ATTRIBUTES_SUBSTRINGS.some((s) => key.includes(s))) {
                    delete existingAttrs[key];
                }
            }
        }

        // Patch setAttribute/setAttributes for attributes set after onStart
        const originalSetAttribute = span.setAttribute;
        span.setAttribute = function (key: string, value: SpanAttributeValue): Span {
            const isPromptRelated = PROMPT_ATTRIBUTES_SUBSTRINGS.some((substr) => key.includes(substr));
            if (isPromptRelated) return this;
            return originalSetAttribute.call(this, key, value);
        };

        const originalSetAttributes = span.setAttributes;
        span.setAttributes = function (attributes: Record<string, SpanAttributeValue>): Span {
            const filteredAttributes: Record<string, SpanAttributeValue> = {};
            for (const [key, value] of Object.entries(attributes)) {
                const isPromptRelated = PROMPT_ATTRIBUTES_SUBSTRINGS.some((substr) => key.includes(substr));
                if (!isPromptRelated) {
                    filteredAttributes[key] = value;
                }
            }
            return originalSetAttributes.call(this, filteredAttributes);
        };
    }

    onEnd(_span: ReadableSpan): void {
        // Span attributes are already set in onStart
        // No additional processing needed on end
    }

    async shutdown(): Promise<void> {
        // No cleanup needed
    }

    async forceFlush(): Promise<void> {
        // No buffered data to flush
    }
}

/**
 * Export constants for external use
 */
export { GenAIAttributes, AISDKAttributes, OpenInferenceSpanKinds, OPENINFERENCE_SPAN_KIND };
