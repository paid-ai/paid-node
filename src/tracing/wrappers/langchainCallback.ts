import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { SpanStatusCode } from "@opentelemetry/api";
import type { Tracer, Span } from "@opentelemetry/api";
import { getPaidTracer, getToken } from "tracing/tracing.js";
import { getTracingContext } from "tracing/tracingContext.js";

interface SerializedData {
    id?: string[];
    [key: string]: any;
}

interface Metadata {
    ls_model_type?: string;
    ls_model_name?: string;
    [key: string]: any;
}

export class PaidLangChainCallback extends BaseCallbackHandler {
    name = "PaidLangChainCallback";
    private tracer: Tracer;
    private spans: Map<string, Span> = new Map();

    constructor() {
        super();
        const tracer = getPaidTracer();

        if (!tracer) {
            throw new Error("Paid tracer is not initialized, Make sure to call 'initializeTracing()' first");
        }
        this.tracer = tracer;
    }

    private extractProvider(serialized: SerializedData): string {
        if (!serialized?.id) return "unknown";

        const idStr = serialized.id.join(" ").toLowerCase();

        if (idStr.includes("openai")) return "openai";
        if (idStr.includes("anthropic")) return "anthropic";
        if (idStr.includes("mistral")) return "mistral";
        if (idStr.includes("cohere")) return "cohere";
        if (idStr.includes("huggingface")) return "huggingface";
        if (idStr.includes("azure")) return "azure";

        return "unknown";
    }

    async handleLLMStart(
        llm: SerializedData,
        prompts: string[],
        runId: string,
        parentRunId?: string,
        extraParams?: Record<string, unknown>,
        tags?: string[],
        metadata?: Metadata,
    ): Promise<void> {
        const { externalProductId, externalCustomerId } = getTracingContext();
        const token = getToken();

        if (!token || !externalCustomerId) {
            throw new Error(
                "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace().",
            );
        }

        const modelType = metadata?.ls_model_type || "unknown";
        const modelName = metadata?.ls_model_name || "unknown";
        const spanName = `trace.langchain.${modelType}`;

        const span = this.tracer.startSpan(spanName);

        const attributes: Record<string, any> = {
            "gen_ai.system": this.extractProvider(llm),
            "gen_ai.operation.name": modelType,
            "gen_ai.request.model": modelName,
            external_customer_id: externalCustomerId,
            token: token,
        };

        if (externalProductId) {
            attributes["external_agent_id"] = externalProductId;
        }

        span.setAttributes(attributes);
        this.spans.set(runId, span);
    }

    async handleLLMEnd(output: any, runId: string, parentRunId?: string): Promise<void> {
        const span = this.spans.get(runId);
        if (!span) return;

        try {
            const attributes: Record<string, any> = {};

            // Extract token usage information
            if (output.llmOutput?.tokenUsage) {
                const usage = output.llmOutput.tokenUsage;
                if (usage.promptTokens !== undefined) {
                    attributes["gen_ai.usage.input_tokens"] = usage.promptTokens;
                }
                if (usage.completionTokens !== undefined) {
                    attributes["gen_ai.usage.output_tokens"] = usage.completionTokens;
                }
                if (usage.cachedInputTokens !== undefined) {
                    attributes["gen_ai.usage.cached_input_tokens"] = usage.cachedInputTokens;
                }
                if (usage.reasoningOutputTokens !== undefined) {
                    attributes["gen_ai.usage.reasoning_output_tokens"] = usage.reasoningOutputTokens;
                }
            }

            // Alternative token usage format (some providers use different field names)
            if (output.llmOutput?.token_usage) {
                const usage = output.llmOutput.token_usage;
                if (usage.prompt_tokens !== undefined) {
                    attributes["gen_ai.usage.input_tokens"] = usage.prompt_tokens;
                }
                if (usage.completion_tokens !== undefined) {
                    attributes["gen_ai.usage.output_tokens"] = usage.completion_tokens;
                }
                if (usage.cached_input_tokens !== undefined) {
                    attributes["gen_ai.usage.cached_input_tokens"] = usage.cached_input_tokens;
                }
                if (usage.reasoning_output_tokens !== undefined) {
                    attributes["gen_ai.usage.reasoning_output_tokens"] = usage.reasoning_output_tokens;
                }
            }

            // Add model from response if available
            if (output.llmOutput?.modelName) {
                attributes["gen_ai.response.model"] = output.llmOutput.modelName;
            } else if (output.llmOutput?.model_name) {
                attributes["gen_ai.response.model"] = output.llmOutput.model_name;
            } else if (output.generations?.[0]?.[0]?.message?.["response_metadata"]?.model_name) {
                attributes["gen_ai.response.model"] = output.generations[0][0].message["response_metadata"].model_name;
            }

            span.setAttributes(attributes);
            span.setStatus({ code: SpanStatusCode.OK });
        } finally {
            span.end();
            this.spans.delete(runId);
        }
    }

    async handleLLMError(err: Error, runId: string, parentRunId?: string): Promise<void> {
        const span = this.spans.get(runId);
        if (!span) return;

        try {
            span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            span.recordException(err);
        } finally {
            span.end();
            this.spans.delete(runId);
        }
    }
}
