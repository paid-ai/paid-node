/**
 * Auto-instrumentation tests for Google GenAI (@google/genai).
 *
 * Tests that auto-instrumentation correctly captures spans and attributes
 * when making SDK calls to Google GenAI (Gemini).
 *
 * Uses nock.back to record/replay HTTP interactions (similar to pytest-vcr).
 *
 * Recording cassettes:
 *   GOOGLE_API_KEY=... NOCK_BACK_MODE=record pnpm test -- google-genai
 *
 * Running with recorded cassettes (default):
 *   pnpm test -- google-genai
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
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
const HEADERS_TO_REDACT = ["x-goog-api-key", "authorization", "set-cookie"];

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

// Store patched GoogleGenAI class for reuse in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PatchedGoogleGenAI: any;

describe("Google GenAI Auto-Instrumentation", () => {
    beforeAll(async () => {
        // Set up test infrastructure once
        testExporter = new InMemorySpanExporter();
        testProvider = new NodeTracerProvider({
            resource: resourceFromAttributes({ "api.key": "test-key" }),
            spanProcessors: [new PaidSpanProcessor(), new AISDKSpanProcessor(), new SimpleSpanProcessor(testExporter)],
        });
        testProvider.register();

        // Initialize Google GenAI instrumentation
        const { GoogleGenAIInstrumentation } = await import("openinference-instrumentation-google-genai");
        const googleGenaiInstrumentation = new GoogleGenAIInstrumentation({ tracerProvider: testProvider });

        // Import and manually instrument the @google/genai module using require (CommonJS)
        // ESM module exports are read-only, so we use require for patching
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const googleGenAI = require("@google/genai");
        googleGenaiInstrumentation.manuallyInstrument(googleGenAI);
        PatchedGoogleGenAI = googleGenAI.GoogleGenAI;
    });

    afterAll(async () => {
        nock.restore();
        nock.cleanAll();
        await testProvider?.shutdown();
    });

    beforeEach(() => {
        testExporter.reset();
    });

    describe("Generate Content", () => {
        it("should create span for generateContent with context attributes", async () => {
            const cassetteName = getCassetteName("google_genai_generate_content");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const GoogleGenAI = PatchedGoogleGenAI;
                const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-google-genai" }, async () => {
                    const response = await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: "Say hello in exactly 3 words.",
                    });

                    expect(response.text).toBeTruthy();
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("generate"));
                expect(llmSpan).toBeDefined();
                expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-google-genai");
            } finally {
                nockDone();
            }
        });

        it("should create span for streaming generateContentStream", async () => {
            const cassetteName = getCassetteName("google_genai_generate_content_stream");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const GoogleGenAI = PatchedGoogleGenAI;
                const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-google-stream" }, async () => {
                    const response = await ai.models.generateContentStream({
                        model: "gemini-2.0-flash",
                        contents: "Say hello",
                    });

                    let fullContent = "";
                    for await (const chunk of response) {
                        if (chunk.text) {
                            fullContent += chunk.text;
                        }
                    }

                    expect(fullContent.length).toBeGreaterThan(0);
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThan(0);

                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("generate"));
                expect(llmSpan).toBeDefined();
                expect(llmSpan?.attributes["external_customer_id"]).toBe("cust-google-stream");
            } finally {
                nockDone();
            }
        });

        it("should capture token usage attributes", async () => {
            const cassetteName = getCassetteName("google_genai_token_usage");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const GoogleGenAI = PatchedGoogleGenAI;
                const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-google-tokens" }, async () => {
                    await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: "Hello",
                    });
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("generate"));
                expect(llmSpan).toBeDefined();

                const attrs = llmSpan?.attributes || {};
                const hasTokenAttrs = Object.keys(attrs).some((key) => key.includes("token") || key.includes("usage"));
                expect(hasTokenAttrs).toBe(true);
            } finally {
                nockDone();
            }
        });

        it("should capture model name in span attributes", async () => {
            const cassetteName = getCassetteName("google_genai_model_name");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const GoogleGenAI = PatchedGoogleGenAI;
                const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-google-model" }, async () => {
                    await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: "Hello",
                    });
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("generate"));
                expect(llmSpan).toBeDefined();

                const attrs = llmSpan?.attributes || {};
                const hasModelAttr = Object.keys(attrs).some(
                    (key) => (key.includes("model") && typeof attrs[key] === "string" && attrs[key].includes("gemini"))
                );
                expect(hasModelAttr).toBe(true);
            } finally {
                nockDone();
            }
        });
    });

    describe("Prompt Filtering", () => {
        it("should filter prompt content when storePrompt is false", async () => {
            const cassetteName = getCassetteName("google_genai_prompt_filtered");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const GoogleGenAI = PatchedGoogleGenAI;
                const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-google-filtered", storePrompt: false }, async () => {
                    await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: "Secret message that should not be stored",
                    });
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("generate"));
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
            const cassetteName = getCassetteName("google_genai_prompt_stored");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const GoogleGenAI = PatchedGoogleGenAI;
                const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-google-stored", storePrompt: true }, async () => {
                    await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: "Hello",
                    });
                });

                const spans = testExporter.getFinishedSpans();
                const llmSpan = spans.find((s) => s.name.toLowerCase().includes("generate"));
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
    });

    describe("Multi-Provider Context", () => {
        it("should work alongside other providers in same trace context", async () => {
            const cassetteName = getCassetteName("google_genai_multi_provider");
            const { nockDone } = await nock.back(cassetteName, nockBackOptions);

            try {
                const GoogleGenAI = PatchedGoogleGenAI;
                const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || "test-key" });

                await runWithTracingContext({ externalCustomerId: "cust-google-multi" }, async () => {
                    const response1 = await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: "First call",
                    });
                    expect(response1.text).toBeTruthy();

                    const response2 = await ai.models.generateContent({
                        model: "gemini-2.0-flash",
                        contents: "Second call",
                    });
                    expect(response2.text).toBeTruthy();
                });

                const spans = testExporter.getFinishedSpans();
                expect(spans.length).toBeGreaterThanOrEqual(2);

                for (const span of spans) {
                    expect(span.attributes["external_customer_id"]).toBe("cust-google-multi");
                }
            } finally {
                nockDone();
            }
        });
    });
});
