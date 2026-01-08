import { Instrumentation, registerInstrumentations } from "@opentelemetry/instrumentation";
import { OpenAIInstrumentation } from "@arizeai/openinference-instrumentation-openai";
import { BedrockInstrumentation } from "@traceloop/instrumentation-bedrock";
import { AnthropicInstrumentation } from "@arizeai/openinference-instrumentation-anthropic";
import { TracerProvider } from "@opentelemetry/api";

import type * as openai from "openai";
import type * as anthropic from "@anthropic-ai/sdk";
import type * as bedrock from "@aws-sdk/client-bedrock-runtime";
import { getPaidTracerProvider, initializeTracing, logger } from "./tracing.js";

let IS_INITIALIZED = false;

interface SupportedLibraries {
    openai?: typeof openai.OpenAI;
    anthropic?: typeof anthropic.Anthropic;
    bedrock?: typeof bedrock;
}

const getInstrumentations = (tracerProvider: TracerProvider): Instrumentation[] => {
    const instrumentations = [
        new OpenAIInstrumentation({ tracerProvider }),
        new AnthropicInstrumentation({ tracerProvider }),
        new BedrockInstrumentation(),
    ];
    return instrumentations;
};

const getManualInstrumentations = (tracerProvider: TracerProvider, libraries: SupportedLibraries) => {
    const instrumentations = [];

    if (libraries.openai) {
        const openaiInstrumentation = new OpenAIInstrumentation({ tracerProvider });
        instrumentations.push(openaiInstrumentation);
        openaiInstrumentation.manuallyInstrument(libraries.openai);
    }

    if (libraries.anthropic) {
        const anthropicInstrumentation = new AnthropicInstrumentation({ tracerProvider });
        instrumentations.push(anthropicInstrumentation);
        anthropicInstrumentation.manuallyInstrument(libraries.anthropic);
    }

    if (libraries.bedrock) {
        const bedrockInstrumentation = new BedrockInstrumentation();
        instrumentations.push(bedrockInstrumentation);
        bedrockInstrumentation.manuallyInstrument(libraries.bedrock);
    }

    return instrumentations;
};

export function paidAutoInstrument(libraries?: SupportedLibraries) {
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
        ? getManualInstrumentations(tracerProvider, libraries)
        : getInstrumentations(tracerProvider);

    registerInstrumentations({
        instrumentations,
        tracerProvider,
    });

    IS_INITIALIZED = true;
}
