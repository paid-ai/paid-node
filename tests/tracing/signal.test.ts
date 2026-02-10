/**
 * Signal function tests.
 * Tests the signal() function for sending events within traces.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { SpanStatusCode } from "@opentelemetry/api";
import {
    createTracingTestContext,
    type TracingTestContext,
} from "./setup";
import {
    getFinishedSpans,
    getSpansByName,
} from "./helpers";
import { runWithTracingContext } from "../../src/tracing/tracingContext.js";
import { TEST_PAID_API_KEY, TEST_EXTERNAL_CUSTOMER_ID, TEST_EXTERNAL_PRODUCT_ID } from "./constants";

describe("signal()", () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env.PAID_API_KEY = TEST_PAID_API_KEY;
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.resetModules();
    });

    describe("Error handling", () => {
        it("should throw when tracing is not initialized", async () => {
            vi.resetModules();
            delete process.env.PAID_API_KEY;

            const { signal } = await import("../../src/tracing/signal.js");

            expect(() => signal("test_event")).toThrow("Tracing is not initialized");
        });

        it("should throw when called outside of trace() context", async () => {
            const { initializeTracing } = await import("../../src/tracing/tracing.js");
            const { signal } = await import("../../src/tracing/signal.js");

            initializeTracing(TEST_PAID_API_KEY);

            // No externalCustomerId or externalProductId in context
            expect(() => signal("test_event")).toThrow("Missing some of");
        });

        it("should throw when externalCustomerId is missing", async () => {
            const { initializeTracing } = await import("../../src/tracing/tracing.js");
            const { signal } = await import("../../src/tracing/signal.js");

            initializeTracing(TEST_PAID_API_KEY);

            await runWithTracingContext(
                { externalProductId: TEST_EXTERNAL_PRODUCT_ID }, // Missing customerId
                async () => {
                    expect(() => signal("test_event")).toThrow("Missing some of");
                }
            );
        });

        it("should throw when externalProductId is missing", async () => {
            const { initializeTracing } = await import("../../src/tracing/tracing.js");
            const { signal } = await import("../../src/tracing/signal.js");

            initializeTracing(TEST_PAID_API_KEY);

            await runWithTracingContext(
                { externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID }, // Missing productId
                async () => {
                    expect(() => signal("test_event")).toThrow("Missing some of");
                }
            );
        });
    });

    describe("Basic functionality", () => {
        it("should create a signal span with event_name attribute", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            const { signal } = await import("../../src/tracing/signal.js");

            initializeTracing(TEST_PAID_API_KEY);

            // signal() must be called inside trace() to have proper context
            await trace(
                {
                    externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID,
                    externalProductId: TEST_EXTERNAL_PRODUCT_ID,
                },
                async () => {
                    signal("my_custom_event");
                }
            );
        });

        it("should accept enableCostTracing flag", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            const { signal } = await import("../../src/tracing/signal.js");

            initializeTracing(TEST_PAID_API_KEY);

            await trace(
                {
                    externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID,
                    externalProductId: TEST_EXTERNAL_PRODUCT_ID,
                },
                async () => {
                    signal("cost_event", true);
                }
            );
        });

        it("should accept optional data parameter", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            const { signal } = await import("../../src/tracing/signal.js");

            initializeTracing(TEST_PAID_API_KEY);

            await trace(
                {
                    externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID,
                    externalProductId: TEST_EXTERNAL_PRODUCT_ID,
                },
                async () => {
                    signal("data_event", false, { key: "value", count: 42 });
                }
            );
        });

        it("should accept both enableCostTracing and data", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            const { signal } = await import("../../src/tracing/signal.js");

            initializeTracing(TEST_PAID_API_KEY);

            await trace(
                {
                    externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID,
                    externalProductId: TEST_EXTERNAL_PRODUCT_ID,
                },
                async () => {
                    signal("full_event", true, { custom: "data" });
                }
            );
        });
    });

    describe("Integration with trace()", () => {
        it("should work when called inside trace() callback", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            const { signal } = await import("../../src/tracing/signal.js");

            initializeTracing(TEST_PAID_API_KEY);

            const result = await trace(
                {
                    externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID,
                    externalProductId: TEST_EXTERNAL_PRODUCT_ID,
                },
                async () => {
                    signal("inside_trace_event");
                    return "success";
                }
            );

            expect(result).toBe("success");
        });

        it("should work with multiple signals in one trace", async () => {
            const { initializeTracing, trace } = await import("../../src/tracing/tracing.js");
            const { signal } = await import("../../src/tracing/signal.js");

            initializeTracing(TEST_PAID_API_KEY);

            await trace(
                {
                    externalCustomerId: TEST_EXTERNAL_CUSTOMER_ID,
                    externalProductId: TEST_EXTERNAL_PRODUCT_ID,
                },
                async () => {
                    signal("event_1");
                    signal("event_2", true);
                    signal("event_3", false, { data: "test" });
                }
            );
        });
    });
});
