import {
  OITracer,
  safelyJSONStringify,
  TraceConfigOptions,
} from "@arizeai/openinference-core";
import {
  MimeType,
  OpenInferenceSpanKind,
  SemanticConventions,
} from "@arizeai/openinference-semantic-conventions";

import {
  Attributes,
  context,
  diag,
  Span,
  SpanKind,
  SpanStatusCode,
  trace,
  Tracer,
  TracerProvider,
} from "@opentelemetry/api";
import { isTracingSuppressed } from "@opentelemetry/core";
import {
  InstrumentationBase,
  InstrumentationConfig,
  InstrumentationModuleDefinition,
  InstrumentationNodeModuleDefinition,
} from "@opentelemetry/instrumentation";

import { VERSION } from "./version.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleGenAIModuleExports = any;

const MODULE_NAME = "@google/genai";
const INSTRUMENTATION_NAME = "@arizeai/openinference-instrumentation-google-genai";

/**
 * Flag to check if the google-genai module has been patched
 */
let _isOpenInferencePatched = false;

/**
 * function to check if instrumentation is enabled / disabled
 */
export function isPatched() {
  return _isOpenInferencePatched;
}

/**
 * Resolves the execution context for the current span
 */
function getExecContext(span: Span) {
  const activeContext = context.active();
  const suppressTracing = isTracingSuppressed(activeContext);
  const execContext = suppressTracing
    ? trace.setSpan(context.active(), span)
    : activeContext;
  if (suppressTracing) {
    trace.deleteSpan(activeContext);
  }
  return execContext;
}

/**
 * An auto instrumentation class for Google GenAI that creates OpenInference compliant spans
 */
export class GoogleGenAIInstrumentation extends InstrumentationBase<GoogleGenAIModuleExports> {
  private oiTracer: OITracer;
  private tracerProvider?: TracerProvider;
  private traceConfig?: TraceConfigOptions;

  constructor({
    instrumentationConfig,
    traceConfig,
    tracerProvider,
  }: {
    instrumentationConfig?: InstrumentationConfig;
    traceConfig?: TraceConfigOptions;
    tracerProvider?: TracerProvider;
  } = {}) {
    super(
      INSTRUMENTATION_NAME,
      VERSION,
      Object.assign({}, instrumentationConfig),
    );
    this.tracerProvider = tracerProvider;
    this.traceConfig = traceConfig;
    this.oiTracer = new OITracer({
      tracer:
        this.tracerProvider?.getTracer(INSTRUMENTATION_NAME, VERSION) ??
        this.tracer,
      traceConfig,
    });
  }

  protected init(): InstrumentationModuleDefinition<GoogleGenAIModuleExports> {
    const module = new InstrumentationNodeModuleDefinition<GoogleGenAIModuleExports>(
      MODULE_NAME,
      [">=1.0.0"],
      this.patch.bind(this),
      this.unpatch.bind(this),
    );
    return module;
  }

  /**
   * Manually instruments the Google GenAI module
   */
  manuallyInstrument(module: GoogleGenAIModuleExports) {
    diag.debug(`Manually instrumenting ${MODULE_NAME}`);
    this.patch(module);
  }

  get tracer(): Tracer {
    if (this.tracerProvider) {
      return this.tracerProvider.getTracer(
        this.instrumentationName,
        this.instrumentationVersion,
      );
    }
    return super.tracer;
  }

  setTracerProvider(tracerProvider: TracerProvider): void {
    super.setTracerProvider(tracerProvider);
    this.tracerProvider = tracerProvider;
    this.oiTracer = new OITracer({
      tracer: this.tracer,
      traceConfig: this.traceConfig,
    });
  }

