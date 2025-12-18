import { Context, SpanAttributes, SpanAttributeValue } from "@opentelemetry/api";
import { SpanProcessor, Span } from "@opentelemetry/sdk-trace-base";
import { getTracingContext } from "./tracingContext.js";
import { getToken } from "./tracing.js";

export class PaidSpanProcessor implements SpanProcessor {
    private static readonly SPAN_NAME_PREFIX = "paid.trace.";
    private static readonly PROMPT_ATTRIBUTES_SUBSTRINGS: string[] = [
        "gen_ai.completion",
        "gen_ai.request.messages",
        "gen_ai.response.messages",
        "llm.output_message",
        "llm.input_message",
        "llm.invocation_parameters",
        "gen_ai.prompt",
        "langchain.prompt",
        "output.value",
        "input.value",
    ];

    onStart(span: Span, _parentContext?: Context): void {
        const { name } = span;
        const { storePrompt, externalCustomerId, externalProductId: externalAgentId } = getTracingContext();

        if (!storePrompt) {
            const originalSetAttribute = span.setAttribute;

            span.setAttribute = function (key: string, value: SpanAttributeValue): Span {
                const isPromptRelated = PaidSpanProcessor.PROMPT_ATTRIBUTES_SUBSTRINGS.some((substr) =>
                    key.includes(substr),
                );
                if (isPromptRelated) return this;
                return originalSetAttribute.call(this, key, value);
            };
            const originalSetAttributes = span.setAttributes;

            span.setAttributes = function (attributes: SpanAttributes): Span {
                const newAttributes = Object.entries(attributes).reduce((acc, [key, value]) => {
                    const isPromptRelated = PaidSpanProcessor.PROMPT_ATTRIBUTES_SUBSTRINGS.some((substr) =>
                        key.includes(substr),
                    );

                    if (isPromptRelated) return acc;
                    return { ...acc, [key]: value };
                }, {});

                return originalSetAttributes.call(this, newAttributes);
            };
        }

        if (name && !name.startsWith(PaidSpanProcessor.SPAN_NAME_PREFIX)) {
            span.updateName(`${PaidSpanProcessor.SPAN_NAME_PREFIX}${name}`);
        }

        if (externalCustomerId) {
            span.setAttribute("external_customer_id", externalCustomerId);
        }
        if (externalAgentId) {
            span.setAttribute("external_agent_id", externalAgentId);
        }
        const token = getToken();
        if (token) {
            span.setAttribute("token", token);
        }
    }
    onEnd(): void {
        // mutating this span object doesn't do anything
        // so we achieve filtering within the onStart method by monkey patching
        // setAttribute method
        return;
    }
    async shutdown(): Promise<void> {
        return;
    }
    async forceFlush(): Promise<void> {
        return;
    }
}
