import type { Instrumentation } from "@opentelemetry/instrumentation";
import type { TracerProvider } from "@opentelemetry/api";

import { getPaidTracerProvider, initializeTracing } from "./tracing.js";

let IS_INITIALIZED = false;

export type SupportedLibrary = "openai" | "anthropic";

export interface InstrumentModules {
    openai?: any;
    anthropic?: any;
}

const getInstrumentations = async (
    tracerProvider: TracerProvider,
    libraries?: SupportedLibrary[],
): Promise<Instrumentation[]> => {
    const instrumentations: Instrumentation[] = [];
    const shouldInstrument = (lib: SupportedLibrary) => !libraries || libraries.includes(lib);

    if (shouldInstrument("openai")) {
        try {
            const { OpenAIInstrumentation } = await import("@arizeai/openinference-instrumentation-openai");
            instrumentations.push(new OpenAIInstrumentation({ tracerProvider }));
        } catch {
            console.debug("OpenAI instrumentation not available - openai package not installed");
        }
    }

    if (shouldInstrument("anthropic")) {
        try {
            const { AnthropicInstrumentation } = await import("@arizeai/openinference-instrumentation-anthropic");
            instrumentations.push(new AnthropicInstrumentation({ tracerProvider }));
        } catch {
            console.debug("Anthropic instrumentation not available - @anthropic-ai/sdk package not installed");
        }
    }

    return instrumentations;
};

/**
 * Auto-instrument supported libraries using require-in-the-middle hooks.
 * Works in plain Node.js (CJS). Does NOT work in bundled environments (Next.js/webpack).
 * For bundled environments, use {@link paidAutoInstrumentModules} instead.
 *
 * @param libraries - Optional list of libraries to instrument. If omitted, all available libraries are instrumented.
 */
export async function paidAutoInstrument(libraries?: SupportedLibrary[]): Promise<void> {
    if (IS_INITIALIZED) {
        console.info("Auto instrumentation is already initialized");
        return;
    }

    initializeTracing();

    const tracerProvider = getPaidTracerProvider();

    if (!tracerProvider) {
        console.error(
            "Could not get tracer provider, make sure you ran 'initializeTracing()' or check your environment variables",
        );
        return;
    }

    const instrumentations = await getInstrumentations(tracerProvider, libraries);

    const { registerInstrumentations } = await import("@opentelemetry/instrumentation");
    registerInstrumentations({
        instrumentations,
        tracerProvider,
    });

    IS_INITIALIZED = true;
}

/**
 * Instrument supported libraries by directly patching the provided module references.
 * Required for bundled environments (Next.js/webpack) where require-in-the-middle hooks don't work.
 *
 * @example
 * ```typescript
 * import OpenAI from "openai";
 * import Anthropic from "@anthropic-ai/sdk";
 * await paidAutoInstrumentModules({ openAI: OpenAI, anthropic: Anthropic });
 * ```
 */
export async function paidAutoInstrumentModules(modules: InstrumentModules): Promise<void> {
    if (IS_INITIALIZED) {
        console.info("Auto instrumentation is already initialized");
        return;
    }

    initializeTracing();

    const tracerProvider = getPaidTracerProvider();

    if (!tracerProvider) {
        console.error(
            "Could not get tracer provider, make sure you ran 'initializeTracing()' or check your environment variables",
        );
        return;
    }

    if (modules.openai) {
        try {
            const { OpenAIInstrumentation } = await import("@arizeai/openinference-instrumentation-openai");
            const inst = new OpenAIInstrumentation({ tracerProvider });
            inst.manuallyInstrument(modules.openai);
        } catch {
            console.debug("OpenAI instrumentation not available");
        }
    }

    if (modules.anthropic) {
        try {
            const { AnthropicInstrumentation } = await import("@arizeai/openinference-instrumentation-anthropic");
            const inst = new AnthropicInstrumentation({ tracerProvider });
            inst.manuallyInstrument(modules.anthropic);
        } catch {
            console.debug("Anthropic instrumentation not available");
        }
    }

    IS_INITIALIZED = true;
}