  /**
   * Patches the Google GenAI module
   */
  private patch(
    module: GoogleGenAIModuleExports & { openInferencePatched?: boolean },
    moduleVersion?: string,
  ) {
    diag.debug(`Applying patch for ${MODULE_NAME}@${moduleVersion}`);

    if (module?.openInferencePatched || _isOpenInferencePatched) {
      return module;
    }

    // Handle ES module default export structure
    const genaiModule =
      (module as GoogleGenAIModuleExports & { default?: GoogleGenAIModuleExports }).default ||
      module;

    // Patch the GoogleGenAI class constructor to wrap instance methods
    this.patchGoogleGenAIClass(genaiModule);

    _isOpenInferencePatched = true;
    try {
      module.openInferencePatched = true;
    } catch (e) {
      diag.debug(`Failed to set ${MODULE_NAME} patched flag on the module`, e);
    }

    return module;
  }

  /**
   * Patches the GoogleGenAI class to instrument the models instance
   */
  private patchGoogleGenAIClass(module: GoogleGenAIModuleExports) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const instrumentation = this;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyModule = module as any;

      if (!anyModule.GoogleGenAI) {
        diag.warn("Could not find GoogleGenAI class to patch");
        return;
      }

      const OriginalGoogleGenAI = anyModule.GoogleGenAI;

      // Create a new class that extends the original and patches the models instance
      anyModule.GoogleGenAI = class PatchedGoogleGenAI extends OriginalGoogleGenAI {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {
          super(...args);

          // Patch the models instance after it's created by the parent constructor
          if (this.models) {
            instrumentation.patchModelsInstance(this.models);
          }
        }
      };

      // Copy static properties and maintain prototype chain
      Object.setPrototypeOf(anyModule.GoogleGenAI, OriginalGoogleGenAI);
      Object.setPrototypeOf(anyModule.GoogleGenAI.prototype, OriginalGoogleGenAI.prototype);

      diag.debug("Patched GoogleGenAI class");
    } catch (e) {
      diag.warn("Failed to patch GoogleGenAI class", e);
    }
  }

  /**
   * Patches instance methods on a Models instance
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private patchModelsInstance(models: any) {
    // Wrap generateContent on the instance
    const originalGenerateContent = models.generateContent;
    if (typeof originalGenerateContent === "function") {
      models.generateContent = this.wrapGenerateContent(
        originalGenerateContent.bind(models)
      );
    }

    // Wrap generateContentStream on the instance
    const originalGenerateContentStream = models.generateContentStream;
    if (typeof originalGenerateContentStream === "function") {
      models.generateContentStream = this.wrapGenerateContentStream(
        originalGenerateContentStream.bind(models)
      );
    }
  }

  /**
   * Wraps generateContent method
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private wrapGenerateContent(original: any): any {
    const instrumentation = this;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function patchedGenerateContent(...args: any[]) {
      const requestParams = args[0] || {};
      const span = instrumentation.oiTracer.startSpan("GenerateContent", {
        kind: SpanKind.INTERNAL,
        attributes: {
          [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.LLM,
          [SemanticConventions.LLM_SYSTEM]: "google_genai",
          [SemanticConventions.LLM_PROVIDER]: "google",
          [SemanticConventions.INPUT_VALUE]: safelyJSONStringify(requestParams) ?? undefined,
          [SemanticConventions.INPUT_MIME_TYPE]: MimeType.JSON,
          ...getRequestAttributes(requestParams),
        },
      });

      const execContext = getExecContext(span);

      try {
        const result = await context.with(trace.setSpan(execContext, span), () => {
          return original(...args);
        });

        span.setAttributes({
          [SemanticConventions.OUTPUT_VALUE]: safelyJSONStringify(result) ?? undefined,
          [SemanticConventions.OUTPUT_MIME_TYPE]: MimeType.JSON,
          ...getResponseAttributes(result),
        });
        span.setStatus({ code: SpanStatusCode.OK });
        span.end();

        return result;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (error as Error).message,
        });
        span.end();
        throw error;
      }
    };
  }

  /**
   * Wraps generateContentStream method
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private wrapGenerateContentStream(original: any): any {
    const instrumentation = this;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async function patchedGenerateContentStream(...args: any[]) {
      const requestParams = args[0] || {};
      const span = instrumentation.oiTracer.startSpan("GenerateContentStream", {
        kind: SpanKind.INTERNAL,
        attributes: {
          [SemanticConventions.OPENINFERENCE_SPAN_KIND]: OpenInferenceSpanKind.LLM,
          [SemanticConventions.LLM_SYSTEM]: "google_genai",
          [SemanticConventions.LLM_PROVIDER]: "google",
          [SemanticConventions.INPUT_VALUE]: safelyJSONStringify(requestParams) ?? undefined,
          [SemanticConventions.INPUT_MIME_TYPE]: MimeType.JSON,
          ...getRequestAttributes(requestParams),
        },
      });

      const execContext = getExecContext(span);

      try {
        const stream = await context.with(trace.setSpan(execContext, span), () => {
          return original(...args);
        });

        // Wrap the async generator to capture output and end span when done
        return wrapStream(stream, span);
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: (error as Error).message,
        });
        span.end();
        throw error;
      }
    };
  }

  /**
   * Un-patches the Google GenAI module
   */
  private unpatch(
    moduleExports: GoogleGenAIModuleExports & { openInferencePatched?: boolean },
    moduleVersion?: string,
  ) {
    diag.debug(`Removing patch for ${MODULE_NAME}@${moduleVersion}`);

    _isOpenInferencePatched = false;
    try {
      moduleExports.openInferencePatched = false;
    } catch (e) {
      diag.warn(`Failed to unset ${MODULE_NAME} patched flag on the module`, e);
    }
  }
}

