import { Instrumentation, registerInstrumentations } from "@opentelemetry/instrumentation";
import { OpenAIInstrumentation } from "@arizeai/openinference-instrumentation-openai";
import { TracerProvider } from "@opentelemetry/api";
import { paidTracerProvider } from "./tracing";
import { BedrockInstrumentation } from "@arizeai/openinference-instrumentation-bedrock";
import { BedrockAgentInstrumentation } from "@arizeai/openinference-instrumentation-bedrock-agent-runtime";
import { LangChainInstrumentation } from "@arizeai/openinference-instrumentation-langchain";
import { AnthropicInstrumentation } from "@arizeai/openinference-instrumentation-anthropic";

let IS_INITIALIZED = false;

interface SupportedLibraries {
    openai?: any;
    bedrock?: any;
    bedrockAgentRuntime?: any;
    langchainCallbackManagerModule?: any;
    anthropic?: any;
}

const getInstrumentations = (tracerProvider: TracerProvider): Instrumentation[] => {
    const instrumentations = [
        new OpenAIInstrumentation({ tracerProvider }),
        new BedrockInstrumentation({ tracerProvider }),
        new BedrockAgentInstrumentation({ tracerProvider }),
        new AnthropicInstrumentation({ tracerProvider }),
    ];
    return instrumentations;
};

const getManualInstrumentations = (tracerProvider: TracerProvider, libraries: SupportedLibraries) => {
    const { openai, bedrock, bedrockAgentRuntime, langchainCallbackManagerModule, anthropic } = libraries;
    const instrumentations = [];

    if (openai !== undefined) {
        const openaiInstrumentation = new OpenAIInstrumentation({ tracerProvider });
        instrumentations.push(openaiInstrumentation);
        openaiInstrumentation.manuallyInstrument(openai);
    }

    if (bedrock !== undefined) {
        const bedrockInstrumentation = new BedrockInstrumentation({ tracerProvider });
        bedrockInstrumentation.manuallyInstrument(bedrock);
    }

    if (bedrockAgentRuntime !== undefined) {
        const bedrockAgentInstrumentation = new BedrockAgentInstrumentation({ tracerProvider });
        bedrockAgentInstrumentation.manuallyInstrument(bedrockAgentRuntime);
    }

    if (langchainCallbackManagerModule !== undefined) {
        const lcInstrumentation = new LangChainInstrumentation({ tracerProvider });
        lcInstrumentation.manuallyInstrument(langchainCallbackManagerModule);
    }

    if (anthropic !== undefined) {
        const anthropicInstrumentation = new AnthropicInstrumentation({ tracerProvider });
        anthropicInstrumentation.manuallyInstrument(anthropic);
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
