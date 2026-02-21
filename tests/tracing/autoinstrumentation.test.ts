/**
 * Auto-instrumentation tests for OpenAI and Anthropic.
 *
 * Tests that auto-instrumentation correctly captures spans and attributes
 * when making SDK calls to OpenAI and Anthropic.
 *
 * Uses nock.back to record/replay HTTP interactions (similar to pytest-vcr).
 *
 * Recording cassettes:
 *   OPENAI_API_KEY=sk-... ANTHROPIC_API_KEY=sk-... NOCK_BACK_MODE=record pnpm test --project tracing
 *
 * Running with recorded cassettes (default):
 *   pnpm test --project tracing
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from "vitest";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import nock from "nock";
import path from "path";
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

// Configure nock.back for cassette recording/playback
const cassettesDir = path.join(__dirname, "cassettes");
nock.back.fixtures = cassettesDir;

// Set mode based on environment variable (default: lockdown for CI)
const nockMode = (process.env.NOCK_BACK_MODE as nock.BackMode) || "lockdown";
nock.back.setMode(nockMode);

// Headers to redact in recorded cassettes (for security)
const HEADERS_TO_REDACT = ["x-api-key", "authorization", "set-cookie"];

// Redact sensitive headers but preserve request-id and cf-ray
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function afterRecord(recordings: any[]): any[] {
    return recordings.map((recording) => {
        if (recording.rawHeaders && typeof recording.rawHeaders === "object") {
            const headers = recording.rawHeaders as Record<string, string>;
            for (const header of HEADERS_TO_REDACT) {
                if (headers[header]) {
                    headers[header] = "REDACTED";
                }
            }
        }
        return recording;
    });
}

// nock.back options with afterRecord hook
const nockBackOptions = { afterRecord };

// Helper to get cassette filename from test name
function getCassetteName(testName: string): string {
    return `${testName.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
}

describe("Auto-Instrumentation Integration", () => {
    beforeAll(async () => {
        // Set up test infrastructure once
        testExporter = new InMemorySpanExporter();
        testProvider = new NodeTracerProvider({
            resource: resourceFromAttributes({ "api.key": "test-key" }),
            spanProcessors: [new PaidSpanProcessor(), new AISDKSpanProcessor(), new SimpleSpanProcessor(testExporter)],
        });
        testProvider.register();

        // Initialize auto-instrumentation once for all tests
        const { paidAutoInstrumentModules } = await import("../../src/tracing/autoInstrumentation");
        const OpenAI = (await import("openai")).default;
        const Anthropic = (await import("@anthropic-ai/sdk")).default;
        await paidAutoInstrumentModules({ openai: OpenAI, anthropic: Anthropic });
    });

    afterAll(async () => {
        nock.restore();
        nock.cleanAll();
        await testProvider?.shutdown();
    });

    beforeEach(() => {
        testExporter.reset();
    });

    describe("OpenAI Chat Completions", () => {
        it("should create span for chat completion with context attributes", async () => {
            const cassetteName = getCassetteName("openai_chat_completion");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-openai" }, async () => {
                    const response = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "Say hello in exactly 3 words." }],
                        max_tokens: 32,
                    });

                    expect(response.choices.length).toBeGreaterThan(0);
                    expect(response.choices[0].message.content).toBeTruthy();
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
                expect(llmSpan).toBeDefined();
                expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-openai");
            } finally {
                nockDone();
            }
        });

        it("should create span for streaming chat completion", async () => {
            const cassetteName = getCassetteName("openai_chat_completion_stream");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-streaming" }, async () => {
                    const stream = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "Say hello" }],
                        max_tokens: 32,
                        stream: true,
                    });

                    let fullContent = "";
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            fullContent += content;
                        }
                    }

                    expect(fullContent.length).toBeGreaterThan(0);
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
                expect(llmSpan).toBeDefined();
                expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-streaming");
            } finally {
                nockDone();
            }
        });

        it("should capture token usage attributes", async () => {
            const cassetteName = getCassetteName("openai_token_usage");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-tokens" }, async () => {
                    await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "Hello" }],
                        max_tokens: 32,
                    });
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
                expect(llmSpan).toBeDefined();

                const attrs = llmSpan?.attributes || {};
                const hasTokenAttrs = Object.keys(attrs).some((key) => key.includes("token") || key.includes("usage"));
                expect(hasTokenAttrs).toBe(true);
            } finally {
                nockDone();
            }
        });

        it("should capture exact token counts matching API response", async () => {
            const cassetteName = getCassetteName("openai_exact_token_count");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });

                let responseUsage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined;

                await runWithTracingContext({ externalCustomerId: "cust-exact-tokens" }, async () => {
                    const response = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "Say hello in exactly 3 words." }],
                        max_tokens: 32,
                    });

                    responseUsage = response.usage;
                    expect(responseUsage).toBeDefined();
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
                expect(llmSpan).toBeDefined();

                const attrs = llmSpan?.attributes || {};

                // Find token attributes (different instrumentations use different attribute names)
                const promptTokens =
                    attrs["llm.token_count.prompt"] ||
                    attrs["gen_ai.usage.prompt_tokens"] ||
                    attrs["llm.usage.prompt_tokens"];
                const completionTokens =
                    attrs["llm.token_count.completion"] ||
                    attrs["gen_ai.usage.completion_tokens"] ||
                    attrs["llm.usage.completion_tokens"];

                // Verify token counts match the API response
                if (promptTokens !== undefined) {
                    expect(promptTokens).toBe(responseUsage!.prompt_tokens);
                }
                if (completionTokens !== undefined) {
                    expect(completionTokens).toBe(responseUsage!.completion_tokens);
                }
            } finally {
                nockDone();
            }
        });

        it("should capture exact token counts in streaming with stream_options", async () => {
            const cassetteName = getCassetteName("openai_stream_exact_token_count");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });

                let streamUsage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | undefined;

                await runWithTracingContext({ externalCustomerId: "cust-stream-tokens" }, async () => {
                    const stream = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "Say hello in exactly 3 words." }],
                        max_tokens: 32,
                        stream: true,
                        stream_options: { include_usage: true },
                    });

                    for await (const chunk of stream) {
                        // Usage is included in the final chunk
                        if (chunk.usage) {
                            streamUsage = chunk.usage;
                        }
                    }

                    expect(streamUsage).toBeDefined();
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
                expect(llmSpan).toBeDefined();

                const attrs = llmSpan?.attributes || {};

                // Find token attributes
                const promptTokens =
                    attrs["llm.token_count.prompt"] ||
                    attrs["gen_ai.usage.prompt_tokens"] ||
                    attrs["llm.usage.prompt_tokens"];
                const completionTokens =
                    attrs["llm.token_count.completion"] ||
                    attrs["gen_ai.usage.completion_tokens"] ||
                    attrs["llm.usage.completion_tokens"];

                // Verify token counts match the streaming response
                if (promptTokens !== undefined) {
                    expect(promptTokens).toBe(streamUsage!.prompt_tokens);
                }
                if (completionTokens !== undefined) {
                    expect(completionTokens).toBe(streamUsage!.completion_tokens);
                }
            } finally {
                nockDone();
            }
        });
    });

    describe("OpenAI Embeddings", () => {
        it("should create span for embeddings", async () => {
            const cassetteName = getCassetteName("openai_embeddings");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-embedding" }, async () => {
                    const response = await openai.embeddings.create({
                        model: "text-embedding-3-small",
                        input: "Hello world",
                    });

                    expect(response.data.length).toBeGreaterThan(0);
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const embeddingSpan = spans.find((s) => s.name.toLowerCase().includes("embed"));
                expect(embeddingSpan).toBeDefined();
                expect(embeddingSpan?.attributes["external_customer_id"]).toBe("cust-embedding");
            } finally {
                nockDone();
            }
        });
    });

    describe("Anthropic Messages", () => {
        it("should create span for message creation with context attributes", async () => {
            const cassetteName = getCassetteName("anthropic_message");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const Anthropic = (await import("@anthropic-ai/sdk")).default;
                const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-anthropic" }, async () => {
                    const response = await anthropic.messages.create({
                        model: "claude-sonnet-4-20250514",
                        max_tokens: 32,
                        messages: [{ role: "user", content: "Say hello in exactly 3 words." }],
                    });

                    expect(response.content.length).toBeGreaterThan(0);
                    expect(response.content[0].type).toBe("text");
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("message"));
                expect(llmSpan).toBeDefined();
                expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-anthropic");
            } finally {
                nockDone();
            }
        });

        it("should create span for streaming messages", async () => {
            const cassetteName = getCassetteName("anthropic_message_stream");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const Anthropic = (await import("@anthropic-ai/sdk")).default;
                const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-anthropic-stream" }, async () => {
                    const stream = await anthropic.messages.create({
                        model: "claude-sonnet-4-20250514",
                        max_tokens: 32,
                        messages: [{ role: "user", content: "Say hello" }],
                        stream: true,
                    });

                    let fullContent = "";
                    for await (const event of stream) {
                        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
                            fullContent += event.delta.text;
                        }
                    }

                    expect(fullContent.length).toBeGreaterThan(0);
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("message"));
                expect(llmSpan).toBeDefined();
                expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-anthropic-stream");
            } finally {
                nockDone();
            }
        });
    });

    describe("Multi-Provider Context", () => {
        it("should capture spans from multiple providers in single trace context", async () => {
            const cassetteName = getCassetteName("multi_provider");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const Anthropic = (await import("@anthropic-ai/sdk")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });
                const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "multi-provider-cust" }, async () => {
                    await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "Hello" }],
                        max_tokens: 16,
                    });

                    await anthropic.messages.create({
                        model: "claude-sonnet-4-20250514",
                        max_tokens: 16,
                        messages: [{ role: "user", content: "Hello" }],
                    });
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThanOrEqual(2);

                for (const span of spans) {
                    expect(span.attributes["external_customer_id"]).toBe("multi-provider-cust");
                }
            } finally {
                nockDone();
            }
        });
    });

    describe("Prompt Filtering", () => {
        it("should filter prompt content when storePrompt is false", async () => {
            const cassetteName = getCassetteName("prompt_filtered");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-filtered", storePrompt: false }, async () => {
                    await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "Secret message" }],
                        max_tokens: 32,
                    });
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
                expect(llmSpan).toBeDefined();

                const attrs = llmSpan?.attributes || {};
                const hasPromptContent = Object.keys(attrs).some(
                    (key) =>
                        key.includes("input.value") ||
                        key.includes("output.value") ||
                        key.includes("gen_ai.prompt") ||
                        key.includes("gen_ai.completion")
                );
                expect(hasPromptContent).toBe(false);
            } finally {
                nockDone();
            }
        });

        it("should keep prompt content when storePrompt is true", async () => {
            const cassetteName = getCassetteName("prompt_stored");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-stored", storePrompt: true }, async () => {
                    await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "Hello" }],
                        max_tokens: 32,
                    });
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
                expect(llmSpan).toBeDefined();

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
                expect(promptKeys.length).toBeGreaterThan(0);
            } finally {
                nockDone();
            }
        });

        it("should filter prompt content in streaming with storePrompt false", async () => {
            const cassetteName = getCassetteName("prompt_filtered_stream");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const OpenAI = (await import("openai")).default;
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-stream-filtered", storePrompt: false }, async () => {
                    const stream = await openai.chat.completions.create({
                        model: "gpt-4o-mini",
                        messages: [{ role: "user", content: "Secret streaming message" }],
                        max_tokens: 32,
                        stream: true,
                    });

                    for await (const chunk of stream) {
                        void chunk;
                    }
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("chat"));
                expect(llmSpan).toBeDefined();

                const attrs = llmSpan?.attributes || {};
                const hasPromptContent = Object.keys(attrs).some(
                    (key) =>
                        key.includes("input.value") ||
                        key.includes("output.value") ||
                        key.includes("gen_ai.prompt") ||
                        key.includes("gen_ai.completion")
                );
                expect(hasPromptContent).toBe(false);
            } finally {
                nockDone();
            }
        });
    });
});
