import { Mistral } from '@mistralai/mistralai';
import { trace, SpanStatusCode, context, Tracer } from "@opentelemetry/api";
import { getCustomerIdStorage, getAgentIdStorage, getTokenStorage } from "../tracing.js";
import { OCRRequest, OCRResponse } from '@mistralai/mistralai/models/components';
import { RequestOptions } from '@mistralai/mistralai/lib/sdks';

export class PaidMistral {
    private readonly mistral: Mistral;
    private readonly tracer: Tracer;

    constructor(mistralClient: Mistral) {
        this.mistral = mistralClient;
        this.tracer = trace.getTracer("paid.node");
    }

    public get ocr(): OCRWrapper {
        return new OCRWrapper(this.mistral, this.tracer);
    }
}

class OCRWrapper {
    constructor(
        private mistral: Mistral,
        private tracer: Tracer,
    ) {}

    public async process(
        request: OCRRequest,
        options?: RequestOptions
    ): Promise<OCRResponse> {
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

        return this.tracer.startActiveSpan("trace.mistral.ocr", async (span) => {
            const attributes: Record<string, any> = {
                "gen_ai.system": "mistral",
                "gen_ai.operation.name": "ocr",
                "external_customer_id": externalCustomerId,
                "token": token,
            };

            if (externalAgentId) {
                attributes["external_agent_id"] = externalAgentId;
            }

            // Check if annotations are requested
            if (request.bboxAnnotationFormat || request.documentAnnotationFormat) {
                attributes["gen_ai.ocr.annotated"] = "true";
            }

            // Set request model
            if (request.model) {
                attributes["gen_ai.request.model"] = request.model;
            }

            span.setAttributes(attributes);

            try {
                const response = await this.mistral.ocr.process(request, options);

                // Add usage information from response
                if (response.usageInfo?.pagesProcessed !== undefined) {
                    span.setAttribute("gen_ai.ocr.pages_processed", response.usageInfo.pagesProcessed);
                }

                if (response.model) {
                    span.setAttribute("gen_ai.response.model", response.model);
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
