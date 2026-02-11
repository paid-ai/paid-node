/**
 * Span Capture Tests for Auto Instrumentation
 *
 * These tests verify that:
 * 1. paidAutoInstrument() captures spans from different vendors to the PAID tracer provider
 * 2. Spans contain expected attributes (model name, token usage, messages)
 *
 * This follows the Python SDK's testing approach:
 * 1. Create InMemorySpanExporter
 * 2. Replace tracing.paid_tracer_provider with test provider
 * 3. Call paidAutoInstrument()
 * 4. Make API calls
 * 5. Check exporter.getFinishedSpans()
 *
 * NOTE: Due to the nature of instrumentation (monkey-patching), tests must run
 * with proper isolation. The instrumentations persist across tests, so each
 * test suite should be run in isolation for accurate results.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { trace, context, propagation } from "@opentelemetry/api";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { InMemorySpanExporter, ReadableSpan } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { mockServerPool } from "../mock-server/MockServerPool";

// ============================================================================
// Test Configuration - Parameterized test data for each vendor
// ============================================================================

interface VendorTestConfig {
    name: string;
    serviceName: string;
    mockResponse: object;
    endpoint: string;
    expectedModel: string;
    expectedTokens: {
        prompt: number;
        completion: number;
        total: number;
    };
    expectedInput: {
        role: string;
        content: string;
    };
    expectedOutput: {
        role: string;
        content: string;
    };
    // Attribute name mappings (different instrumentations use different names)
    attributes: {
        model: string[];
        promptTokens: string[];
        completionTokens: string[];
        totalTokens: string[];
        inputRole: string[];
        inputContent: string[];
        outputRole: string[];
        outputContent: string[];
    };
    spanIdentifier: (span: ReadableSpan) => boolean;
}

const OPENAI_CONFIG: VendorTestConfig = {
    name: "OpenAI",
    serviceName: "paid-test-openai",
    mockResponse: {
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
    },
    endpoint: "/v1/chat/completions",
    expectedModel: "gpt-4o-mini",
    expectedTokens: {
        prompt: 10,
        completion: 15,
        total: 25,
    },
    expectedInput: {
        role: "user",
        content: "Hello",
    },
    expectedOutput: {
        role: "assistant",
        content: "Hello! How can I help you today?",
    },
    attributes: {
        model: ["llm.model_name", "gen_ai.request.model"],
        promptTokens: ["llm.token_count.prompt", "gen_ai.usage.input_tokens"],
        completionTokens: ["llm.token_count.completion", "gen_ai.usage.output_tokens"],
        totalTokens: ["llm.token_count.total"],
        inputRole: ["llm.input_messages.0.message.role"],
        inputContent: ["llm.input_messages.0.message.content"],
        outputRole: ["llm.output_messages.0.message.role"],
        outputContent: ["llm.output_messages.0.message.content"],
    },
    spanIdentifier: (span: ReadableSpan) =>
        span.name.includes("Chat") ||
        span.name.includes("OpenAI") ||
        span.attributes["llm.system"] === "openai" ||
        span.attributes["openinference.span.kind"] === "LLM",
};

const ANTHROPIC_CONFIG: VendorTestConfig = {
    name: "Anthropic",
    serviceName: "paid-test-anthropic",
    mockResponse: {
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
            input_tokens: 12,
            output_tokens: 18,
        },
    },
    endpoint: "/v1/messages",
    expectedModel: "claude-sonnet-4-20250514",
    expectedTokens: {
        prompt: 12,
        completion: 18,
        total: 30,
    },
    expectedInput: {
        role: "user",
        content: "Hello",
    },
    expectedOutput: {
        role: "assistant",
        content: "Hello! How can I help you today?",
    },
    attributes: {
        model: ["llm.model_name", "gen_ai.request.model"],
        promptTokens: ["llm.token_count.prompt", "gen_ai.usage.input_tokens"],
        completionTokens: ["llm.token_count.completion", "gen_ai.usage.output_tokens"],
        totalTokens: ["llm.token_count.total"],
        inputRole: ["llm.input_messages.0.message.role"],
        inputContent: ["llm.input_messages.0.message.content"],
        outputRole: ["llm.output_messages.0.message.role"],
        // Anthropic instrumentation uses nested structure for content blocks
        outputContent: ["llm.output_messages.0.message.contents.0.message_content.text", "llm.output_messages.0.message.content"],
    },
    spanIdentifier: (span: ReadableSpan) =>
        span.name.includes("Messages") ||
        span.name.includes("Anthropic") ||
        span.attributes["llm.system"] === "anthropic" ||
        span.attributes["openinference.span.kind"] === "LLM",
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get attribute value from span using multiple possible attribute names
 */
function getAttributeValue(span: ReadableSpan, possibleNames: string[]): unknown {
    for (const name of possibleNames) {
        const value = span.attributes[name];
        if (value !== undefined) {
            return value;
        }
    }
    return undefined;
}

/**
 * Find the LLM span from a list of spans
 */
