import { SpanStatusCode } from "@opentelemetry/api";
import { getCustomerIdStorage, getAgentIdStorage, getTokenStorage } from "./tracing.js";
import { paidTracer } from "./tracing.js";

export function _signal(eventName: string, data?: Record<string, any>): void {
    if (!eventName) {
        throw new Error("Event name is required for signal.");
    }

    const externalCustomerId = getCustomerIdStorage();
    const externalAgentId = getAgentIdStorage();
    const token = getTokenStorage();

    if (!externalCustomerId || !externalAgentId || !token) {
        throw new Error(
            `Missing some of: external_customer_id: ${externalCustomerId}, external_agent_id: ${externalAgentId}, or token. Make sure to call signal() within trace()`,
        );
    }

    const tracer = paidTracer;
    tracer.startActiveSpan("trace.signal", (span) => {
        try {
            const attributes: Record<string, string | number | boolean> = {
                external_customer_id: externalCustomerId,
                external_agent_id: externalAgentId,
                event_name: eventName,
                token: token,
            };

            // Optional data (ex. manual cost tracking)
            if (data) {
                attributes["data"] = JSON.stringify(data);
            }

            span.setAttributes(attributes);
            // Mark span as successful
            span.setStatus({ code: SpanStatusCode.OK });
        } catch (error: any) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message,
            });
            span.recordException(error);
        } finally {
            span.end();
        }
    });
}
