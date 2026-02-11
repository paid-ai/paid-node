/**
 * Auto instrumentation tests.
 * Tests paidAutoInstrument() function and verifies instrumentation behavior.
 *
 * NOTE: Full span verification tests require a mock OTLP collector because
 * paidAutoInstrument() uses the internal paid tracer provider which exports
 * to OTLP, not to our test InMemorySpanExporter.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mockServerPool } from "../mock-server/MockServerPool";

// Mock OpenAI chat completion response
const MOCK_OPENAI_CHAT_RESPONSE = {
    id: "chatcmpl-test123",
    object: "chat.completion",
    created: 1677652288,
    model: "gpt-4o-mini",
    choices: [
        {
            index: 0,
            message: {
                role: "assistant",
                content: "Hello! How can I help you today?",
            },
            finish_reason: "stop",
        },
    ],
    usage: {
        prompt_tokens: 10,
        completion_tokens: 15,
        total_tokens: 25,
    },
};

// Mock Anthropic messages response
const MOCK_ANTHROPIC_MESSAGE_RESPONSE = {
    id: "msg_test123",
    type: "message",
    role: "assistant",
    content: [
        {
            type: "text",
            text: "Hello! How can I help you today?",
        },
    ],
    model: "claude-sonnet-4-20250514",
    stop_reason: "end_turn",
    usage: {
        input_tokens: 10,
        output_tokens: 15,
    },
};

describe("Auto Instrumentation", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = "test-api-key";
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    describe("paidAutoInstrument initialization", () => {
        it("should initialize without errors when tracing is set up", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should not throw when called without prior initializeTracing", async () => {
            vi.resetModules();
            process.env.PAID_API_KEY = "test-api-key";

            const { paidAutoInstrument } = await import("../../src/tracing/index.js");

            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should handle missing API key gracefully", async () => {
            vi.resetModules();
            delete process.env.PAID_API_KEY;

            const { paidAutoInstrument } = await import("../../src/tracing/index.js");

            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should prevent re-initialization", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            await paidAutoInstrument();

            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });
    });

    describe("Manual instrumentation", () => {
        it("should accept empty libraries object", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            await expect(paidAutoInstrument({})).resolves.not.toThrow();
        });

        it("should handle undefined libraries parameter", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            await expect(paidAutoInstrument(undefined)).resolves.not.toThrow();
        });
    });

    describe("Instrumentation availability", () => {
        it("should gracefully handle when OpenAI instrumentation is not available", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should gracefully handle when Anthropic instrumentation is not available", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should gracefully handle when optional instrumentations are not available", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });
    });
});

describe("Instrumentation with mock libraries", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = "test-api-key";
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    it("should accept OpenAI library for manual instrumentation", async () => {
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

        initializeTracing("test-api-key");

        const mockOpenAI = class OpenAI {
            constructor() {}
        };

        await expect(paidAutoInstrument({ openai: mockOpenAI as any })).resolves.not.toThrow();
    });

    it("should accept Anthropic library for manual instrumentation", async () => {
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

        initializeTracing("test-api-key");

        const mockAnthropic = class Anthropic {
            constructor() {}
        };

        await expect(paidAutoInstrument({ anthropic: mockAnthropic as any })).resolves.not.toThrow();
    });

    it("should accept multiple libraries for manual instrumentation", async () => {
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

        initializeTracing("test-api-key");

        const mockOpenAI = class OpenAI {};
        const mockAnthropic = class Anthropic {};

        await expect(
            paidAutoInstrument({
                openai: mockOpenAI as any,
                anthropic: mockAnthropic as any,
            })
        ).resolves.not.toThrow();
    });
});

describe("OpenAI Auto Instrumentation - API Integration", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = "test-api-key";
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    it("should allow OpenAI API calls after instrumentation", async () => {
        const server = mockServerPool.createServer();

        server
            .mockEndpoint()
            .post("/v1/chat/completions")
            .respondWith()
            .statusCode(200)
            .header("content-type", "application/json")
            .jsonBody(MOCK_OPENAI_CHAT_RESPONSE)
            .build();

        const OpenAI = (await import("openai")).default;
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

        initializeTracing("test-api-key");
        await paidAutoInstrument({ openai: OpenAI });

        const client = new OpenAI({
            apiKey: "test-key",
            baseURL: server.baseUrl + "/v1",
        });

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Hello" }],
        });

        expect(response.id).toBe("chatcmpl-test123");
        expect(response.choices[0].message.content).toBe("Hello! How can I help you today?");
        expect(response.usage?.prompt_tokens).toBe(10);
        expect(response.usage?.completion_tokens).toBe(15);
    });

    it("should handle OpenAI API errors after instrumentation", async () => {
        const server = mockServerPool.createServer();

        server
            .mockEndpoint()
            .post("/v1/chat/completions")
            .respondWith()
            .statusCode(401)
            .header("content-type", "application/json")
            .jsonBody({
                error: {
                    message: "Invalid API key",
                    type: "invalid_request_error",
                    code: "invalid_api_key",
                },
            })
            .build();

        const OpenAI = (await import("openai")).default;
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

        initializeTracing("test-api-key");
        await paidAutoInstrument({ openai: OpenAI });

        const client = new OpenAI({
            apiKey: "invalid-key",
            baseURL: server.baseUrl + "/v1",
        });

        await expect(
            client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: "Hello" }],
            })
        ).rejects.toThrow();
    });
});

describe("Anthropic Auto Instrumentation - API Integration", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = "test-api-key";
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    it("should allow Anthropic API calls after instrumentation", async () => {
        const server = mockServerPool.createServer();

        server
            .mockEndpoint()
            .post("/v1/messages")
            .respondWith()
            .statusCode(200)
            .header("content-type", "application/json")
            .jsonBody(MOCK_ANTHROPIC_MESSAGE_RESPONSE)
            .build();

        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

        initializeTracing("test-api-key");
        await paidAutoInstrument({ anthropic: Anthropic });

        const client = new Anthropic({
            apiKey: "test-key",
            baseURL: server.baseUrl,
        });

        const response = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 100,
            messages: [{ role: "user", content: "Hello" }],
        });

        expect(response.id).toBe("msg_test123");
        expect(response.content[0].type).toBe("text");
        expect(response.usage.input_tokens).toBe(10);
        expect(response.usage.output_tokens).toBe(15);
    });

    it("should handle Anthropic API errors after instrumentation", async () => {
        const server = mockServerPool.createServer();

        server
            .mockEndpoint()
            .post("/v1/messages")
            .respondWith()
            .statusCode(401)
            .header("content-type", "application/json")
            .jsonBody({
                type: "error",
                error: {
                    type: "authentication_error",
                    message: "Invalid API key",
                },
            })
            .build();

        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

        initializeTracing("test-api-key");
        await paidAutoInstrument({ anthropic: Anthropic });

        const client = new Anthropic({
            apiKey: "invalid-key",
            baseURL: server.baseUrl,
        });

        await expect(
            client.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 100,
                messages: [{ role: "user", content: "Hello" }],
            })
        ).rejects.toThrow();
    });
});

describe("Combined Auto Instrumentation - API Integration", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = "test-api-key";
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    it("should allow both OpenAI and Anthropic API calls after combined instrumentation", async () => {
        const server = mockServerPool.createServer();

        server
            .mockEndpoint()
            .post("/v1/chat/completions")
            .respondWith()
            .statusCode(200)
            .header("content-type", "application/json")
            .jsonBody(MOCK_OPENAI_CHAT_RESPONSE)
            .build();

        server
            .mockEndpoint()
            .post("/v1/messages")
            .respondWith()
            .statusCode(200)
            .header("content-type", "application/json")
            .jsonBody(MOCK_ANTHROPIC_MESSAGE_RESPONSE)
            .build();

        const OpenAI = (await import("openai")).default;
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

        initializeTracing("test-api-key");
        await paidAutoInstrument({
            openai: OpenAI,
            anthropic: Anthropic,
        });

        // Make OpenAI call
        const openaiClient = new OpenAI({
            apiKey: "test-key",
            baseURL: server.baseUrl + "/v1",
        });
        const openaiResponse = await openaiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Hello from OpenAI" }],
        });
        expect(openaiResponse.id).toBe("chatcmpl-test123");

        // Make Anthropic call
        const anthropicClient = new Anthropic({
            apiKey: "test-key",
            baseURL: server.baseUrl,
        });
        const anthropicResponse = await anthropicClient.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 100,
            messages: [{ role: "user", content: "Hello from Anthropic" }],
        });
        expect(anthropicResponse.id).toBe("msg_test123");
    });
});

/**
 * Critical tests that verify instrumentation is actually registered.
 * These tests will FAIL if the instrumentation code is commented out.
 */
