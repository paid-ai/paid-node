import { Instrumentation, registerInstrumentations } from "@opentelemetry/instrumentation";
import { OpenAIInstrumentation } from "@arizeai/openinference-instrumentation-openai";
import { AnthropicInstrumentation } from "@arizeai/openinference-instrumentation-anthropic";
import { TracerProvider } from "@opentelemetry/api";
import { paidTracerProvider } from "./tracing";

import type * as openai from "openai";
import type * as anthropic from "@anthropic-ai/sdk";

let IS_INITIALIZED = false;

interface SupportedLibraries {
    openai?: typeof openai.OpenAI;
    anthropic?: typeof anthropic.Anthropic;
}

const getInstrumentations = (tracerProvider: TracerProvider): Instrumentation[] => {
    const instrumentations = [
        new OpenAIInstrumentation({ tracerProvider }),
        new AnthropicInstrumentation({ tracerProvider }),
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

    return instrumentations;
};

export function paidAutoInstrument(libraries?: SupportedLibraries) {
    if (IS_INITIALIZED) return;

    const isManualInstrumentation = libraries && Object.keys(libraries).length > 0;

    const instrumentations = isManualInstrumentation
        ? getManualInstrumentations(paidTracerProvider, libraries)
        : getInstrumentations(paidTracerProvider);

    registerInstrumentations({
        instrumentations,
        tracerProvider: paidTracerProvider,
    });

    IS_INITIALIZED = true;
}
