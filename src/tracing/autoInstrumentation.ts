import type { Instrumentation } from "@opentelemetry/instrumentation";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import type { TracerProvider } from "@opentelemetry/api";

import type * as openai from "openai";
import type * as anthropic from "@anthropic-ai/sdk";
import type * as bedrock from "@aws-sdk/client-bedrock-runtime";
import type * as ai from "ai";
import { getPaidTracer, getPaidTracerProvider, initializeTracing, logger } from "./tracing.js";

let IS_INITIALIZED = false;

interface SupportedLibraries {
    openai?: typeof openai.OpenAI;
    anthropic?: typeof anthropic.Anthropic;
    bedrock?: typeof bedrock;
    ai?: typeof ai;
}

/**
 * Instruments Vercel AI SDK by monkey patching its public API functions
 * to automatically inject telemetry with the Paid tracer.
 *
 * Patched APIs: generateText, streamText, generateObject, streamObject, embed, embedMany, rerank
 */
const instrumentVercelAI = async (aiModule: typeof ai): Promise<void> => {
    const paidTracer = getPaidTracer();
    if (!paidTracer) {
        logger.warn("Vercel AI SDK instrumentation skipped - Paid tracer not available");
        return;
    }

    const apisToInstrument = [
        "generateText",
        "streamText",
        "generateObject",
        "streamObject",
        "embed",
        "embedMany",
        "rerank",
    ] as const;

    for (const apiName of apisToInstrument) {
        const originalFn = aiModule[apiName] as ((...args: any[]) => any) | undefined;
        if (typeof originalFn !== "function") {
            continue;
        }

        (aiModule as any)[apiName] = (options: any) => {
            return originalFn({
                ...options,
                experimental_telemetry: {
                    isEnabled: true,
                    tracer: paidTracer,
                    ...options?.experimental_telemetry,
                },
            });
        };
    }

    logger.debug("Vercel AI SDK instrumented successfully");
};

const getInstrumentations = async (tracerProvider: TracerProvider): Promise<Instrumentation[]> => {
    const instrumentations: Instrumentation[] = [];

    try {
        const { OpenAIInstrumentation } = await import("@arizeai/openinference-instrumentation-openai");
        instrumentations.push(new OpenAIInstrumentation({ tracerProvider }));
    } catch {
        logger.debug("OpenAI instrumentation not available - openai package not installed");
    }

    try {
        const { AnthropicInstrumentation } = await import("@arizeai/openinference-instrumentation-anthropic");
        instrumentations.push(new AnthropicInstrumentation({ tracerProvider }));
    } catch {
        logger.debug("Anthropic instrumentation not available - @anthropic-ai/sdk package not installed");
    }

    try {
        const { BedrockInstrumentation } = await import("@traceloop/instrumentation-bedrock");
        instrumentations.push(new BedrockInstrumentation());
    } catch {
        logger.debug("Bedrock instrumentation not available - @aws-sdk/client-bedrock-runtime package not installed");
    }

    try {
        const aiModule = await import("ai");
        await instrumentVercelAI(aiModule);
    } catch {
        logger.debug("Vercel AI SDK instrumentation not available - so not instrumented");
    }

    return instrumentations;
};

const getManualInstrumentations = async (
    tracerProvider: TracerProvider,
    libraries: SupportedLibraries,
): Promise<Instrumentation[]> => {
    const instrumentations: Instrumentation[] = [];

    if (libraries.openai) {
        try {
            const { OpenAIInstrumentation } = await import("@arizeai/openinference-instrumentation-openai");
            const openaiInstrumentation = new OpenAIInstrumentation({ tracerProvider });
            instrumentations.push(openaiInstrumentation);
            openaiInstrumentation.manuallyInstrument(libraries.openai);
        } catch {
            logger.warn("Failed to load OpenAI instrumentation");
        }
    }

    if (libraries.anthropic) {
        try {
            const { AnthropicInstrumentation } = await import("@arizeai/openinference-instrumentation-anthropic");
            const anthropicInstrumentation = new AnthropicInstrumentation({ tracerProvider });
            instrumentations.push(anthropicInstrumentation);
            anthropicInstrumentation.manuallyInstrument(libraries.anthropic);
        } catch {
            logger.warn("Failed to load Anthropic instrumentation");
        }
    }

    if (libraries.bedrock) {
        try {
            const { BedrockInstrumentation } = await import("@traceloop/instrumentation-bedrock");
            const bedrockInstrumentation = new BedrockInstrumentation();
            instrumentations.push(bedrockInstrumentation);
            bedrockInstrumentation.manuallyInstrument(libraries.bedrock);
        } catch {
            logger.warn("Failed to load Bedrock instrumentation");
        }
    }

    if (libraries.ai) {
        try {
            await instrumentVercelAI(libraries.ai);
        } catch {
            logger.warn("Failed to instrument Vercel AI SDK");
        }
    }

    return instrumentations;
};

export async function paidAutoInstrument(libraries?: SupportedLibraries): Promise<void> {
    if (IS_INITIALIZED) {
        logger.info("Auto instrumentation is already initialized");
        return;
    }

    initializeTracing(); // try initializing tracing

    const tracerProvider = getPaidTracerProvider();

    if (!tracerProvider) {
        logger.error(
            "Could not get tracer provider, make sure you ran 'initializeTracing()' or check your environment variables",
        );
        return;
    }

    const isManualInstrumentation = libraries && Object.keys(libraries).length > 0;
    const instrumentations = isManualInstrumentation
        ? await getManualInstrumentations(tracerProvider, libraries)
        : await getInstrumentations(tracerProvider);

    registerInstrumentations({
        instrumentations,
        tracerProvider,
    });

    IS_INITIALIZED = true;
}
