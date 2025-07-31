/**
 * Test for Vercel AI SDK wrapper functionality
 */
import { PaidAISDKOpenAI } from "../src/tracing/wrappers/vercelOpenAiWrapperClaude.js";
import { PaidClient } from "../src/Client.js";

describe("Vercel AI SDK Wrapper", () => {
  let wrapper: PaidAISDKOpenAI;
  let client: PaidClient;

  beforeEach(() => {
    wrapper = new PaidAISDKOpenAI();
    client = new PaidClient({
      token: "test-token",
    });
  });

  describe("wrapper initialization", () => {
    it("should create wrapper instance", () => {
      expect(wrapper).toBeDefined();
      expect(wrapper).toBeInstanceOf(PaidAISDKOpenAI);
    });

    it("should create client instance", () => {
      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(PaidClient);
    });
  });

  describe("error handling", () => {
    it("should throw error when used outside of trace context", async () => {
      await expect(wrapper.generateText({
        model: "gpt-3.5-turbo",
        prompt: "Hello",
      } as any)).rejects.toThrow("No token or externalCustomerId");
    });

    it("should throw error when used outside of trace context for streamText", async () => {
      await expect(wrapper.streamText({
        model: "gpt-3.5-turbo",
        prompt: "Hello",
      } as any)).rejects.toThrow("No token or externalCustomerId");
    });

    it("should throw error when used outside of trace context for generateObject", async () => {
      await expect(wrapper.generateObject({
        model: "gpt-3.5-turbo",
        prompt: "Hello",
      } as any)).rejects.toThrow("No token or externalCustomerId");
    });

    it("should throw error when used outside of trace context for streamObject", async () => {
      await expect(wrapper.streamObject({
        model: "gpt-3.5-turbo",
        prompt: "Hello",
      } as any)).rejects.toThrow("No token or externalCustomerId");
    });

    it("should throw error when used outside of trace context for embed", async () => {
      await expect(wrapper.embed({
        model: "text-embedding-ada-002",
        value: "Hello",
      } as any)).rejects.toThrow("No token or externalCustomerId");
    });

    it("should throw error when used outside of trace context for embedMany", async () => {
      await expect(wrapper.embedMany({
        model: "text-embedding-ada-002",
        values: ["Hello", "World"],
      } as any)).rejects.toThrow("No token or externalCustomerId");
    });

    it("should throw error when used outside of trace context for generateImage", async () => {
      await expect(wrapper.generateImage({
        model: "dall-e-3",
        prompt: "A cat",
      } as any)).rejects.toThrow("No token or externalCustomerId");
    });
  });

  describe("model ID extraction", () => {
    it("should extract model ID from string", () => {
      const wrapper = new PaidAISDKOpenAI();
      // Access the private method through any for testing
      const extractModelId = (wrapper as any).extractModelId;
      
      expect(extractModelId("gpt-4")).toBe("gpt-4");
      expect(extractModelId("text-embedding-ada-002")).toBe("text-embedding-ada-002");
      expect(extractModelId("dall-e-3")).toBe("dall-e-3");
    });

    it("should handle unknown model objects", () => {
      const wrapper = new PaidAISDKOpenAI();
      const extractModelId = (wrapper as any).extractModelId;
      
      expect(extractModelId({})).toBe("unknown-model");
      expect(extractModelId(null)).toBe("unknown-model");
      expect(extractModelId(undefined)).toBe("unknown-model");
    });

    it("should extract model ID from model object with modelId property", () => {
      const wrapper = new PaidAISDKOpenAI();
      const extractModelId = (wrapper as any).extractModelId;
      
      const model = { modelId: "gpt-3.5-turbo" };
      expect(extractModelId(model)).toBe("gpt-3.5-turbo");
    });

    it("should extract model ID from model object with model property", () => {
      const wrapper = new PaidAISDKOpenAI();
      const extractModelId = (wrapper as any).extractModelId;
      
      const model = { model: "gpt-4" };
      expect(extractModelId(model)).toBe("gpt-4");
    });

    it("should extract model ID from model object with id property", () => {
      const wrapper = new PaidAISDKOpenAI();
      const extractModelId = (wrapper as any).extractModelId;
      
      const model = { id: "text-embedding-ada-002" };
      expect(extractModelId(model)).toBe("text-embedding-ada-002");
    });

    it("should extract model ID from model object with name property", () => {
      const wrapper = new PaidAISDKOpenAI();
      const extractModelId = (wrapper as any).extractModelId;
      
      const model = { name: "dall-e-3" };
      expect(extractModelId(model)).toBe("dall-e-3");
    });
  });

  describe("client tracing", () => {
    it("should initialize tracing successfully", async () => {
      await expect(client.initializeTracing()).resolves.not.toThrow();
    });

    it("should have trace method available", () => {
      expect(typeof client.trace).toBe("function");
    });
  });

  describe("wrapper methods", () => {
    it("should have generateText method", () => {
      expect(typeof wrapper.generateText).toBe("function");
    });

    it("should have streamText method", () => {
      expect(typeof wrapper.streamText).toBe("function");
    });

    it("should have generateObject method", () => {
      expect(typeof wrapper.generateObject).toBe("function");
    });

    it("should have streamObject method", () => {
      expect(typeof wrapper.streamObject).toBe("function");
    });

    it("should have embed method", () => {
      expect(typeof wrapper.embed).toBe("function");
    });

    it("should have embedMany method", () => {
      expect(typeof wrapper.embedMany).toBe("function");
    });

    it("should have generateImage method", () => {
      expect(typeof wrapper.generateImage).toBe("function");
    });
  });
});
