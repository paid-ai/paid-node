/**
 * AI SDK (Vercel) tracing tests.
 *
 * Tests that the AI SDK wrapper correctly captures spans and attributes
 * for generateText, streamText, tool calls, structured output, and agent loops.
 *
 * Uses nock.back to record/replay HTTP interactions (similar to pytest-vcr).
 *
 * Recording cassettes:
 *   OPENAI_API_KEY=sk-... NOCK_BACK_MODE=record pnpm test -- ai-sdk
 *
 * Running with recorded cassettes (default):
 *   pnpm test -- ai-sdk
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import nock from "nock";
import path from "path";
import { z } from "zod";
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
const HEADERS_TO_REDACT = ["x-api-key", "authorization", "set-cookie", "openai-organization", "openai-project"];

// Redact sensitive headers but preserve request-id
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

describe("AI SDK Tracing", () => {
    beforeAll(async () => {
        // Set dummy API key for nock playback mode (AI SDK validates key exists before HTTP call)
        if (!process.env.OPENAI_API_KEY) {
            process.env.OPENAI_API_KEY = "sk-test-dummy-key-for-nock-playback";
        }

        // Set up test infrastructure once
        testExporter = new InMemorySpanExporter();
        testProvider = new NodeTracerProvider({
            resource: resourceFromAttributes({ "api.key": "test-key" }),
            spanProcessors: [new PaidSpanProcessor(), new AISDKSpanProcessor(), new SimpleSpanProcessor(testExporter)],
        });
        testProvider.register();
    });

    afterAll(async () => {
        nock.restore();
        nock.cleanAll();
        await testProvider?.shutdown();
    });

    beforeEach(() => {
        testExporter.reset();
    });

    describe("generateText", () => {
        it("should create span with correct attributes", async () => {
            const cassetteName = getCassetteName("ai_sdk_generate_text");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const { openai } = await import("@ai-sdk/openai");
                const { generateText } = await import("../../src/tracing/wrappers/vercelAIWrapper");

                await runWithTracingContext(
                    { externalCustomerId: "cust-ai-sdk", externalProductId: "agent-1" },
                    async () => {
                        const result = await generateText({
                            model: openai("gpt-4o-mini", { apiKey: process.env.OPENAI_API_KEY || "sk-test-dummy-key-for-nock-playback" }),
                            prompt: "Say hello in exactly 3 words.",
                            maxTokens: 32,
                        });

                        expect(result.text).toBeTruthy();
                        expect(result.text.split(" ").length).toBeGreaterThanOrEqual(1);
                    }
                );

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const aiSpan = spans.find((s) => s.name.includes("generateText"));
                expect(aiSpan).toBeDefined();
                expect(aiSpan?.attributes["external_customer_id"]).toBe("cust-ai-sdk");
                expect(aiSpan?.attributes["external_agent_id"]).toBe("agent-1");
                expect(aiSpan?.attributes["gen_ai.system"]).toBe("openai");
            } finally {
                nockDone();
            }
        });

        it("should capture token usage", async () => {
            const cassetteName = getCassetteName("ai_sdk_generate_text_usage");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const { openai } = await import("@ai-sdk/openai");
                const { generateText } = await import("../../src/tracing/wrappers/vercelAIWrapper");

                await runWithTracingContext({ externalCustomerId: "cust-usage" }, async () => {
                    const result = await generateText({
                        model: openai("gpt-4o-mini", { apiKey: process.env.OPENAI_API_KEY || "sk-test-dummy-key-for-nock-playback" }),
                        prompt: "Hello",
                        maxTokens: 32,
                    });

                    expect(result.usage).toBeDefined();
                    // AI SDK v5 uses inputTokens, v4 uses promptTokens
                    const inputTokens = (result.usage as any).inputTokens ?? (result.usage as any).promptTokens;
                    expect(inputTokens).toBeGreaterThan(0);
                });

                const spans = testExporter.getFinishedSpans();
                const aiSpan = spans.find((s) => s.name.includes("generateText"));
                expect(aiSpan).toBeDefined();

                const attrs = aiSpan?.attributes || {};
                expect(attrs["gen_ai.usage.input_tokens"]).toBeDefined();
                expect(attrs["gen_ai.usage.output_tokens"]).toBeDefined();
            } finally {
                nockDone();
            }
        });
    });

    describe("streamText", () => {
        it("should create span for streaming text generation", async () => {
            const cassetteName = getCassetteName("ai_sdk_stream_text");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const { openai } = await import("@ai-sdk/openai");
                const { streamText } = await import("../../src/tracing/wrappers/vercelAIWrapper");

                await runWithTracingContext({ externalCustomerId: "cust-stream" }, async () => {
                    const result = await streamText({
                        model: openai("gpt-4o-mini", { apiKey: process.env.OPENAI_API_KEY || "sk-test-dummy-key-for-nock-playback" }),
                        prompt: "Say hello",
                        maxTokens: 32,
                    });

                    let fullText = "";
                    for await (const chunk of result.textStream) {
                        fullText += chunk;
                    }

                    expect(fullText.length).toBeGreaterThan(0);
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const aiSpan = spans.find((s) => s.name.includes("streamText"));
                expect(aiSpan).toBeDefined();
                expect(aiSpan?.attributes["external_customer_id"]).toBe("cust-stream");
            } finally {
                nockDone();
            }
        });
    });

    describe("Tool Calls", () => {
        it("should create span for generateText with tool call", async () => {
            const cassetteName = getCassetteName("ai_sdk_tool_call");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const { openai } = await import("@ai-sdk/openai");
                const { tool } = await import("ai");
                const { generateText } = await import("../../src/tracing/wrappers/vercelAIWrapper");

                await runWithTracingContext({ externalCustomerId: "cust-tool" }, async () => {
                    const result = await generateText({
                        model: openai("gpt-4o-mini", { apiKey: process.env.OPENAI_API_KEY || "sk-test-dummy-key-for-nock-playback" }),
                        prompt: "What is the weather in San Francisco?",
                        maxTokens: 100,
                        maxSteps: 2,
                        tools: {
                            getWeather: tool({
                                description: "Get the weather for a location",
                                inputSchema: z.object({
                                    location: z.string().describe("The city name"),
                                }),
                                execute: async ({ location }) => {
                                    return { temperature: 72, condition: "sunny", location };
                                },
                            }),
                        },
                    });

                    // The model may or may not call the tool, but it should complete
                    expect(result).toBeDefined();
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const aiSpan = spans.find((s) => s.name.includes("generateText"));
                expect(aiSpan).toBeDefined();
                expect(aiSpan?.attributes["external_customer_id"]).toBe("cust-tool");
            } finally {
                nockDone();
            }
        });
    });

    describe("Structured Output (generateObject)", () => {
        it("should create span for structured output generation", async () => {
            const cassetteName = getCassetteName("ai_sdk_generate_object");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const { openai } = await import("@ai-sdk/openai");
                const { generateObject } = await import("../../src/tracing/wrappers/vercelAIWrapper");

                const PersonSchema = z.object({
                    name: z.string(),
                    age: z.number(),
                    occupation: z.string(),
                });

                await runWithTracingContext({ externalCustomerId: "cust-object" }, async () => {
                    const result = await generateObject({
                        model: openai("gpt-4o-mini", { apiKey: process.env.OPENAI_API_KEY || "sk-test-dummy-key-for-nock-playback" }),
                        schema: PersonSchema,
                        prompt: "Generate a fictional person with name, age, and occupation.",
                        maxTokens: 100,
                    });

                    expect(result.object).toBeDefined();
                    expect(result.object.name).toBeTruthy();
                    expect(typeof result.object.age).toBe("number");
                    expect(result.object.occupation).toBeTruthy();
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const aiSpan = spans.find((s) => s.name.includes("generateObject"));
                expect(aiSpan).toBeDefined();
                expect(aiSpan?.attributes["external_customer_id"]).toBe("cust-object");
                expect(aiSpan?.attributes["gen_ai.system"]).toBe("openai");
            } finally {
                nockDone();
            }
        });

        it("should capture token usage for structured output", async () => {
            const cassetteName = getCassetteName("ai_sdk_generate_object_usage");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const { openai } = await import("@ai-sdk/openai");
                const { generateObject } = await import("../../src/tracing/wrappers/vercelAIWrapper");

                const SimpleSchema = z.object({
                    greeting: z.string(),
                });

                await runWithTracingContext({ externalCustomerId: "cust-object-usage" }, async () => {
                    const result = await generateObject({
                        model: openai("gpt-4o-mini", { apiKey: process.env.OPENAI_API_KEY || "sk-test-dummy-key-for-nock-playback" }),
                        schema: SimpleSchema,
                        prompt: "Generate a simple greeting.",
                        maxTokens: 50,
                    });

                    expect(result.usage).toBeDefined();
                });

                const spans = testExporter.getFinishedSpans();
                const aiSpan = spans.find((s) => s.name.includes("generateObject"));
                expect(aiSpan).toBeDefined();

                const attrs = aiSpan?.attributes || {};
                expect(attrs["gen_ai.usage.input_tokens"]).toBeDefined();
                expect(attrs["gen_ai.usage.output_tokens"]).toBeDefined();
            } finally {
                nockDone();
            }
        });
    });

    describe("Agent Loop (maxSteps)", () => {
        it("should create span for multi-step agent execution", async () => {
            const cassetteName = getCassetteName("ai_sdk_agent_loop");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const { openai } = await import("@ai-sdk/openai");
                const { tool } = await import("ai");
                const { generateText } = await import("../../src/tracing/wrappers/vercelAIWrapper");

                let toolCallCount = 0;

                await runWithTracingContext({ externalCustomerId: "cust-agent" }, async () => {
                    const result = await generateText({
                        model: openai("gpt-4o-mini", { apiKey: process.env.OPENAI_API_KEY || "sk-test-dummy-key-for-nock-playback" }),
                        prompt: "First get the weather in San Francisco, then tell me if I need a jacket.",
                        maxTokens: 200,
                        maxSteps: 3,
                        tools: {
                            getWeather: tool({
                                description: "Get the weather for a location",
                                inputSchema: z.object({
                                    location: z.string().describe("The city name"),
                                }),
                                execute: async ({ location }) => {
                                    toolCallCount++;
                                    return {
                                        temperature: 55,
                                        condition: "cloudy and windy",
                                        location,
                                    };
                                },
                            }),
                        },
                    });

                    expect(result).toBeDefined();
                    // result.text may be empty if model only called tools without final response
                    expect(result.steps?.length || result.text).toBeTruthy();
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const aiSpan = spans.find((s) => s.name.includes("generateText"));
                expect(aiSpan).toBeDefined();
                expect(aiSpan?.attributes["external_customer_id"]).toBe("cust-agent");

                // Agent should have used the tool at least once
                expect(toolCallCount).toBeGreaterThanOrEqual(1);
            } finally {
                nockDone();
            }
        });

        it("should track multiple tool calls in agent loop", async () => {
            const cassetteName = getCassetteName("ai_sdk_agent_multi_tool");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const { openai } = await import("@ai-sdk/openai");
                const { tool } = await import("ai");
                const { generateText } = await import("../../src/tracing/wrappers/vercelAIWrapper");

                const toolCalls: string[] = [];

                await runWithTracingContext({ externalCustomerId: "cust-multi-tool" }, async () => {
                    const result = await generateText({
                        model: openai("gpt-4o-mini", { apiKey: process.env.OPENAI_API_KEY || "sk-test-dummy-key-for-nock-playback" }),
                        prompt:
                            "What is 25 * 4? Then add 10 to the result. Use the calculator tool for each operation.",
                        maxTokens: 200,
                        maxSteps: 5,
                        tools: {
                            calculator: tool({
                                description: "Perform arithmetic operations",
                                inputSchema: z.object({
                                    operation: z.enum(["add", "subtract", "multiply", "divide"]),
                                    a: z.number(),
                                    b: z.number(),
                                }),
                                execute: async ({ operation, a, b }) => {
                                    toolCalls.push(`${operation}(${a}, ${b})`);
                                    switch (operation) {
                                        case "add":
                                            return { result: a + b };
                                        case "subtract":
                                            return { result: a - b };
                                        case "multiply":
                                            return { result: a * b };
                                        case "divide":
                                            return { result: a / b };
                                    }
                                },
                            }),
                        },
                    });

                    expect(result).toBeDefined();
                    // result.text may be empty if model only called tools without final response
                    expect(result.steps?.length || result.text).toBeTruthy();
                });

                const spans = testExporter.getFinishedSpans();
                const aiSpan = spans.find((s) => s.name.includes("generateText"));
                expect(aiSpan).toBeDefined();
                expect(aiSpan?.attributes["external_customer_id"]).toBe("cust-multi-tool");

                // Should have made at least one tool call
                expect(toolCalls.length).toBeGreaterThanOrEqual(1);
            } finally {
                nockDone();
            }
        });
    });

});
