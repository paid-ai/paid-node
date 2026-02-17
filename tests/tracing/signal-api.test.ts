/**
 * Tests for the exported signal() function's public API.
 *
 * These tests verify the actual signal() function behavior including:
 * - Error handling when not in trace context
 * - enableCostTracing data merging logic
 * - Validation of required context
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SpanStatusCode } from "@opentelemetry/api";
import { PaidSpanProcessor } from "../../src/tracing/spanProcessor";
import { AISDKSpanProcessor } from "../../src/tracing/aiSdkSpanProcessor";

// Import the modules we need to spy on
import * as tracingModule from "../../src/tracing/tracing";
import { signal } from "../../src/tracing/signal";
import { runWithTracingContext } from "../../src/tracing/tracingContext";

describe("signal() function API", () => {
    let exporter: InMemorySpanExporter;
    let provider: NodeTracerProvider;

    beforeEach(() => {
        exporter = new InMemorySpanExporter();
        provider = new NodeTracerProvider({
            resource: resourceFromAttributes({ "api.key": "test-key" }),
            spanProcessors: [
                new PaidSpanProcessor(),
                new AISDKSpanProcessor(),
                new SimpleSpanProcessor(exporter),
            ],
        });
        provider.register();

        // Spy on the getter functions to return our test provider/tracer
        vi.spyOn(tracingModule, "getToken").mockReturnValue("test-api-key");
        vi.spyOn(tracingModule, "getPaidTracer").mockReturnValue(provider.getTracer("paid.node"));
    });

    afterEach(async () => {
        vi.restoreAllMocks();
        await provider.shutdown();
        exporter.reset();
    });

    describe("error handling", () => {
        it("should throw error when tracing is not initialized", () => {
            // Mock getToken to return undefined (not initialized)
            vi.spyOn(tracingModule, "getToken").mockReturnValue(undefined);

            expect(() => signal("test_event")).toThrow(/Tracing is not initialized/);
        });

        it("should throw error when getPaidTracer returns undefined", () => {
            vi.spyOn(tracingModule, "getPaidTracer").mockReturnValue(undefined);

            expect(() => signal("test_event")).toThrow(/Tracing is not initialized/);
        });

        it("should throw error when called outside of trace context (missing externalCustomerId)", async () => {
            // signal() requires being inside trace() context with externalCustomerId and externalProductId
            expect(() => signal("test_event")).toThrow(/Missing some of/);
        });

        it("should throw error when externalProductId is missing", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust-only" }, // missing externalProductId
                async () => {
                    expect(() => signal("test_event")).toThrow(/Missing some of/);
                }
            );
        });
    });

    describe("successful signal creation", () => {
        it("should create signal span with event_name attribute", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust-123", externalProductId: "prod-456" },
                async () => {
                    signal("user_signed_up");
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));

            expect(signalSpan).toBeDefined();
            expect(signalSpan?.attributes["event_name"]).toBe("user_signed_up");
            expect(signalSpan?.status.code).toBe(SpanStatusCode.OK);
        });

        it("should include context attributes from trace context", async () => {
            await runWithTracingContext(
                { externalCustomerId: "signal-cust", externalProductId: "signal-prod" },
                async () => {
                    signal("test_event");
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));

            expect(signalSpan?.attributes["external_customer_id"]).toBe("signal-cust");
            expect(signalSpan?.attributes["external_agent_id"]).toBe("signal-prod");
        });
    });

    describe("enableCostTracing behavior", () => {
        it("should set enable_cost_tracing attribute when true", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    signal("llm_call", true);
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));

            expect(signalSpan?.attributes["enable_cost_tracing"]).toBe(true);
        });

        it("should auto-add paid.enable_cost_tracing to data when enableCostTracing is true and no data provided", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    signal("llm_inference", true); // no data argument
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));
            const dataAttr = signalSpan?.attributes["data"] as string;
            const data = JSON.parse(dataAttr);

            expect(data.paid).toBeDefined();
            expect(data.paid.enable_cost_tracing).toBe(true);
        });

        it("should merge paid.enable_cost_tracing into existing data when enableCostTracing is true", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    signal("llm_call", true, { model: "gpt-4", custom_field: "value" });
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));
            const dataAttr = signalSpan?.attributes["data"] as string;
            const data = JSON.parse(dataAttr);

            // Original data preserved
            expect(data.model).toBe("gpt-4");
            expect(data.custom_field).toBe("value");
            // paid.enable_cost_tracing merged in
            expect(data.paid).toBeDefined();
            expect(data.paid.enable_cost_tracing).toBe(true);
        });

        it("should not set enable_cost_tracing when false", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    signal("simple_event", false);
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));

            expect(signalSpan?.attributes["enable_cost_tracing"]).toBeUndefined();
        });

        it("should not add paid object to data when enableCostTracing is false", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    signal("event", false, { custom: "data" });
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));
            const dataAttr = signalSpan?.attributes["data"] as string;
            const data = JSON.parse(dataAttr);

            expect(data.custom).toBe("data");
            expect(data.paid).toBeUndefined();
        });
    });

    describe("custom data handling", () => {
        it("should include custom data as JSON string", async () => {
            const customData = {
                user_tier: "premium",
                request_count: 42,
                features: ["feature_a", "feature_b"],
            };

            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    signal("feature_usage", false, customData);
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));
            const dataAttr = signalSpan?.attributes["data"] as string;
            const parsedData = JSON.parse(dataAttr);

            expect(parsedData.user_tier).toBe("premium");
            expect(parsedData.request_count).toBe(42);
            expect(parsedData.features).toEqual(["feature_a", "feature_b"]);
        });

        it("should handle nested data objects", async () => {
            const nestedData = {
                metadata: {
                    source: "api",
                    nested: { deep: "value" },
                },
            };

            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    signal("nested_event", false, nestedData);
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));
            const dataAttr = signalSpan?.attributes["data"] as string;
            const parsedData = JSON.parse(dataAttr);

            expect(parsedData.metadata.source).toBe("api");
            expect(parsedData.metadata.nested.deep).toBe("value");
        });

        it("should not include data attribute when no data provided and enableCostTracing is false", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    signal("simple_event"); // no data, enableCostTracing defaults to false
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));

            expect(signalSpan?.attributes["data"]).toBeUndefined();
        });
    });

    describe("multiple signals", () => {
        it("should create multiple signal spans in the same context", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    signal("step_1", false, { step: 1 });
                    signal("step_2", false, { step: 2 });
                    signal("step_3", true, { step: 3 });
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpans = spans.filter((s) => s.name.includes("signal"));

            expect(signalSpans.length).toBe(3);

            const eventNames = signalSpans.map((s) => s.attributes["event_name"]);
            expect(eventNames).toContain("step_1");
            expect(eventNames).toContain("step_2");
            expect(eventNames).toContain("step_3");

            // Only step_3 should have cost tracing enabled
            const step3Span = signalSpans.find((s) => s.attributes["event_name"] === "step_3");
            expect(step3Span?.attributes["enable_cost_tracing"]).toBe(true);
        });

        it("should maintain context for all signals", async () => {
            await runWithTracingContext(
                { externalCustomerId: "multi-cust", externalProductId: "multi-prod" },
                async () => {
                    signal("event_a");
                    signal("event_b");
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpans = spans.filter((s) => s.name.includes("signal"));

            for (const span of signalSpans) {
                expect(span.attributes["external_customer_id"]).toBe("multi-cust");
                expect(span.attributes["external_agent_id"]).toBe("multi-prod");
            }
        });
    });
});
