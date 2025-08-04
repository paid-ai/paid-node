import { openai } from "@ai-sdk/openai";
import {
  generateText,
  streamText,
  generateObject,
  streamObject,
  embed,
  embedMany,
  experimental_generateImage,
  LanguageModel,
  EmbeddingModel,
  ImageModel,
  GenerateTextResult,
  StreamTextResult,
  GenerateObjectResult,
  StreamObjectResult,
  EmbedResult,
  EmbedManyResult,
  Experimental_GenerateImageResult,
  ToolSet
} from "ai";

import { SpanStatusCode, Tracer } from "@opentelemetry/api";
import { getCustomerIdStorage, getAgentIdStorage, getTokenStorage, paidTracer } from "../tracing.js";

type OpenAIProvider = typeof openai;

export class PaidAISDKOpenAI {
  private readonly tracer: Tracer;

  constructor() {
    this.tracer = paidTracer;
  }

  /**
   * Generate text using the AI SDK with OpenTelemetry tracing
   */
  public async generateText<TOOLS extends ToolSet = {}>(
    params: any
  ): Promise<any> {
    const externalCustomerId = getCustomerIdStorage();
    const externalAgentId = getAgentIdStorage();
    const token = getTokenStorage();

    if (!token || !externalCustomerId) {
      throw new Error(
        "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace()."
      );
    }

    return this.tracer.startActiveSpan("trace.ai-sdk.generateText", async (span) => {
      const modelId = this.extractModelId(params.model);

      const attributes: Record<string, any> = {
        "gen_ai.system": "openai",
        "gen_ai.operation.name": "chat",
        "gen_ai.request.model": modelId,
        "external_customer_id": externalCustomerId,
        "token": token,
      };

      if (externalAgentId) {
        attributes["external_agent_id"] = externalAgentId;
      }

      span.setAttributes(attributes);

      try {
        const response = await generateText(params);

        // Set usage attributes if available
        if (response.usage) {
          span.setAttributes({
            "gen_ai.usage.input_tokens": response.usage.promptTokens,
            "gen_ai.usage.output_tokens": response.usage.completionTokens,
            "gen_ai.response.model": response.response?.modelId || modelId,
          });
        }

        span.setStatus({ code: SpanStatusCode.OK });
        return response;
      } catch (error: any) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Stream text using the AI SDK with OpenTelemetry tracing
   */
  public streamText<TOOLS extends ToolSet = {}>(
    params: any
  ): StreamTextResult<TOOLS, never> {
    const externalCustomerId = getCustomerIdStorage();
    const externalAgentId = getAgentIdStorage();
    const token = getTokenStorage();

    if (!token || !externalCustomerId) {
      throw new Error(
        "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace()."
      );
    }

    return this.tracer.startActiveSpan("trace.ai-sdk.streamText", (span) => {
      const modelId = this.extractModelId(params.model);

      const attributes: Record<string, any> = {
        "gen_ai.system": "openai",
        "gen_ai.operation.name": "chat",
        "gen_ai.request.model": modelId,
        "external_customer_id": externalCustomerId,
        "token": token,
      };

      if (externalAgentId) {
        attributes["external_agent_id"] = externalAgentId;
      }

      span.setAttributes(attributes);

      try {
        // Create a custom onFinish callback that captures usage data
        const originalOnFinish = params.onFinish;
        const wrappedParams = {
          ...params,
          onFinish: (result: any) => {
            // Capture usage data when streaming finishes
            if (result.usage) {
              span.setAttributes({
                "gen_ai.usage.input_tokens": result.usage.promptTokens,
                "gen_ai.usage.output_tokens": result.usage.completionTokens,
                "gen_ai.response.model": result.response?.modelId || modelId,
              });
            }

            // Call original onFinish if provided
            if (originalOnFinish) {
              originalOnFinish(result);
            }

            span.setStatus({ code: SpanStatusCode.OK });
            span.end();
          }
        };

        const response = streamText(wrappedParams);
        return response;
      } catch (error: any) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
        span.end();
        throw error;
      }
    });
  }

  /**
   * Generate structured object using the AI SDK with OpenTelemetry tracing
   */
  public async generateObject<T>(
    params: any
  ): Promise<any> {
    const externalCustomerId = getCustomerIdStorage();
    const externalAgentId = getAgentIdStorage();
    const token = getTokenStorage();

    if (!token || !externalCustomerId) {
      throw new Error(
        "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace()."
      );
    }

    return this.tracer.startActiveSpan("trace.ai-sdk.generateObject", async (span) => {
      const modelId = this.extractModelId(params.model);

      const attributes: Record<string, any> = {
        "gen_ai.system": "openai",
        "gen_ai.operation.name": "chat",
        "gen_ai.request.model": modelId,
        "external_customer_id": externalCustomerId,
        "token": token,
      };

      if (externalAgentId) {
        attributes["external_agent_id"] = externalAgentId;
      }

      span.setAttributes(attributes);

      try {
        const response = await generateObject(params);

        // Set usage attributes if available
        if (response.usage) {
          span.setAttributes({
            "gen_ai.usage.input_tokens": response.usage.promptTokens,
            "gen_ai.usage.output_tokens": response.usage.completionTokens,
            "gen_ai.response.model": response.response?.modelId || modelId,
          });
        }

        span.setStatus({ code: SpanStatusCode.OK });
        return response;
      } catch (error: any) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Stream structured object using the AI SDK with OpenTelemetry tracing
   */
  public async streamObject<T>(
    params: any
  ): Promise<any> {
    const externalCustomerId = getCustomerIdStorage();
    const externalAgentId = getAgentIdStorage();
    const token = getTokenStorage();

    if (!token || !externalCustomerId) {
      throw new Error(
        "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace()."
      );
    }

    return this.tracer.startActiveSpan("trace.ai-sdk.streamObject", async (span) => {
      const modelId = this.extractModelId(params.model);

      const attributes: Record<string, any> = {
        "gen_ai.system": "openai",
        "gen_ai.operation.name": "chat",
        "gen_ai.request.model": modelId,
        "external_customer_id": externalCustomerId,
        "token": token,
      };

      if (externalAgentId) {
        attributes["external_agent_id"] = externalAgentId;
      }

      span.setAttributes(attributes);

      try {
        // Create a custom onFinish callback that captures usage data
        const originalOnFinish = params.onFinish;
        const wrappedParams = {
          ...params,
          onFinish: (result: any) => {
            // Capture usage data when streaming finishes
            if (result.usage) {
              span.setAttributes({
                "gen_ai.usage.input_tokens": result.usage.promptTokens,
                "gen_ai.usage.output_tokens": result.usage.completionTokens,
                "gen_ai.response.model": result.response?.modelId || modelId,
              });
            }

            // Call original onFinish if provided
            if (originalOnFinish) {
              originalOnFinish(result);
            }

            span.setStatus({ code: SpanStatusCode.OK });
            span.end();
          }
        };

        const response = await streamObject(wrappedParams);
        return response;
      } catch (error: any) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
        span.end();
        throw error;
      }
    });
  }

  /**
   * Generate embeddings using the AI SDK with OpenTelemetry tracing
   */
  public async embed(params: any): Promise<any> {
    const externalCustomerId = getCustomerIdStorage();
    const externalAgentId = getAgentIdStorage();
    const token = getTokenStorage();

    if (!token || !externalCustomerId) {
      throw new Error(
        "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace()."
      );
    }

    return this.tracer.startActiveSpan("trace.ai-sdk.embed", async (span) => {
      const modelId = this.extractModelId(params.model);

      const attributes: Record<string, any> = {
        "gen_ai.system": "openai",
        "gen_ai.operation.name": "embeddings",
        "gen_ai.request.model": modelId,
        "external_customer_id": externalCustomerId,
        "token": token,
      };

      if (externalAgentId) {
        attributes["external_agent_id"] = externalAgentId;
      }

      span.setAttributes(attributes);

      try {
        const response = await embed(params);

        // Set usage attributes if available
        if (response.usage) {
          span.setAttributes({
            "gen_ai.usage.input_tokens": response.usage.tokens,
            "gen_ai.response.model": modelId,
          });
        }

        span.setStatus({ code: SpanStatusCode.OK });
        return response;
      } catch (error: any) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Generate multiple embeddings using the AI SDK with OpenTelemetry tracing
   */
  public async embedMany(params: any): Promise<any> {
    const externalCustomerId = getCustomerIdStorage();
    const externalAgentId = getAgentIdStorage();
    const token = getTokenStorage();

    if (!token || !externalCustomerId) {
      throw new Error(
        "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace()."
      );
    }

    return this.tracer.startActiveSpan("trace.ai-sdk.embedMany", async (span) => {
      const modelId = this.extractModelId(params.model);

      const attributes: Record<string, any> = {
        "gen_ai.system": "openai",
        "gen_ai.operation.name": "embeddings",
        "gen_ai.request.model": modelId,
        "external_customer_id": externalCustomerId,
        "token": token,
      };

      if (externalAgentId) {
        attributes["external_agent_id"] = externalAgentId;
      }

      span.setAttributes(attributes);

      try {
        const response = await embedMany(params);

        // Set usage attributes if available
        if (response.usage) {
          span.setAttributes({
            "gen_ai.usage.input_tokens": response.usage.tokens,
            "gen_ai.response.model": modelId,
          });
        }

        span.setStatus({ code: SpanStatusCode.OK });
        return response;
      } catch (error: any) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Generate images using the AI SDK with OpenTelemetry tracing
   */
  public async generateImage(params: any): Promise<any> {
    const externalCustomerId = getCustomerIdStorage();
    const externalAgentId = getAgentIdStorage();
    const token = getTokenStorage();

    if (!token || !externalCustomerId) {
      throw new Error(
        "No token or externalCustomerId: This wrapper should be used inside a callback to paid.trace()."
      );
    }

    return this.tracer.startActiveSpan("trace.ai-sdk.generateImage", async (span) => {
      const modelId = this.extractModelId(params.model);

      const attributes: Record<string, any> = {
        "gen_ai.system": "openai",
        "gen_ai.operation.name": "image_generation",
        "gen_ai.request.model": modelId,
        "external_customer_id": externalCustomerId,
        "token": token,
      };

      if (externalAgentId) {
        attributes["external_agent_id"] = externalAgentId;
      }

      // Add image-specific attributes
      if (params.n !== undefined) {
        attributes["gen_ai.image.count"] = params.n;
      }
      if (params.size !== undefined) {
        attributes["gen_ai.image.size"] = params.size;
      }

      span.setAttributes(attributes);

      try {
        const response = await experimental_generateImage(params);

        // Update attributes with actual values from response if available
        span.setAttributes({
          "gen_ai.image.count": params.n ?? 1,
          "gen_ai.image.size": params.size ?? "1024x1024",
        });

        span.setStatus({ code: SpanStatusCode.OK });
        return response;
      } catch (error: any) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Extract model ID from the model parameter
   * The model can be either a string or a model instance
   */
  private extractModelId(model: any): string {
    if (typeof model === 'string') {
      return model;
    }

    // If it's a function (like openai('gpt-4')), try to extract the model ID
    if (typeof model === 'function' || (model && typeof model === 'object')) {
      // Try common properties that might contain the model ID
      if (model.modelId) return model.modelId;
      if (model.model) return model.model;
      if (model.id) return model.id;
      if (model.name) return model.name;

      // Default fallback
      return 'unknown-model';
    }

    return 'unknown-model';
  }
}
