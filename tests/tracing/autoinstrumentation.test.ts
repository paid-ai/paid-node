/**
 * Auto-instrumentation tests for OpenAI and Anthropic.
 *
 * Tests that auto-instrumentation correctly captures spans and attributes
 * when making SDK calls to OpenAI and Anthropic (mocked via MSW).
 *
 * Uses MSW to mock API responses, allowing tests to run without real API keys.
 *
 * Note: Due to how Node.js module caching works with OpenTelemetry instrumentation,
 * these tests run as a single suite to avoid instrumentation state issues between tests.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { PaidSpanProcessor } from "../../src/tracing/spanProcessor";
import { AISDKSpanProcessor } from "../../src/tracing/aiSdkSpanProcessor";
import { runWithTracingContext } from "../../src/tracing/tracingContext";

// Test provider and exporter
let testExporter: InMemorySpanExporter;
let testProvider: NodeTracerProvider;

// Getter functions for the mock to use
const getTestProvider = () => testProvider;
const getTestTracer = () => testProvider?.getTracer("paid.node");

// Mock the tracing module
vi.mock("../../src/tracing/tracing", () => ({
    initializeTracing: vi.fn(),
    getPaidTracerProvider: vi.fn(() => getTestProvider()),
    getToken: vi.fn(() => "test-api-key"),
    getPaidTracer: vi.fn(() => getTestTracer()),
    logger: {
        info: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock OpenAI chat completion response
const mockOpenAIChatCompletionResponse = {
    id: "chatcmpl-test123",
    object: "chat.completion",
    created: 1704067200,
    model: "gpt-4-0613",
    choices: [
        {
            index: 0,
            message: {
                role: "assistant",
                content: "Hello! How can I help you today?",
            },
            logprobs: null,
            finish_reason: "stop",
        },
    ],
    usage: {
        prompt_tokens: 12,
        completion_tokens: 9,
        total_tokens: 21,
    },
    system_fingerprint: "fp_test",
};

// Mock OpenAI embedding response
const mockOpenAIEmbeddingResponse = {
    object: "list",
    data: [
        {
            object: "embedding",
            index: 0,
            embedding: new Array(1536).fill(0.1),
        },
    ],
    model: "text-embedding-ada-002",
    usage: {
        prompt_tokens: 8,
        total_tokens: 8,
    },
};

// Mock Anthropic message response
const mockAnthropicMessageResponse = {
    id: "msg_test123",
    type: "message",
    role: "assistant",
    content: [
        {
            type: "text",
            text: "Hello! I'm Claude. How can I help you?",
        },
    ],
    model: "claude-sonnet-4-20250514",
    stop_reason: "end_turn",
    stop_sequence: null,
    usage: {
        input_tokens: 15,
        output_tokens: 12,
    },
};

// Helper to create SSE stream for OpenAI streaming responses
function createOpenAIStreamResponse() {
    const chunks = [
        {
            id: "chatcmpl-stream123",
            object: "chat.completion.chunk",
            created: 1704067200,
            model: "gpt-4-0613",
            choices: [{ index: 0, delta: { role: "assistant", content: "" }, finish_reason: null }],
        },
        {
            id: "chatcmpl-stream123",
            object: "chat.completion.chunk",
            created: 1704067200,
            model: "gpt-4-0613",
            choices: [{ index: 0, delta: { content: "Hello" }, finish_reason: null }],
        },
        {
            id: "chatcmpl-stream123",
            object: "chat.completion.chunk",
            created: 1704067200,
            model: "gpt-4-0613",
            choices: [{ index: 0, delta: { content: " world" }, finish_reason: null }],
        },
        {
            id: "chatcmpl-stream123",
            object: "chat.completion.chunk",
            created: 1704067200,
            model: "gpt-4-0613",
            choices: [{ index: 0, delta: { content: "!" }, finish_reason: null }],
        },
        {
            id: "chatcmpl-stream123",
            object: "chat.completion.chunk",
            created: 1704067200,
            model: "gpt-4-0613",
            choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
            usage: { prompt_tokens: 10, completion_tokens: 3, total_tokens: 13 },
        },
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            for (const chunk of chunks) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
                await new Promise((resolve) => setTimeout(resolve, 5));
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
        },
    });

    return stream;
}

// Helper to create SSE stream for Anthropic streaming responses
function createAnthropicStreamResponse() {
    const events = [
        { event: "message_start", data: { type: "message_start", message: { id: "msg_stream123", type: "message", role: "assistant", content: [], model: "claude-sonnet-4-20250514", stop_reason: null, stop_sequence: null, usage: { input_tokens: 12, output_tokens: 0 } } } },
        { event: "content_block_start", data: { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } } },
        { event: "content_block_delta", data: { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "Hello" } } },
        { event: "content_block_delta", data: { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: " from" } } },
        { event: "content_block_delta", data: { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: " Claude!" } } },
        { event: "content_block_stop", data: { type: "content_block_stop", index: 0 } },
        { event: "message_delta", data: { type: "message_delta", delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: 5 } } },
        { event: "message_stop", data: { type: "message_stop" } },
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            for (const { event, data } of events) {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
                await new Promise((resolve) => setTimeout(resolve, 5));
            }
            controller.close();
        },
    });

    return stream;
}

// Setup MSW server with handlers
const server = setupServer(
    http.post("https://api.openai.com/v1/chat/completions", async ({ request }) => {
        const body = (await request.json()) as { stream?: boolean };
        if (body.stream) {
            return new HttpResponse(createOpenAIStreamResponse(), {
                headers: {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    Connection: "keep-alive",
                },
            });
        }
        return HttpResponse.json(mockOpenAIChatCompletionResponse);
    }),
    http.post("https://api.openai.com/v1/embeddings", () => {
        return HttpResponse.json(mockOpenAIEmbeddingResponse);
    }),
    http.post("https://api.anthropic.com/v1/messages", async ({ request }) => {
        const body = (await request.json()) as { stream?: boolean };
        if (body.stream) {
            return new HttpResponse(createAnthropicStreamResponse(), {
                headers: {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    Connection: "keep-alive",
                },
            });
        }
        return HttpResponse.json(mockAnthropicMessageResponse);
    })
);

describe("Auto-Instrumentation Integration", () => {
    beforeAll(async () => {
        server.listen({ onUnhandledRequest: "bypass" });

        // Set up test infrastructure once
        testExporter = new InMemorySpanExporter();
        testProvider = new NodeTracerProvider({
            resource: resourceFromAttributes({ "api.key": "test-key" }),
            spanProcessors: [
                new PaidSpanProcessor(),
                new AISDKSpanProcessor(),
                new SimpleSpanProcessor(testExporter),
            ],
        });
        testProvider.register();

        // Initialize auto-instrumentation once for all tests
        const { paidAutoInstrument } = await import("../../src/tracing/autoInstrumentation");
        const OpenAI = (await import("openai")).default;
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        await paidAutoInstrument({ openai: OpenAI, anthropic: Anthropic });
    });

    afterAll(async () => {
        server.close();
        await testProvider?.shutdown();
    });

    it("should create span for OpenAI chat completion with context attributes", async () => {
        testExporter.reset();

        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey: "test-key" });

        await runWithTracingContext({ externalCustomerId: "cust-openai" }, async () => {
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: "Hello" }],
            });

            expect(response.id).toBe("chatcmpl-test123");
            expect(response.choices[0].message.content).toBe("Hello! How can I help you today?");
        });

        const spans = testExporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThan(0);

        // Find the LLM span (case-insensitive)
        const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
        expect(llmSpan).toBeDefined();
        expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-openai");
    });

    it("should create span for OpenAI embeddings", async () => {
        testExporter.reset();

        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey: "test-key" });

        await runWithTracingContext({ externalCustomerId: "cust-embedding" }, async () => {
            const response = await openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: "Hello world",
            });

            expect(response.data.length).toBeGreaterThan(0);
        });

        const spans = testExporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThan(0);

        const embeddingSpan = spans.find((s) => s.name.toLowerCase().includes("embed"));
        expect(embeddingSpan).toBeDefined();
        expect(embeddingSpan?.attributes["external_customer_id"]).toBe("cust-embedding");
    });

    it("should create span for Anthropic message creation with context attributes", async () => {
        testExporter.reset();

        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const anthropic = new Anthropic({ apiKey: "test-key" });

        await runWithTracingContext({ externalCustomerId: "cust-anthropic" }, async () => {
            const response = await anthropic.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 100,
                messages: [{ role: "user", content: "Hello" }],
            });

            expect(response.id).toBe("msg_test123");
            expect(response.content[0].type).toBe("text");
        });

        const spans = testExporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThan(0);

        // Find the LLM span (case-insensitive)
        const llmSpan = spans.find((s) => s.name.toLowerCase().includes("message"));
        expect(llmSpan).toBeDefined();
        expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-anthropic");
    });

    it("should capture spans from multiple providers in single trace context", async () => {
        testExporter.reset();

        const OpenAI = (await import("openai")).default;
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const openai = new OpenAI({ apiKey: "test-key" });
        const anthropic = new Anthropic({ apiKey: "test-key" });

        await runWithTracingContext({ externalCustomerId: "multi-provider-cust" }, async () => {
            // OpenAI call
            await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: "Hello from OpenAI" }],
            });

            // Anthropic call
            await anthropic.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 100,
                messages: [{ role: "user", content: "Hello from Anthropic" }],
            });
        });

        const spans = testExporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThanOrEqual(2);

        // All spans should have the same customer ID
        for (const span of spans) {
            expect(span.attributes["external_customer_id"]).toBe("multi-provider-cust");
        }
    });

    it("should filter prompt content when storePrompt is false", async () => {
        testExporter.reset();

        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey: "test-key" });

        await runWithTracingContext(
            { externalCustomerId: "cust-filtered", storePrompt: false },
            async () => {
                await openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [{ role: "user", content: "Secret message" }],
                });
            }
        );

        const spans = testExporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThan(0);

        const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
        expect(llmSpan).toBeDefined();

        // Verify prompt-related attributes are filtered
        const attrs = llmSpan?.attributes || {};
        const hasPromptContent = Object.keys(attrs).some(
            (key) =>
                key.includes("input.value") ||
                key.includes("output.value") ||
                key.includes("gen_ai.prompt") ||
                key.includes("gen_ai.completion")
        );
        expect(hasPromptContent).toBe(false);
    });

    it("should keep prompt content when storePrompt is true", async () => {
        testExporter.reset();

        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey: "test-key" });

        await runWithTracingContext(
            { externalCustomerId: "cust-stored", storePrompt: true },
            async () => {
                await openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [{ role: "user", content: "Hello" }],
                });
            }
        );

        const spans = testExporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThan(0);

        const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
        expect(llmSpan).toBeDefined();

        // When storePrompt is true, prompt content should be present
        // Verify that prompt-related attributes are NOT filtered out
        const attrs = llmSpan?.attributes || {};
        const promptKeys = Object.keys(attrs).filter(
            (key) =>
                key.includes("input.value") ||
                key.includes("output.value") ||
                key.includes("gen_ai.prompt") ||
                key.includes("gen_ai.completion") ||
                key.includes("llm.input") ||
                key.includes("llm.output")
        );
        // At least some prompt-related content should be present when storePrompt is true
        expect(promptKeys.length).toBeGreaterThan(0);
    });

    it("should capture token usage attributes", async () => {
        testExporter.reset();

        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey: "test-key" });

        await runWithTracingContext({ externalCustomerId: "cust-tokens" }, async () => {
            await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: "Hello" }],
            });
        });

        const spans = testExporter.getFinishedSpans();
        const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
        expect(llmSpan).toBeDefined();

        // Check that token-related attributes are captured
        const attrs = llmSpan?.attributes || {};
        const hasTokenAttrs = Object.keys(attrs).some(
            (key) => key.includes("token") || key.includes("usage")
        );
        expect(hasTokenAttrs).toBe(true);
    });

    it("should create span for OpenAI streaming chat completion", async () => {
        testExporter.reset();

        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey: "test-key" });

        await runWithTracingContext({ externalCustomerId: "cust-streaming" }, async () => {
            const stream = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: "Hello" }],
                stream: true,
            });

            // Consume the stream
            let fullContent = "";
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    fullContent += content;
                }
            }

            expect(fullContent).toBe("Hello world!");
        });

        const spans = testExporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThan(0);

        // Find the LLM span
        const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
        expect(llmSpan).toBeDefined();
        expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-streaming");
    });

    it("should create span for Anthropic streaming messages", async () => {
        testExporter.reset();

        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        const anthropic = new Anthropic({ apiKey: "test-key" });

        await runWithTracingContext({ externalCustomerId: "cust-anthropic-stream" }, async () => {
            const stream = await anthropic.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 100,
                messages: [{ role: "user", content: "Hello" }],
                stream: true,
            });

            // Consume the stream
            let fullContent = "";
            for await (const event of stream) {
                if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
                    fullContent += event.delta.text;
                }
            }

            expect(fullContent).toBe("Hello from Claude!");
        });

        const spans = testExporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThan(0);

        // Find the LLM span
        const llmSpan = spans.find((s) => s.name.toLowerCase().includes("message"));
        expect(llmSpan).toBeDefined();
        expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-anthropic-stream");
    });

    it("should capture context attributes in streaming with storePrompt false", async () => {
        testExporter.reset();

        const OpenAI = (await import("openai")).default;
        const openai = new OpenAI({ apiKey: "test-key" });

        await runWithTracingContext(
            { externalCustomerId: "cust-stream-filtered", storePrompt: false },
            async () => {
                const stream = await openai.chat.completions.create({
                    model: "gpt-4",
                    messages: [{ role: "user", content: "Secret streaming message" }],
                    stream: true,
                });

                // Consume the stream
                for await (const chunk of stream) {
                    // Just consume
                    void chunk;
                }
            }
        );

        const spans = testExporter.getFinishedSpans();
        const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
        expect(llmSpan).toBeDefined();

        // Verify prompt content is filtered
        const attrs = llmSpan?.attributes || {};
        const hasPromptContent = Object.keys(attrs).some(
            (key) =>
                key.includes("input.value") ||
                key.includes("output.value") ||
                key.includes("gen_ai.prompt") ||
                key.includes("gen_ai.completion")
        );
        expect(hasPromptContent).toBe(false);
    });
});
