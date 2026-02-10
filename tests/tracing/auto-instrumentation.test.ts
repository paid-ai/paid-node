/**
 * Auto instrumentation tests.
 * Tests paidAutoInstrument() function and instrumentation behavior.
 * Modeled after Python SDK's test_anthropic_autoinstrumentation.py
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("Auto Instrumentation", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        // Set up environment for tracing
        process.env.PAID_API_KEY = "test-api-key";
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    describe("paidAutoInstrument initialization", () => {
        it("should initialize without errors when tracing is set up", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            // Initialize tracing first
            initializeTracing("test-api-key");

            // Auto instrument should not throw
            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should not throw when called without prior initializeTracing", async () => {
            vi.resetModules();
            process.env.PAID_API_KEY = "test-api-key";

            const { paidAutoInstrument } = await import("../../src/tracing/index.js");

            // Should call initializeTracing internally and not throw
            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should handle missing API key gracefully", async () => {
            vi.resetModules();
            delete process.env.PAID_API_KEY;

            const { paidAutoInstrument } = await import("../../src/tracing/index.js");

            // Should not throw, just log error
            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should prevent re-initialization", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            // First call should initialize
            await paidAutoInstrument();

            // Second call should be no-op (not throw)
            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });
    });

    describe("Manual instrumentation", () => {
        it("should accept empty libraries object", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            // Empty object means auto-detect libraries
            await expect(paidAutoInstrument({})).resolves.not.toThrow();
        });

        it("should handle undefined libraries parameter", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            // Undefined means auto-detect
            await expect(paidAutoInstrument(undefined)).resolves.not.toThrow();
        });
    });

    describe("Instrumentation availability", () => {
        it("should gracefully handle when OpenAI instrumentation is not available", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            // This should not throw even if OpenAI package is not fully installed
            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should gracefully handle when Anthropic instrumentation is not available", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            // This should not throw even if Anthropic package is not fully installed
            await expect(paidAutoInstrument()).resolves.not.toThrow();
        });

        it("should gracefully handle when Bedrock instrumentation is not available", async () => {
            const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

            initializeTracing("test-api-key");

            // This should not throw even if Bedrock package is not installed
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

        // Create a mock OpenAI class
        const mockOpenAI = class OpenAI {
            constructor() {}
        };

        // Should accept the mock library
        await expect(
            paidAutoInstrument({ openai: mockOpenAI as any })
        ).resolves.not.toThrow();
    });

    it("should accept Anthropic library for manual instrumentation", async () => {
        const { initializeTracing, paidAutoInstrument } = await import("../../src/tracing/index.js");

        initializeTracing("test-api-key");

        // Create a mock Anthropic class
        const mockAnthropic = class Anthropic {
            constructor() {}
        };

        // Should accept the mock library
        await expect(
            paidAutoInstrument({ anthropic: mockAnthropic as any })
        ).resolves.not.toThrow();
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
