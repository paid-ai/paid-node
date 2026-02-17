import { getPaidTracer, getPaidTracerProvider, initializeTracing, trace } from "./tracing.js";
import type { InitializeTracingOptions } from "./tracing.js";
import { paidAutoInstrument } from "./autoInstrumentation.js";
import { signal } from "./signal.js";
import { AISDKSpanProcessor } from "./aiSdkSpanProcessor.js";

export { getPaidTracer, getPaidTracerProvider, initializeTracing, trace, signal, paidAutoInstrument, AISDKSpanProcessor };
export type { InitializeTracingOptions };
