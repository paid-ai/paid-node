import Anthropic from "@anthropic-ai/sdk";
import { trace, SpanStatusCode, context, Tracer } from "@opentelemetry/api";
import { getCustomerIdStorage, getAgentIdStorage, getTokenStorage } from "../tracing.js";
import { Message, MessageCreateParams } from "@anthropic-ai/sdk/resources/messages";

export class PaidAnthropic {
    private readonly anthropic: Anthropic;
    private readonly tracer: Tracer;

    constructor(anthropicClient: Anthropic) {
        this.anthropic = anthropicClient;
        this.tracer = trace.getTracer("paid.node");
    }

    public get messages(): MessagesWrapper {
        return new MessagesWrapper(this.anthropic, this.tracer);
    }
}

class MessagesWrapper {
    constructor(
        private anthropic: Anthropic,
        private tracer: Tracer,
    ) {}

    public async create(params: MessageCreateParams): Promise<any> {
        const currentSpan = trace.getSpan(context.active());
        if (!currentSpan) {
            throw new Error("No active span found, make sure to call this inside of a callback to paid.trace().");
        }

        const externalCustomerId = getCustomerIdStorage();
        const externalAgentId = getAgentIdStorage();
        const token = getTokenStorage();

        if (!token || !externalCustomerId) {
            throw new Error(
                "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace().",
            );
        }

        return this.tracer.startActiveSpan("trace.anthropic.messages", async (span) => {
            const attributes: Record<string, any> = {
                "gen_ai.system": "anthropic",
                "gen_ai.operation.name": "messages",
                external_customer_id: externalCustomerId,
                token: token,
            };

            if (externalAgentId) {
                attributes["external_agent_id"] = externalAgentId;
            }

            // Set request model from params
            if (params.model) {
                attributes["gen_ai.request.model"] = params.model;
            }

            span.setAttributes(attributes);

            try {
                const response = (await this.anthropic.messages.create(params)) as any;

                // Add usage information from response
                if (response.usage) {
                    span.setAttributes({
                        "gen_ai.usage.input_tokens": response.usage.input_tokens,
                        "gen_ai.usage.output_tokens": response.usage.output_tokens,
                        "gen_ai.response.model": response.model,
                    });

                    // Add Anthropic-specific cache usage if available
                    if ("cache_creation_input_tokens" in response.usage && response.usage.cache_creation_input_tokens) {
                        span.setAttribute(
                            "gen_ai.usage.cache_creation_input_tokens",
                            response.usage.cache_creation_input_tokens,
                        );
                    }
                    if ("cache_read_input_tokens" in response.usage && response.usage.cache_read_input_tokens) {
                        span.setAttribute(
                            "gen_ai.usage.cache_read_input_tokens",
                            response.usage.cache_read_input_tokens,
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