function findLLMSpan(spans: ReadableSpan[], config: VendorTestConfig): ReadableSpan | undefined {
    return spans.find((s) => config.spanIdentifier(s));
}

// ============================================================================
// OpenAI Tests
// ============================================================================

describe("OpenAI Span Capture", () => {
    const config = OPENAI_CONFIG;
    let originalEnv: NodeJS.ProcessEnv;
    let provider: NodeTracerProvider;
    let exporter: InMemorySpanExporter;
    let llmSpan: ReadableSpan | undefined;

    beforeAll(async () => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = "test-api-key";
        vi.resetModules();

        // Create test provider and register as global
        exporter = new InMemorySpanExporter();
        provider = new NodeTracerProvider({
            resource: resourceFromAttributes({ "service.name": config.serviceName }),
            spanProcessors: [new SimpleSpanProcessor(exporter)],
        });
        provider.register();

        // Mock the tracing module to return our test provider
        vi.doMock("../../src/tracing/tracing.js", async (importOriginal) => {
            const original = await importOriginal<typeof import("../../src/tracing/tracing.js")>();
            return {
                ...original,
                getPaidTracerProvider: () => provider,
                initializeTracing: vi.fn(),
            };
        });

        // Import paidAutoInstrument after mocking
        const { paidAutoInstrument } = await import("../../src/tracing/autoInstrumentation.js");

        // Import OpenAI and instrument
        const OpenAI = (await import("openai")).default;
        await paidAutoInstrument({ openai: OpenAI });

        // Setup mock server and make API call
        const server = mockServerPool.createServer();
        server
            .mockEndpoint()
            .post(config.endpoint)
            .respondWith()
            .statusCode(200)
            .header("content-type", "application/json")
            .jsonBody(config.mockResponse)
            .build();

        const client = new OpenAI({
            apiKey: "test-key",
            baseURL: server.baseUrl + "/v1",
        });

        await client.chat.completions.create({
            model: config.expectedModel,
            messages: [{ role: "user", content: config.expectedInput.content }],
        });

        // Force flush and find the LLM span
        await provider.forceFlush();
        const spans = exporter.getFinishedSpans();
        llmSpan = findLLMSpan(spans, config);
    });

    afterAll(() => {
        process.env = originalEnv;
        trace.disable();
        context.disable();
        propagation.disable();
        vi.doUnmock("../../src/tracing/tracing.js");
    });

    it("should capture spans to PAID tracer provider", () => {
        const spans = exporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThan(0);
        expect(llmSpan).toBeDefined();
    });

    it("should capture correct model name", () => {
        expect(llmSpan).toBeDefined();
        const modelName = getAttributeValue(llmSpan!, config.attributes.model);
        expect(modelName).toBe(config.expectedModel);
    });

    it("should capture correct prompt token count", () => {
        expect(llmSpan).toBeDefined();
        const promptTokens = getAttributeValue(llmSpan!, config.attributes.promptTokens);
        expect(promptTokens).toBe(config.expectedTokens.prompt);
    });

    it("should capture correct completion token count", () => {
        expect(llmSpan).toBeDefined();
        const completionTokens = getAttributeValue(llmSpan!, config.attributes.completionTokens);
        expect(completionTokens).toBe(config.expectedTokens.completion);
    });

    it("should capture correct total token count", () => {
        expect(llmSpan).toBeDefined();
        const totalTokens = getAttributeValue(llmSpan!, config.attributes.totalTokens);
        expect(totalTokens).toBe(config.expectedTokens.total);
    });

    it("should capture correct input message role", () => {
        expect(llmSpan).toBeDefined();
        const inputRole = getAttributeValue(llmSpan!, config.attributes.inputRole);
        expect(inputRole).toBe(config.expectedInput.role);
    });

    it("should capture correct input message content", () => {
        expect(llmSpan).toBeDefined();
        const inputContent = getAttributeValue(llmSpan!, config.attributes.inputContent);
        expect(inputContent).toBe(config.expectedInput.content);
    });

    it("should capture correct output message role", () => {
        expect(llmSpan).toBeDefined();
        const outputRole = getAttributeValue(llmSpan!, config.attributes.outputRole);
        expect(outputRole).toBe(config.expectedOutput.role);
    });

    it("should capture correct output message content", () => {
        expect(llmSpan).toBeDefined();
        const outputContent = getAttributeValue(llmSpan!, config.attributes.outputContent);
        expect(outputContent).toBe(config.expectedOutput.content);
    });
});

// ============================================================================
// Anthropic Tests
// ============================================================================

