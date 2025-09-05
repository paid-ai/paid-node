import { SpanStatusCode } from "@opentelemetry/api";
import { getCustomerIdStorage, getAgentIdStorage, getTokenStorage } from "./tracing.js";
import { paidTracer } from "./tracing.js";

export function _signal(eventName: string, enableCostTracing: boolean, data?: Record<string, any>): void {
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

    paidTracer.startActiveSpan("trace.signal", (span) => {
        try {
            const attributes: Record<string, string | number | boolean> = {
                external_customer_id: externalCustomerId,
                external_agent_id: externalAgentId,
                event_name: eventName,
                token: token,
            };

            if (enableCostTracing) {
                // let the app know to associate this signal with cost traces
                attributes["enable_cost_tracing"] = true;
                if (data === undefined) {
                    data = { paid: { enable_cost_tracing: true } };
                } else {
                    data["paid"] = { enable_cost_tracing: true };
                }
            }

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
