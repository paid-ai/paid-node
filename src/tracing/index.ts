import { getPaidTracer, getPaidTracerProvider, initializeTracing, trace } from "./tracing.js";
import { paidAutoInstrument } from "./autoInstrumentation.js";
import { signal } from "./signal.js";
import {
    GenAISpanProcessor,
    GenAIAttributes,
    AISDKAttributes,
    OpenInferenceSpanKinds,
    OPENINFERENCE_SPAN_KIND,
} from "./genAISpanProcessor.js";

export {
    getPaidTracer,
    getPaidTracerProvider,
    initializeTracing,
    trace,
    signal,
    paidAutoInstrument,
    // GenAI span processor for AI SDK
    GenAISpanProcessor,
    GenAIAttributes,
    AISDKAttributes,
    OpenInferenceSpanKinds,
    OPENINFERENCE_SPAN_KIND,
};
