import { SpanStatusCode } from "@opentelemetry/api";

import {
    generateText as originalGenerateText,
    streamText as originalStreamText,
    generateObject as originalGenerateObject,
    streamObject as originalStreamObject,
    embed as originalEmbed,
    embedMany as originalEmbedMany,
} from "ai";
import { getPaidTracer, getToken } from "tracing/tracing.js";
import { getTracingContext } from "tracing/tracingContext.js";

type GenerateTextParams = Parameters<typeof originalGenerateText>[0];
type StreamTextParams = Parameters<typeof originalStreamText>[0];
type GenerateObjectParams = Parameters<typeof originalGenerateObject>[0];
type StreamObjectParams = Parameters<typeof originalStreamObject>[0];
type EmbedParams = Parameters<typeof originalEmbed>[0];
type EmbedManyParams = Parameters<typeof originalEmbedMany>[0];

function getModelInfo(model: any): { system: string; modelName?: string } {
    if (model?.modelId) {
        const modelId = model.modelId;
        if (modelId.startsWith("gpt-") || modelId.startsWith("text-embedding-") || modelId.startsWith("dall-e-")) {
            return { system: "openai", modelName: modelId };
        }
        if (modelId.startsWith("claude-")) {
            return { system: "anthropic", modelName: modelId };
        }
        if (modelId.startsWith("mistral-") || modelId.startsWith("codestral-")) {
            return { system: "mistral", modelName: modelId };
        }
        if (modelId.includes("gemini")) {
            return { system: "google", modelName: modelId };
        }
    }

    if (model?.provider) {
        return { system: model.provider, modelName: model.modelId };
    }

    return { system: "unknown" };
}

function extractUsageMetrics(usage: any): Record<string, any> {
    const usageAttrs: Record<string, any> = {};
    const inputTokens = usage.promptTokens || usage.prompt_tokens || usage.inputTokens;
    const outputTokens = usage.completionTokens || usage.completion_tokens || usage.outputTokens;
    const cachedTokens = usage.cachedPromptTokens || usage.cached_prompt_tokens || usage.cachedInputTokens;

    if (inputTokens !== undefined) {
        usageAttrs["gen_ai.usage.input_tokens"] = inputTokens;
    }
    if (outputTokens !== undefined) {
        usageAttrs["gen_ai.usage.output_tokens"] = outputTokens;
    }
    if (cachedTokens !== undefined) {
        usageAttrs["gen_ai.usage.cached_input_tokens"] = cachedTokens;
    }

    if (usage.tokens !== undefined && inputTokens === undefined) {
        usageAttrs["gen_ai.usage.input_tokens"] = usage.tokens;
    }

    return usageAttrs;
}

function validateContext() {
    const token = getToken();
    const { externalCustomerId, externalAgentId } = getTracingContext();

    if (!token || !externalCustomerId) {
        throw new Error(
            "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace().",
        );
    }

    return {
        externalCustomerId,
        externalAgentId: externalAgentId,
        token,
    };
}

