import { Context, SpanAttributeValue } from "@opentelemetry/api";
import { SpanProcessor, Span } from "@opentelemetry/sdk-trace-base";
import { getAgentIdStorage, getCustomerIdStorage, getStorePromptStorage, getTokenStorage } from "./tracing.js";

export class PaidSpanProcessor implements SpanProcessor {
    private static readonly SPAN_NAME_PREFIX = "paid.trace.";
    private static readonly PROMPT_ATTRIBUTES_SUBSTRINGS: string[] = [
        "prompt",
        "gen_ai.completion",
        "gen_ai.request.messages",
        "gen_ai.response.messages",
        "llm.output_message",
        "llm.input_message",
        "llm.invocation_parameters",
        "output.value",
        "input.value",
    ];

    onStart(span: Span, _parentContext?: Context): void {
        const { name } = span;

        if (!getStorePromptStorage()) {
            const originalSetAttribute = span.setAttribute;
            span.setAttribute = function (key: string, value: SpanAttributeValue): Span {
                const isPromptRelated = PaidSpanProcessor.PROMPT_ATTRIBUTES_SUBSTRINGS.some((substr) =>
                    key.includes(substr),
                );
                if (isPromptRelated) return this;
                return originalSetAttribute.call(this, key, value);
            };
        }

        if (name && !name.startsWith(PaidSpanProcessor.SPAN_NAME_PREFIX)) {
            span.updateName(`${PaidSpanProcessor.SPAN_NAME_PREFIX}${name}`);
        }
        const customerId = getCustomerIdStorage();
        if (customerId) {
            span.setAttribute("external_customer_id", customerId);
        }
        const agentId = getAgentIdStorage();
        if (agentId) {
            span.setAttribute("external_agent_id", agentId);
        }
        const token = getTokenStorage();
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
