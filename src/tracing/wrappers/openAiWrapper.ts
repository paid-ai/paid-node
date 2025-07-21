import OpenAI from "openai";
import { SpanStatusCode, Tracer } from "@opentelemetry/api";
import { getCustomerIdStorage, getAgentIdStorage, getTokenStorage, paidTracer } from "../tracing.js";
import { ChatCompletion, ChatCompletionCreateParams } from "openai/resources/chat/completions";
import { EmbeddingCreateParams } from "openai/resources/embeddings";
import { ImagesResponse, ImageGenerateParams } from "openai/resources/images";
import { CreateEmbeddingResponse } from "openai/resources/embeddings";

export class PaidOpenAI {
    private readonly openai: OpenAI;
    private readonly tracer: Tracer;

    constructor(openaiClient: any) {
        this.openai = openaiClient;
        this.tracer = paidTracer;
    }

    public get chat(): ChatWrapper {
        return new ChatWrapper(this.openai, this.tracer);
    }

    public get embeddings(): EmbeddingsWrapper {
        return new EmbeddingsWrapper(this.openai, this.tracer);
    }

    public get images(): ImagesWrapper {
        return new ImagesWrapper(this.openai, this.tracer);
    }

    public get responses(): ResponsesWrapper {
        return new ResponsesWrapper(this.openai, this.tracer);
    }
}

class ChatWrapper {
    constructor(
        private openai: OpenAI,
        private tracer: Tracer,
    ) {}

    public get completions(): ChatCompletionsWrapper {
        return new ChatCompletionsWrapper(this.openai, this.tracer);
    }
}

class ChatCompletionsWrapper {
    constructor(
        private openai: OpenAI,
        private tracer: Tracer,
    ) {}

    public async create(params: ChatCompletionCreateParams): Promise<ChatCompletion> {
        const externalCustomerId = getCustomerIdStorage();
        const externalAgentId = getAgentIdStorage();
        const token = getTokenStorage();

        if (!token || !externalCustomerId) {
            throw new Error(
                "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace().",
            );
        }

        return this.tracer.startActiveSpan("trace.openai.chat", async (span) => {
            const attributes: Record<string, any> = {
                "gen_ai.system": "openai",
                "gen_ai.operation.name": "chat",
            };
            attributes["external_customer_id"] = externalCustomerId;
            attributes["token"] = token;
            if (externalAgentId) {
                attributes["external_agent_id"] = externalAgentId;
            }
            span.setAttributes(attributes);

            try {
                const response = (await this.openai.chat.completions.create(params)) as ChatCompletion;

                if (response.usage) {
                    span.setAttributes({
                        "gen_ai.usage.input_tokens": response.usage.prompt_tokens,
                        "gen_ai.usage.output_tokens": response.usage.completion_tokens,
                        "gen_ai.response.model": response.model,
                    });
                }

                span.setStatus({ code: SpanStatusCode.OK });
                return response;
            } catch (error: any) {
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                span.recordException(error);
                throw error;
            } finally {
                span.end();
            }
        });
    }
}

type ResponseCreateParams = any;
type Response = any;
class ResponsesWrapper {
    constructor(
        private openai: any,
        private tracer: Tracer,
    ) {}

    public async create(params: ResponseCreateParams): Promise<Response> {
        const externalCustomerId = getCustomerIdStorage();
        const externalAgentId = getAgentIdStorage();
        const token = getTokenStorage();

        if (!token || !externalCustomerId) {
            throw new Error(
                "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace().",
            );
        }

        return this.tracer.startActiveSpan("trace.openai.responses", async (span) => {
            const attributes: Record<string, any> = {
                "gen_ai.system": "openai",
                "gen_ai.operation.name": "chat", // Equivalent to chat.completions
            };
            attributes["external_customer_id"] = externalCustomerId;
            attributes["token"] = token;
            if (externalAgentId) {
                attributes["external_agent_id"] = externalAgentId;
            }
            span.setAttributes(attributes);

            try {
                const response = await this.openai.responses.create(params);

                if (response.usage) {
                    span.setAttributes({
                        "gen_ai.usage.input_tokens": response.usage.input_tokens,
                        "gen_ai.usage.output_tokens": response.usage.output_tokens,
                        "gen_ai.response.model": response.model,
                    });
                    if (response.usage.input_tokens_details?.cached_tokens) {
                        span.setAttribute(
                            "gen_ai.usage.cached_input_tokens",
                            response.usage.input_tokens_details.cached_tokens,
                        );
                    }
                    if (response.usage.output_tokens_details?.reasoning_tokens) {
                        span.setAttribute(
                            "gen_ai.usage.reasoning_output_tokens",
                            response.usage.output_tokens_details.reasoning_tokens,
                        );
                    }
                }

                span.setStatus({ code: SpanStatusCode.OK });
                return response;
            } catch (error: any) {
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                span.recordException(error);
                throw error;
            } finally {
                span.end();
            }
        });
    }
}

class EmbeddingsWrapper {
    constructor(
        private openai: OpenAI,
        private tracer: Tracer,
    ) {}

    public async create(params: EmbeddingCreateParams): Promise<CreateEmbeddingResponse> {
        const externalCustomerId = getCustomerIdStorage();
        const externalAgentId = getAgentIdStorage();
        const token = getTokenStorage();

        if (!token || !externalCustomerId) {
            throw new Error(
                "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace().",
            );
        }

        return this.tracer.startActiveSpan("trace.openai.embeddings", async (span) => {
            const attributes: Record<string, any> = {
                "gen_ai.system": "openai",
                "gen_ai.operation.name": "embeddings",
            };
            attributes["external_customer_id"] = externalCustomerId;
            attributes["token"] = token;
            if (externalAgentId) {
                attributes["external_agent_id"] = externalAgentId;
            }
            span.setAttributes(attributes);

            try {
                const response = await this.openai.embeddings.create(params);

                if (response.usage) {
                    span.setAttributes({
                        "gen_ai.usage.input_tokens": response.usage.prompt_tokens,
                        "gen_ai.response.model": response.model,
                    });
                }

                span.setStatus({ code: SpanStatusCode.OK });
                return response;
            } catch (error: any) {
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                span.recordException(error);
                throw error;
            } finally {
                span.end();
            }
        });
    }
}

class ImagesWrapper {
    constructor(
        private openai: OpenAI,
        private tracer: Tracer,
    ) {}

    public async generate(params: ImageGenerateParams): Promise<ImagesResponse> {
        const externalCustomerId = getCustomerIdStorage();
        const externalAgentId = getAgentIdStorage();
        const token = getTokenStorage();
        const model = params.model || "";

        if (!token || !externalCustomerId) {
            throw new Error(
                "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace().",
            );
        }

        return this.tracer.startActiveSpan("trace.openai.images", async (span) => {
            const attributes: Record<string, any> = {
                "gen_ai.request.model": model,
                "gen_ai.system": "openai",
                "gen_ai.operation.name": "image_generation",
            };
            attributes["external_customer_id"] = externalCustomerId;
            attributes["token"] = token;
            if (externalAgentId) {
                attributes["external_agent_id"] = externalAgentId;
            }
            span.setAttributes(attributes);

            try {
                const response = await this.openai.images.generate(params);

                span.setAttributes({
                    "gen_ai.image.count": params.n ?? 1,
                    "gen_ai.image.size": params.size || "",
                    "gen_ai.image.quality": params.quality || "",
                });

                span.setStatus({ code: SpanStatusCode.OK });
                return response;
            } catch (error: any) {
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                span.recordException(error);
                throw error;
            } finally {
                span.end();
            }
        });
    }
}
