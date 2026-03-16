import { getPaidTracer, getPaidTracerProvider, initializeTracing, trace, createPaidSpanProcessors } from "./tracing.js";
import { signal } from "./signal.js";
import { AISDKSpanProcessor } from "./aiSdkSpanProcessor.js";
import { paidAutoInstrument } from "./autoInstrumentation.js";

export type { InitializeTracingOptions } from "./tracing.js";
export {
    getPaidTracer,
    getPaidTracerProvider,
    initializeTracing,
    trace,
    signal,
    AISDKSpanProcessor,
    createPaidSpanProcessors,
    paidAutoInstrument,
};
