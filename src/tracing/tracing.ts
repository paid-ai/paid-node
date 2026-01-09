import { SpanStatusCode } from "@opentelemetry/api";
import type { Tracer } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import type { SpanProcessor } from "@opentelemetry/sdk-trace-node";
import winston from "winston";
import { runWithTracingContext } from "./tracingContext.js";
import { PaidSpanProcessor } from "./spanProcessor.js";

export const logger: winston.Logger = winston.createLogger({
    level: "silent", // Default to 'silent' to avoid logging unless set via environment variable
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
});
const logLevel = process.env.PAID_LOG_LEVEL;
if (logLevel) {
    logger.level = logLevel;
}

const DEFAULT_COLLECTOR_ENDPOINT =
    process.env["PAID_OTEL_COLLECTOR_ENDPOINT"] || "https://collector.agentpaid.io:4318/v1/traces";

let paidApiToken: string | undefined = undefined;
export function getToken(): string | undefined {
    return paidApiToken;
}

let paidTracerProvider: NodeTracerProvider | undefined = undefined;
export function getPaidTracerProvider(): NodeTracerProvider | undefined {
    return paidTracerProvider;
}

let paidTracer: Tracer | undefined = undefined;
export function getPaidTracer(): Tracer | undefined {
    return paidTracer;
}

let _isShuttingDown = false;
const setupGracefulShutdown = (shuttable: NodeSDK | SpanProcessor) => {
    ["SIGINT", "SIGTERM", "beforeExit", "uncaughtException", "unhandledRejection"].forEach((signal) => {
        process.on(signal, () => {
            if (_isShuttingDown) {
                return;
            }
            _isShuttingDown = true;
            shuttable
                .shutdown()
                .then(() => logger.info(`Paid tracing SDK shut down from signal: ${signal}`))
                .catch((error) => logger.error(`Error shutting down Paid tracing SDK ${error}`));
        });
    });
};

export function initializeTracing(apiKey?: string, collectorEndpoint?: string): void {
    const paidEnabled = (process.env.PAID_ENABLED || "true") !== "false";
    if (!paidEnabled) {
        logger.info("Paid tracing is disabled via PAID_ENABLED environment variable");
        return;
    }
    const token = getToken();

    if (!!token) {
        logger.info("Tracing is already initialized - skipping re-intialization");
        return;
    }

    if (!apiKey) {
        const envKey = process.env.PAID_API_KEY;
        if (!envKey) {
            logger.error("API key must be provided via PAID_API_KEY environment variable");
            return;
        }

        paidApiToken = envKey;
    } else {
        paidApiToken = apiKey;
    }

    const url = collectorEndpoint || DEFAULT_COLLECTOR_ENDPOINT;
    const exporter = new OTLPTraceExporter({ url });
    const spanProcessor = new SimpleSpanProcessor(exporter);
    paidTracerProvider = new NodeTracerProvider({
        resource: resourceFromAttributes({ "api.key": paidApiToken }),
        spanProcessors: [spanProcessor, new PaidSpanProcessor()],
    });
    paidTracerProvider.register();
    paidTracer = paidTracerProvider.getTracer("paid.node");
    setupGracefulShutdown(spanProcessor);
    logger.info(`Paid tracing SDK initialized with collector endpoint: ${url}`);
}

export async function trace<F extends (...args: any[]) => any>(
    options: {
        externalCustomerId: string;
        externalProductId?: string;
        storePrompt?: boolean;
        metadata?: any;
    },
    fn: F,
    ...args: Parameters<F>
): Promise<ReturnType<F>> {
    const token = getToken();
    const tracer = getPaidTracer();

    if (!token || !tracer) {
        throw new Error("Paid tracing is not initialized. Make sure to call initializeTracing() first.");
    }
    const { externalCustomerId, externalProductId: externalAgentId, storePrompt, metadata } = options;

    return await tracer.startActiveSpan("parent_span", async (span) => {
        span.setAttribute("external_customer_id", externalCustomerId);
        span.setAttribute("token", token);
        if (externalAgentId) {
            span.setAttribute("external_agent_id", externalAgentId);
        }

        try {
            const res = await runWithTracingContext(
                {
                    externalCustomerId,
                    externalProductId: externalAgentId,
                    storePrompt,
                    metadata,
                },
                async () => await fn(...args),
            );
            span.setStatus({ code: SpanStatusCode.OK });
            return res;
        } catch (error: any) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message,
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    });
}