/**
 * Extract attributes from the generateContent request
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRequestAttributes(params: any): Attributes {
  const attributes: Attributes = {};

  if (params.model) {
    attributes[SemanticConventions.LLM_MODEL_NAME] = params.model;
  }

  if (params.contents) {
    const contents = Array.isArray(params.contents) ? params.contents : [params.contents];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contents.forEach((content: any, index: number) => {
      const prefix = `${SemanticConventions.LLM_INPUT_MESSAGES}.${index}.`;
      if (typeof content === "string") {
        attributes[`${prefix}${SemanticConventions.MESSAGE_ROLE}`] = "user";
        attributes[`${prefix}${SemanticConventions.MESSAGE_CONTENT}`] = content;
      } else if (content.role || content.parts) {
        if (content.role) {
          attributes[`${prefix}${SemanticConventions.MESSAGE_ROLE}`] = content.role;
        }
        if (content.parts) {
          const textParts = content.parts
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((p: any) => p.text)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((p: any) => p.text as string)
            .join("");
          if (textParts) {
            attributes[`${prefix}${SemanticConventions.MESSAGE_CONTENT}`] = textParts;
          }
        }
      }
    });
  }

  if (params.config?.generationConfig) {
    const configJson = safelyJSONStringify(params.config.generationConfig);
    if (configJson) {
      attributes[SemanticConventions.LLM_INVOCATION_PARAMETERS] = configJson;
    }
  } else if (params.generationConfig) {
    const configJson = safelyJSONStringify(params.generationConfig);
    if (configJson) {
      attributes[SemanticConventions.LLM_INVOCATION_PARAMETERS] = configJson;
    }
  }

  if (params.tools) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params.tools.forEach((tool: any, index: number) => {
      const toolJson = safelyJSONStringify(tool);
      if (toolJson) {
        attributes[
          `${SemanticConventions.LLM_TOOLS}.${index}.${SemanticConventions.TOOL_JSON_SCHEMA}`
        ] = toolJson;
      }
    });
  }

  return attributes;
}

/**
 * Extract attributes from the generateContent response
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getResponseAttributes(response: any): Attributes {
  const attributes: Attributes = {};

  if (response.modelVersion) {
    attributes[SemanticConventions.LLM_MODEL_NAME] = response.modelVersion;
  }

  if (response.responseId) {
    attributes["gen_ai.response.id"] = response.responseId;
  }

  if (response.usageMetadata) {
    const usage = response.usageMetadata;
    if (usage.promptTokenCount !== undefined) {
      attributes[SemanticConventions.LLM_TOKEN_COUNT_PROMPT] = usage.promptTokenCount;
    }
    if (usage.candidatesTokenCount !== undefined) {
      attributes[SemanticConventions.LLM_TOKEN_COUNT_COMPLETION] = usage.candidatesTokenCount;
    }
    if (usage.totalTokenCount !== undefined) {
      attributes[SemanticConventions.LLM_TOKEN_COUNT_TOTAL] = usage.totalTokenCount;
    }
  }

  if (response.candidates && response.candidates.length > 0) {
    const candidate = response.candidates[0];
    if (candidate.content) {
      const prefix = `${SemanticConventions.LLM_OUTPUT_MESSAGES}.0.`;
      attributes[`${prefix}${SemanticConventions.MESSAGE_ROLE}`] =
        candidate.content.role || "model";

      if (candidate.content.parts) {
        const textParts = candidate.content.parts
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((p: any) => p.text)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((p: any) => p.text as string)
          .join("");
        if (textParts) {
          attributes[`${prefix}${SemanticConventions.MESSAGE_CONTENT}`] = textParts;
        }

        // Handle function calls
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        candidate.content.parts.forEach((part: any, partIndex: number) => {
          if (part.functionCall) {
            const toolCallPrefix = `${prefix}${SemanticConventions.MESSAGE_TOOL_CALLS}.${partIndex}.`;
            attributes[`${toolCallPrefix}${SemanticConventions.TOOL_CALL_FUNCTION_NAME}`] =
              part.functionCall.name;
            const argsJson = safelyJSONStringify(part.functionCall.args);
            if (argsJson) {
              attributes[`${toolCallPrefix}${SemanticConventions.TOOL_CALL_FUNCTION_ARGUMENTS_JSON}`] =
                argsJson;
            }
          }
        });
      }
    }
  }

  return attributes;
}

/**
 * Wrap a streaming async generator to capture chunks and end span when done
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapStream(stream: any, span: Span): any {
  let fullText = "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let usageMetadata: any = null;
  let responseId: string | undefined;

  const originalIterator = stream[Symbol.asyncIterator].bind(stream);

  stream[Symbol.asyncIterator] = function () {
    const iterator = originalIterator();

    return {
      async next() {
        const result = await iterator.next();

        if (!result.done && result.value) {
          const chunk = result.value;

          // Accumulate text from each chunk
          if (chunk.candidates?.[0]?.content?.parts) {
            for (const part of chunk.candidates[0].content.parts) {
              if (part.text) {
                fullText += part.text;
              }
            }
          }

          // Capture usage metadata from final chunk
          if (chunk.usageMetadata) {
            usageMetadata = chunk.usageMetadata;
          }

          // Capture response ID
          if (chunk.responseId) {
            responseId = chunk.responseId;
          }
        }

        if (result.done) {
          // Stream finished - set accumulated attributes and end span
          const attributes: Attributes = {
            [SemanticConventions.OUTPUT_VALUE]: fullText,
            [SemanticConventions.OUTPUT_MIME_TYPE]: MimeType.TEXT,
            [`${SemanticConventions.LLM_OUTPUT_MESSAGES}.0.${SemanticConventions.MESSAGE_ROLE}`]:
              "model",
            [`${SemanticConventions.LLM_OUTPUT_MESSAGES}.0.${SemanticConventions.MESSAGE_CONTENT}`]:
              fullText,
          };

          if (responseId) {
            attributes["gen_ai.response.id"] = responseId;
          }

          if (usageMetadata) {
            if (usageMetadata.promptTokenCount !== undefined) {
              attributes[SemanticConventions.LLM_TOKEN_COUNT_PROMPT] =
                usageMetadata.promptTokenCount;
            }
            if (usageMetadata.candidatesTokenCount !== undefined) {
              attributes[SemanticConventions.LLM_TOKEN_COUNT_COMPLETION] =
                usageMetadata.candidatesTokenCount;
            }
            if (usageMetadata.totalTokenCount !== undefined) {
              attributes[SemanticConventions.LLM_TOKEN_COUNT_TOTAL] =
                usageMetadata.totalTokenCount;
            }
          }

          span.setAttributes(attributes);
          span.setStatus({ code: SpanStatusCode.OK });
          span.end();
        }

        return result;
      },
    };
  };

  return stream;
}