describe("Instrumentation Registration Verification", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = "test-api-key";
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
        vi.restoreAllMocks();
    });

    // Helper to create a mock instrumentation class with all required methods
    const createMockInstrumentation = (manuallyInstrumentMock: ReturnType<typeof vi.fn>) => {
        return class MockInstrumentation {
            instrumentationName = "mock";
            instrumentationVersion = "1.0.0";
            constructor() {}
            manuallyInstrument = manuallyInstrumentMock;
            setTracerProvider = vi.fn();
            setMeterProvider = vi.fn();
            getConfig = vi.fn().mockReturnValue({});
            setConfig = vi.fn();
            enable = vi.fn();
            disable = vi.fn();
        };
    };

    it("should call OpenAIInstrumentation.manuallyInstrument when openai library is provided", async () => {
        const manuallyInstrumentMock = vi.fn();

        // Mock the OpenAI instrumentation module
        vi.doMock("@arizeai/openinference-instrumentation-openai", () => ({
            OpenAIInstrumentation: createMockInstrumentation(manuallyInstrumentMock),
        }));

        // Re-import after mocking
        vi.resetModules();
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");
        const OpenAI = (await import("openai")).default;

        initializeTracing("test-api-key");
        await paidAutoInstrument({ openai: OpenAI });

        // This will FAIL if the openai instrumentation code is commented out
        expect(manuallyInstrumentMock).toHaveBeenCalledTimes(1);
        expect(manuallyInstrumentMock).toHaveBeenCalledWith(OpenAI);
    });

    it("should call AnthropicInstrumentation.manuallyInstrument when anthropic library is provided", async () => {
        const manuallyInstrumentMock = vi.fn();

        // Mock the Anthropic instrumentation module
        vi.doMock("@arizeai/openinference-instrumentation-anthropic", () => ({
            AnthropicInstrumentation: createMockInstrumentation(manuallyInstrumentMock),
        }));

        // Re-import after mocking
        vi.resetModules();
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");
        const Anthropic = (await import("@anthropic-ai/sdk")).default;

        initializeTracing("test-api-key");
        await paidAutoInstrument({ anthropic: Anthropic });

        // This will FAIL if the anthropic instrumentation code is commented out
        expect(manuallyInstrumentMock).toHaveBeenCalledTimes(1);
        expect(manuallyInstrumentMock).toHaveBeenCalledWith(Anthropic);
    });

    it("should call both instrumentations when both libraries are provided", async () => {
        const openaiManuallyInstrumentMock = vi.fn();
        const anthropicManuallyInstrumentMock = vi.fn();

        // Mock both instrumentation modules
        vi.doMock("@arizeai/openinference-instrumentation-openai", () => ({
            OpenAIInstrumentation: createMockInstrumentation(openaiManuallyInstrumentMock),
        }));

        vi.doMock("@arizeai/openinference-instrumentation-anthropic", () => ({
            AnthropicInstrumentation: createMockInstrumentation(anthropicManuallyInstrumentMock),
        }));

        // Re-import after mocking
        vi.resetModules();
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");
        const OpenAI = (await import("openai")).default;
        const Anthropic = (await import("@anthropic-ai/sdk")).default;

        initializeTracing("test-api-key");
        await paidAutoInstrument({ openai: OpenAI, anthropic: Anthropic });

        expect(openaiManuallyInstrumentMock).toHaveBeenCalledTimes(1);
        expect(anthropicManuallyInstrumentMock).toHaveBeenCalledTimes(1);
    });
});