export async function generateText(params: GenerateTextParams): Promise<ReturnType<typeof originalGenerateText>> {
    const context = validateContext();
    const { system: aiSystem, modelName } = getModelInfo(params.model);
    const tracer = getPaidTracer();

    if (!tracer) {
        throw new Error("Paid tracer is not initialized, Make sure to call 'initializeTracing()' first");
    }

    return tracer.startActiveSpan("trace.ai-sdk.generateText", async (span) => {
        const attributes: Record<string, any> = {
            "gen_ai.system": aiSystem,
            "gen_ai.operation.name": "chat",
            external_customer_id: context.externalCustomerId,
            token: context.token,
        };

        if (context.externalAgentId) {
            attributes["external_agent_id"] = context.externalAgentId;
        }

        if (modelName) {
            attributes["gen_ai.request.model"] = modelName;
        }

        span.setAttributes(attributes);

        try {
            const result = await originalGenerateText(params);

            if (result.usage) {
                const usageAttrs = extractUsageMetrics(result.usage);
                span.setAttributes(usageAttrs);
            }

            if (result.response?.modelId) {
                span.setAttribute("gen_ai.response.model", result.response.modelId);
            }

            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    });
}

export async function streamText(params: StreamTextParams): Promise<ReturnType<typeof originalStreamText>> {
    const context = validateContext();
    const { system: aiSystem, modelName } = getModelInfo(params.model);
    const tracer = getPaidTracer();

    if (!tracer) {
        throw new Error("Paid tracer is not initialized, Make sure to call 'initializeTracing()' first");
    }

    return tracer.startActiveSpan("trace.ai-sdk.streamText", async (span) => {
        const attributes: Record<string, any> = {
            "gen_ai.system": aiSystem,
            "gen_ai.operation.name": "chat",
            external_customer_id: context.externalCustomerId,
            token: context.token,
        };

        if (context.externalAgentId) {
            attributes["external_agent_id"] = context.externalAgentId;
        }

        if (modelName) {
            attributes["gen_ai.request.model"] = modelName;
        }

        span.setAttributes(attributes);

        try {
            const originalOnFinish = params.onFinish;
            const wrappedParams = {
                ...params,
                onFinish: (result: any) => {
                    if (result.usage) {
                        const usageAttrs = extractUsageMetrics(result.usage);
                        span.setAttributes(usageAttrs);
                    }

                    if (originalOnFinish) {
                        originalOnFinish(result);
                    }

                    span.setStatus({ code: SpanStatusCode.OK });
                    span.end();
                },
            };

            const result = originalStreamText(wrappedParams);
            return result;
        } catch (error: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    });
}

export async function generateObject(params: GenerateObjectParams): Promise<ReturnType<typeof originalGenerateObject>> {
    const context = validateContext();
    const { system: aiSystem, modelName } = getModelInfo(params.model);
    const tracer = getPaidTracer();

    if (!tracer) {
        throw new Error("Paid tracer is not initialized, Make sure to call 'initializeTracing()' first");
    }

    return tracer.startActiveSpan("trace.ai-sdk.generateObject", async (span) => {
        const attributes: Record<string, any> = {
            "gen_ai.system": aiSystem,
            "gen_ai.operation.name": "chat",
            external_customer_id: context.externalCustomerId,
            token: context.token,
        };

        if (context.externalAgentId) {
            attributes["external_agent_id"] = context.externalAgentId;
        }

        if (modelName) {
            attributes["gen_ai.request.model"] = modelName;
        }

        span.setAttributes(attributes);

        try {
            const result = await originalGenerateObject(params);

            if (result.usage) {
                const usageAttrs = extractUsageMetrics(result.usage);
                span.setAttributes(usageAttrs);
            }

            if (result.response?.modelId) {
                span.setAttribute("gen_ai.response.model", result.response.modelId);
            }

            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    });
}

export async function streamObject(params: StreamObjectParams): Promise<ReturnType<typeof originalStreamObject>> {
    const context = validateContext();
    const { system: aiSystem, modelName } = getModelInfo(params.model);

    const tracer = getPaidTracer();

    if (!tracer) {
        throw new Error("Paid tracer is not initialized, Make sure to call 'initializeTracing()' first");
    }

    return tracer.startActiveSpan("trace.ai-sdk.streamObject", async (span) => {
        const attributes: Record<string, any> = {
            "gen_ai.system": aiSystem,
            "gen_ai.operation.name": "chat",
            external_customer_id: context.externalCustomerId,
            token: context.token,
        };

        if (context.externalAgentId) {
            attributes["external_agent_id"] = context.externalAgentId;
        }

        if (modelName) {
            attributes["gen_ai.request.model"] = modelName;
        }

        span.setAttributes(attributes);

        try {
            const originalOnFinish = params.onFinish;
            const wrappedParams = {
                ...params,
                onFinish: (result: any) => {
                    if (result.usage) {
                        const usageAttrs = extractUsageMetrics(result.usage);
                        span.setAttributes(usageAttrs);
                    }

                    if (originalOnFinish) {
                        originalOnFinish(result);
                    }

                    span.setStatus({ code: SpanStatusCode.OK });
                    span.end();
                },
            };

            const result = originalStreamObject(wrappedParams);
            return result;
        } catch (error: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            span.recordException(error);
            throw error;
        }
    });
}

export async function embed(params: EmbedParams): Promise<ReturnType<typeof originalEmbed>> {
    const context = validateContext();
    const { system: aiSystem, modelName } = getModelInfo(params.model);
    const tracer = getPaidTracer();

    if (!tracer) {
        throw new Error("Paid tracer is not initialized, Make sure to call 'initializeTracing()' first");
    }
    return tracer.startActiveSpan("trace.ai-sdk.embed", async (span) => {
        const attributes: Record<string, any> = {
            "gen_ai.system": aiSystem,
            "gen_ai.operation.name": "embeddings",
            external_customer_id: context.externalCustomerId,
            token: context.token,
        };

        if (context.externalAgentId) {
            attributes["external_agent_id"] = context.externalAgentId;
        }

        if (modelName) {
            attributes["gen_ai.request.model"] = modelName;
        }

        span.setAttributes(attributes);

        try {
            const result = await originalEmbed(params);

            if (result.usage) {
                const usageAttrs = extractUsageMetrics(result.usage);
                span.setAttributes(usageAttrs);
            }

            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    });
}

export async function embedMany(params: EmbedManyParams): Promise<ReturnType<typeof originalEmbedMany>> {
    const context = validateContext();
    const { system: aiSystem, modelName } = getModelInfo(params.model);
    const tracer = getPaidTracer();

    if (!tracer) {
        throw new Error("Paid tracer is not initialized, Make sure to call 'initializeTracing()' first");
    }

    return tracer.startActiveSpan("trace.ai-sdk.embedMany", async (span) => {
        const attributes: Record<string, any> = {
            "gen_ai.system": aiSystem,
            "gen_ai.operation.name": "embeddings",
            external_customer_id: context.externalCustomerId,
            token: context.token,
        };

        if (context.externalAgentId) {
            attributes["external_agent_id"] = context.externalAgentId;
        }

        if (modelName) {
            attributes["gen_ai.request.model"] = modelName;
        }

        span.setAttributes(attributes);

        try {
            const result = await originalEmbedMany(params);

            if (result.usage) {
                const usageAttrs = extractUsageMetrics(result.usage);
                span.setAttributes(usageAttrs);
            }

            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error: any) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    });
}

export default {
    generateText,
    streamText,
    generateObject,
    streamObject,
    embed,
    embedMany,
};
