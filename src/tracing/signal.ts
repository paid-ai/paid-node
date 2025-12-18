import { SpanStatusCode } from "@opentelemetry/api";
import { getPaidTracer, getToken } from "./tracing.js";
import { getTracingContext } from "./tracingContext.js";

/**
 * Sends Paid signal. Needs to be called as part of callback to trace().
 * When enableCostTracing flag is on, signal is associated
 * with cost traces from the same Paid.trace() context.
 *
 * @param eventName - The name of the signal.
 * @param enableCostTracing - Whether to associate this signal with cost traces
 * from the current Paid.trace() context (default: false)
 * @param data - Optional additional data to include with the signal
 *
 * @remarks
 * When enableCostTracing is on, the signal will be associated with cost
 * traces within the same Paid.trace() context.
 * It is advised to only make one call to this function
 * with enableCostTracing per Paid.trace() context.
 * Otherwise, there will be multiple signals that refer to the same costs.
 */
export function signal(eventName: string, enableCostTracing: boolean = false, data?: Record<string, any>): void {
    const paidTracer = getPaidTracer();
    const token = getToken();
    const { externalCustomerId, externalAgentId } = getTracingContext();

    if (!token || !paidTracer) {
        throw new Error(`Tracing is not initialized. Make sure you called 'initializeTracing()'`);
    }

    if (!externalCustomerId || !externalAgentId) {
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
