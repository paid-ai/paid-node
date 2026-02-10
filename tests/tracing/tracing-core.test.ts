/**
 * Core tracing functionality tests.
 * Tests initializeTracing(), trace(), and basic span behavior.
 * Modeled after Python SDK's test_tracing_core.py
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import {
    TEST_PAID_API_KEY,
    TEST_EXTERNAL_CUSTOMER_ID,
    TEST_EXTERNAL_PRODUCT_ID,
} from "./constants";

describe("Tracing Core", () => {
    describe("initializeTracing", () => {
        let originalEnv: NodeJS.ProcessEnv;

        beforeEach(() => {
            originalEnv = { ...process.env };
            delete process.env.PAID_API_KEY;
            delete process.env.PAID_ENABLED;
            delete process.env.PAID_OTEL_COLLECTOR_ENDPOINT;
        });

        afterEach(() => {
            process.env = originalEnv;
            vi.resetModules();
        });

        it("should not initialize when PAID_ENABLED is false", async () => {
            process.env.PAID_ENABLED = "false";
            process.env.PAID_API_KEY = TEST_PAID_API_KEY;

            const { initializeTracing, getPaidTracerProvider } = await import("../../src/tracing/tracing.js");
            initializeTracing();

            expect(getPaidTracerProvider()).toBeUndefined();
        });

        it("should not initialize without API key", async () => {
            const { initializeTracing, getPaidTracerProvider } = await import("../../src/tracing/tracing.js");
            initializeTracing();

            expect(getPaidTracerProvider()).toBeUndefined();
        });

        it("should initialize with explicit API key", async () => {
            const { initializeTracing, getPaidTracerProvider, getToken } = await import("../../src/tracing/tracing.js");
            initializeTracing(TEST_PAID_API_KEY);

            expect(getPaidTracerProvider()).toBeInstanceOf(NodeTracerProvider);
            expect(getToken()).toBe(TEST_PAID_API_KEY);
        });

        it("should initialize from PAID_API_KEY env var", async () => {
            process.env.PAID_API_KEY = "from-env-var";

            const { initializeTracing, getPaidTracerProvider, getToken } = await import("../../src/tracing/tracing.js");
            initializeTracing();

            expect(getPaidTracerProvider()).toBeInstanceOf(NodeTracerProvider);
            expect(getToken()).toBe("from-env-var");
        });

        it("should prevent re-initialization", async () => {
            process.env.PAID_API_KEY = TEST_PAID_API_KEY;

            const { initializeTracing, getPaidTracerProvider } = await import("../../src/tracing/tracing.js");
            initializeTracing();
            const firstProvider = getPaidTracerProvider();

            initializeTracing();
            expect(getPaidTracerProvider()).toBe(firstProvider);
        });

        it("should use custom collector endpoint", async () => {
            const customEndpoint = "https://custom-collector.example.com/v1/traces";
            process.env.PAID_API_KEY = TEST_PAID_API_KEY;

            const { initializeTracing, getPaidTracerProvider } = await import("../../src/tracing/tracing.js");
            initializeTracing(undefined, customEndpoint);

            expect(getPaidTracerProvider()).toBeInstanceOf(NodeTracerProvider);
        });
    });

    describe("trace function", () => {
        beforeEach(async () => {
            process.env.PAID_API_KEY = TEST_PAID_API_KEY;
        });

        afterEach(() => {
            vi.resetModules();
            delete process.env.PAID_API_KEY;
        });

        it("should execute function and return result", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            initializeTracing(TEST_PAID_API_KEY);

            const result = await trace(
                { externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID },
                async () => "hello world"
            );

            expect(result).toBe("hello world");
        });

        it("should execute function with arguments", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            initializeTracing(TEST_PAID_API_KEY);

            const add = async (a: number, b: number) => a + b;
            const result = await trace(
                { externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID },
                add,
                5,
                3
            );

            expect(result).toBe(8);
        });

        it("should propagate exception", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            initializeTracing(TEST_PAID_API_KEY);

            const error = new Error("test error");
            await expect(
                trace(
                    { externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID },
                    async () => {
                        throw error;
                    }
                )
            ).rejects.toThrow("test error");
        });

        it("should not crash when tracing is not initialized", async () => {
            vi.resetModules();
            const { trace } = await import("../../src/tracing/tracing.js");

            const result = await trace(
                { externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID },
                async () => "fallback result"
            );

            expect(result).toBe("fallback result");
        });

        it("should accept externalProductId option", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            initializeTracing(TEST_PAID_API_KEY);

            const result = await trace(
                {
                    externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID,
                    externalProductId: TEST_EXTERNAL_PRODUCT_ID,
                },
                async () => "with product"
            );

            expect(result).toBe("with product");
        });
    });

    describe("trace context propagation", () => {
        beforeEach(() => {
            process.env.PAID_API_KEY = TEST_PAID_API_KEY;
        });

        afterEach(() => {
            vi.resetModules();
            delete process.env.PAID_API_KEY;
        });

        it("should propagate context to nested async operations", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            const { getTracingContext } = await import("../../src/tracing/tracingContext.js");
            initializeTracing(TEST_PAID_API_KEY);

            let capturedContext: any = null;

            await trace(
                {
                    externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID,
                    externalProductId: TEST_EXTERNAL_PRODUCT_ID,
                    storePrompt: true,
                    metadata: { key: "value" },
                },
                async () => {
                    capturedContext = getTracingContext();
                    return "done";
                }
            );

            expect(capturedContext).not.toBeNull();
            expect(capturedContext.externalCustomerId).toBe(TEST_EXTERNAL_CUSTOMER_ID);
            expect(capturedContext.externalProductId).toBe(TEST_EXTERNAL_PRODUCT_ID);
            expect(capturedContext.storePrompt).toBe(true);
            expect(capturedContext.metadata).toEqual({ key: "value" });
        });

        it("should isolate context between concurrent traces", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            const { getTracingContext } = await import("../../src/tracing/tracingContext.js");
            initializeTracing(TEST_PAID_API_KEY);

            const contexts: any[] = [];

            await Promise.all([
                trace(
                    { externalCustomerId: "customer-1" },
                    async () => {
                        await new Promise((r) => setTimeout(r, 10));
                        contexts.push({ id: 1, ctx: getTracingContext() });
                    }
                ),
                trace(
                    { externalCustomerId: "customer-2" },
                    async () => {
                        contexts.push({ id: 2, ctx: getTracingContext() });
                    }
                ),
            ]);

            const ctx1 = contexts.find((c) => c.id === 1)?.ctx;
            const ctx2 = contexts.find((c) => c.id === 2)?.ctx;

            expect(ctx1?.externalCustomerId).toBe("customer-1");
            expect(ctx2?.externalCustomerId).toBe("customer-2");
        });

        it("should reset context after trace completes", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            const { getTracingContext } = await import("../../src/tracing/tracingContext.js");
            initializeTracing(TEST_PAID_API_KEY);

            await trace(
                { externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID },
                async () => "done"
            );

            const contextAfter = getTracingContext();
            expect(contextAfter.externalCustomerId).toBeUndefined();
        });
    });
});