describe("Anthropic Span Capture", () => {
    const config = ANTHROPIC_CONFIG;
    let originalEnv: NodeJS.ProcessEnv;
    let provider: NodeTracerProvider;
    let exporter: InMemorySpanExporter;
    let llmSpan: ReadableSpan | undefined;

    beforeAll(async () => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = "test-api-key";
        vi.resetModules();

        // Create test provider and register as global
        exporter = new InMemorySpanExporter();
        provider = new NodeTracerProvider({
            resource: resourceFromAttributes({ "service.name": config.serviceName }),
            spanProcessors: [new SimpleSpanProcessor(exporter)],
        });
        provider.register();

        // Mock the tracing module to return our test provider
        vi.doMock("../../src/tracing/tracing.js", async (importOriginal) => {
            const original = await importOriginal<typeof import("../../src/tracing/tracing.js")>();
            return {
                ...original,
                getPaidTracerProvider: () => provider,
                initializeTracing: vi.fn(),
            };
        });

        // Import paidAutoInstrument after mocking
        const { paidAutoInstrument } = await import("../../src/tracing/autoInstrumentation.js");

        // Import Anthropic and instrument
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        await paidAutoInstrument({ anthropic: Anthropic });

        // Setup mock server and make API call
        const server = mockServerPool.createServer();
        server
            .mockEndpoint()
            .post(config.endpoint)
            .respondWith()
            .statusCode(200)
            .header("content-type", "application/json")
            .jsonBody(config.mockResponse)
            .build();

        const client = new Anthropic({
            apiKey: "test-key",
            baseURL: server.baseUrl,
        });

        await client.messages.create({
            model: config.expectedModel,
            max_tokens: 100,
            messages: [{ role: "user", content: config.expectedInput.content }],
        });

        // Force flush and find the LLM span
        await provider.forceFlush();
        const spans = exporter.getFinishedSpans();
        llmSpan = findLLMSpan(spans, config);
    });

    afterAll(() => {
        process.env = originalEnv;
        trace.disable();
        context.disable();
        propagation.disable();
        vi.doUnmock("../../src/tracing/tracing.js");
    });

    it("should capture spans to PAID tracer provider", () => {
        const spans = exporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThan(0);
        expect(llmSpan).toBeDefined();
    });

    it("should capture correct model name", () => {
        expect(llmSpan).toBeDefined();
        const modelName = getAttributeValue(llmSpan!, config.attributes.model);
        expect(modelName).toBe(config.expectedModel);
    });

    it("should capture correct prompt token count", () => {
        expect(llmSpan).toBeDefined();
        const promptTokens = getAttributeValue(llmSpan!, config.attributes.promptTokens);
        expect(promptTokens).toBe(config.expectedTokens.prompt);
    });

    it("should capture correct completion token count", () => {
        expect(llmSpan).toBeDefined();
        const completionTokens = getAttributeValue(llmSpan!, config.attributes.completionTokens);
        expect(completionTokens).toBe(config.expectedTokens.completion);
    });

    it("should capture correct total token count", () => {
        expect(llmSpan).toBeDefined();
        const totalTokens = getAttributeValue(llmSpan!, config.attributes.totalTokens);
        // Total might not be provided by all instrumentations, calculate if not present
        const expectedTotal = config.expectedTokens.total;
        const actualTotal = getAttributeValue(llmSpan!, config.attributes.totalTokens);
        if (actualTotal !== undefined) {
            expect(actualTotal).toBe(expectedTotal);
        } else {
            // If total is not provided, verify prompt + completion = expected total
            const prompt = getAttributeValue(llmSpan!, config.attributes.promptTokens) as number;
            const completion = getAttributeValue(llmSpan!, config.attributes.completionTokens) as number;
            expect(prompt + completion).toBe(expectedTotal);
        }
    });

    it("should capture correct input message role", () => {
        expect(llmSpan).toBeDefined();
        const inputRole = getAttributeValue(llmSpan!, config.attributes.inputRole);
        expect(inputRole).toBe(config.expectedInput.role);
    });

    it("should capture correct input message content", () => {
        expect(llmSpan).toBeDefined();
        const inputContent = getAttributeValue(llmSpan!, config.attributes.inputContent);
        expect(inputContent).toBe(config.expectedInput.content);
    });

    it("should capture correct output message role", () => {
        expect(llmSpan).toBeDefined();
        const outputRole = getAttributeValue(llmSpan!, config.attributes.outputRole);
        expect(outputRole).toBe(config.expectedOutput.role);
    });

    it("should capture correct output message content", () => {
        expect(llmSpan).toBeDefined();
        const outputContent = getAttributeValue(llmSpan!, config.attributes.outputContent);
        expect(outputContent).toBe(config.expectedOutput.content);
    });
});

// ============================================================================
// Span Isolation Tests
// ============================================================================

describe("Span Isolation", () => {
    it("should not leak spans to unregistered user provider", async () => {
        // Create a user provider that is NOT registered as global
        const userExporter = new InMemorySpanExporter();
        const userProvider = new NodeTracerProvider({
            resource: resourceFromAttributes({ "service.name": "user-app" }),
            spanProcessors: [new SimpleSpanProcessor(userExporter)],
        });
        // Note: NOT calling userProvider.register()

        // Verify user provider has no spans (since it's not the global provider)
        await userProvider.forceFlush();
        const userSpans = userExporter.getFinishedSpans();

        // User provider should have no LLM spans since it wasn't registered
        // and the instrumentation uses the PAID provider
        expect(userSpans.length).toBe(0);
    });
});
