import type { Instrumentation } from "@opentelemetry/instrumentation";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import type { TracerProvider } from "@opentelemetry/api";

import type * as openai from "openai";
import type * as anthropic from "@anthropic-ai/sdk";
import { getPaidTracerProvider, initializeTracing, logger } from "./tracing.js";

let IS_INITIALIZED = false;

interface SupportedLibraries {
    openai?: typeof openai.OpenAI;
    anthropic?: typeof anthropic.Anthropic;
}

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
