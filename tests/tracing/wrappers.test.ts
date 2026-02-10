/**
 * Wrapper tests for PaidOpenAI, PaidAnthropic.
 * Tests the LLM client wrappers that add tracing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { TEST_PAID_API_KEY, TEST_EXTERNAL_CUSTOMER_ID, TEST_EXTERNAL_PRODUCT_ID } from "./constants";

describe("PaidOpenAI Wrapper", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = TEST_PAID_API_KEY;
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    describe("Constructor", () => {
        it("should throw when tracer is not initialized", async () => {
            vi.resetModules();
            delete process.env.PAID_API_KEY;

            const { PaidOpenAI } = await import("../../src/tracing/wrappers/openAiWrapper.js");

            const mockOpenAI = {};
            expect(() => new PaidOpenAI(mockOpenAI)).toThrow("Paid tracer is not initialized");
        });

        it("should create wrapper when tracer is initialized", async () => {
            const { initializeTracing } = await import("../../src/tracing/tracing.js");
            const { PaidOpenAI } = await import("../../src/tracing/wrappers/openAiWrapper.js");

            initializeTracing(TEST_PAID_API_KEY);

            const mockOpenAI = {
                chat: { completions: { create: vi.fn() } },
                embeddings: { create: vi.fn() },
                images: { generate: vi.fn() },
            };

            const wrapper = new PaidOpenAI(mockOpenAI);
            expect(wrapper).toBeDefined();
        });
    });
});

describe("PaidAnthropic Wrapper", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = TEST_PAID_API_KEY;
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    describe("Constructor", () => {
        it("should throw when tracer is not initialized", async () => {
            vi.resetModules();
            delete process.env.PAID_API_KEY;

            const { PaidAnthropic } = await import("../../src/tracing/wrappers/anthropicWrapper.js");

            const mockAnthropic = {};
            expect(() => new PaidAnthropic(mockAnthropic as any)).toThrow("Paid tracer is not initialized");
        });
    });
});
