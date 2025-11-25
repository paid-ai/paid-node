import { Instrumentation, registerInstrumentations } from "@opentelemetry/instrumentation";
import { OpenAIInstrumentation } from "@arizeai/openinference-instrumentation-openai";
import { TracerProvider } from "@opentelemetry/api";
import { paidTracerProvider } from "./tracing";

let IS_INITIALIZED = false;

interface SupportedLibraries {
    openai?: any;
}

const getInstrumentations = (tracerProvider: TracerProvider): Instrumentation[] => {
    const instrumentations = [new OpenAIInstrumentation({ tracerProvider })];
    return instrumentations;
};

const getManualInstrumentations = (tracerProvider: TracerProvider, libraries: SupportedLibraries) => {
    const { openai } = libraries;
    const instrumentations = [];

    if (openai !== undefined) {
        const openaiInstrumentation = new OpenAIInstrumentation({ tracerProvider });
        instrumentations.push(openaiInstrumentation);
        openaiInstrumentation.manuallyInstrument(openai);
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
