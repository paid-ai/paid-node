/**
 * Signal functionality tests.
 *
 * Tests the signal() function for capturing custom events within trace contexts.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SpanStatusCode } from "@opentelemetry/api";
import { PaidSpanProcessor } from "../../src/tracing/spanProcessor";
import { runWithTracingContext } from "../../src/tracing/tracingContext";

describe("Signal Function", () => {
    let exporter: InMemorySpanExporter;
    let provider: NodeTracerProvider;

    beforeEach(() => {
        exporter = new InMemorySpanExporter();
        provider = new NodeTracerProvider({
            resource: resourceFromAttributes({ "api.key": "test-key" }),
            spanProcessors: [new PaidSpanProcessor(), new SimpleSpanProcessor(exporter)],
        });
        provider.register();
    });

    afterEach(async () => {
        await provider.shutdown();
        exporter.reset();
    });

    describe("Basic Signal Creation", () => {
        it("should create a signal span with event_name", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust-123", externalProductId: "prod-456" },
                async () => {
                    const tracer = provider.getTracer("test");
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "user_signed_up");
                        span.setStatus({ code: SpanStatusCode.OK });
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans.find((s) => s.name.includes("signal"));

            expect(signalSpan).toBeDefined();
            expect(signalSpan?.attributes["event_name"]).toBe("user_signed_up");
            expect(signalSpan?.status.code).toBe(SpanStatusCode.OK);
        });

        it("should propagate context attributes to signal span", async () => {
            await runWithTracingContext(
                { externalCustomerId: "signal-cust", externalProductId: "signal-prod" },
                async () => {
                    const tracer = provider.getTracer("test");
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "test_event");
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpan = spans[0];

            expect(signalSpan.attributes["external_customer_id"]).toBe("signal-cust");
            expect(signalSpan.attributes["external_agent_id"]).toBe("signal-prod");
        });
    });

    describe("Cost Tracing", () => {
        it("should include enable_cost_tracing attribute when enabled", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "llm_call");
                        span.setAttribute("enable_cost_tracing", true);
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            expect(spans[0].attributes["enable_cost_tracing"]).toBe(true);
        });

        it("should include cost tracing in data when enabled", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "llm_inference");
                        span.setAttribute("enable_cost_tracing", true);
                        span.setAttribute("data", JSON.stringify({ paid: { enable_cost_tracing: true } }));
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            const dataAttr = spans[0].attributes["data"] as string;
            const data = JSON.parse(dataAttr);

            expect(data.paid.enable_cost_tracing).toBe(true);
        });

        it("should not include enable_cost_tracing when disabled", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "simple_event");
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            expect(spans[0].attributes["enable_cost_tracing"]).toBeUndefined();
        });
    });

    describe("Custom Data", () => {
        it("should include custom data as JSON string", async () => {
            const customData = {
                user_tier: "premium",
                request_count: 42,
                features: ["feature_a", "feature_b"],
            };

            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "feature_usage");
                        span.setAttribute("data", JSON.stringify(customData));
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            const dataAttr = spans[0].attributes["data"] as string;
            const parsedData = JSON.parse(dataAttr);

            expect(parsedData.user_tier).toBe("premium");
            expect(parsedData.request_count).toBe(42);
            expect(parsedData.features).toEqual(["feature_a", "feature_b"]);
        });

        it("should handle nested data objects", async () => {
            const nestedData = {
                metadata: {
                    source: "api",
                    version: "1.0",
                    nested: {
                        deep: "value",
                    },
                },
            };

            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "nested_event");
                        span.setAttribute("data", JSON.stringify(nestedData));
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            const dataAttr = spans[0].attributes["data"] as string;
            const parsedData = JSON.parse(dataAttr);

            expect(parsedData.metadata.source).toBe("api");
            expect(parsedData.metadata.nested.deep).toBe("value");
        });

        it("should merge paid cost tracing with existing data", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "llm_call");
                        span.setAttribute("enable_cost_tracing", true);
                        span.setAttribute(
                            "data",
                            JSON.stringify({
                                custom_field: "value",
                                paid: { enable_cost_tracing: true },
                            })
                        );
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            const dataAttr = spans[0].attributes["data"] as string;
            const parsedData = JSON.parse(dataAttr);

            expect(parsedData.custom_field).toBe("value");
            expect(parsedData.paid.enable_cost_tracing).toBe(true);
        });
    });

    describe("Multiple Signals", () => {
        it("should create multiple signal spans in same context", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");

                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "step_1");
                        span.end();
                    });

                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "step_2");
                        span.end();
                    });

                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "step_3");
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            const signalSpans = spans.filter((s) => s.name.includes("signal"));

            expect(signalSpans.length).toBe(3);

            const eventNames = signalSpans.map((s) => s.attributes["event_name"]);
            expect(eventNames).toContain("step_1");
            expect(eventNames).toContain("step_2");
            expect(eventNames).toContain("step_3");
        });

        it("should maintain context for all signals", async () => {
            await runWithTracingContext(
                { externalCustomerId: "multi-signal-cust", externalProductId: "multi-signal-prod" },
                async () => {
                    const tracer = provider.getTracer("test");

                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "event_a");
                        span.end();
                    });

                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "event_b");
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();

            for (const span of spans) {
                expect(span.attributes["external_customer_id"]).toBe("multi-signal-cust");
                expect(span.attributes["external_agent_id"]).toBe("multi-signal-prod");
            }
        });
    });

    describe("Signal with LLM Spans", () => {
        it("should coexist with LLM spans in same context", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");

                    // LLM span
                    tracer.startActiveSpan("openai.chat.completions.create", (span) => {
                        span.setAttributes({
                            "llm.model_name": "gpt-4",
                            "llm.provider": "openai",
                            "llm.token_count.prompt": 100,
                            "llm.token_count.completion": 50,
                        });
                        span.end();
                    });

                    // Signal span with cost tracing
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "chat_completed");
                        span.setAttribute("enable_cost_tracing", true);
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            expect(spans.length).toBe(2);

            const llmSpan = spans.find((s) => s.name.includes("openai"));
            const signalSpan = spans.find((s) => s.name.includes("signal"));

            expect(llmSpan).toBeDefined();
            expect(signalSpan).toBeDefined();
            expect(llmSpan?.attributes["llm.model_name"]).toBe("gpt-4");
            expect(signalSpan?.attributes["event_name"]).toBe("chat_completed");
        });
    });

    describe("Error Handling", () => {
        it("should handle signal with ERROR status", async () => {
            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");
                    tracer.startActiveSpan("signal", (span) => {
                        span.setAttribute("event_name", "failed_event");
                        span.setStatus({
                            code: SpanStatusCode.ERROR,
                            message: "Signal processing failed",
                        });
                        span.recordException(new Error("Test error"));
                        span.end();
                    });
                }
            );

            const spans = exporter.getFinishedSpans();
            expect(spans[0].status.code).toBe(SpanStatusCode.ERROR);
            expect(spans[0].status.message).toBe("Signal processing failed");
        });
    });

    describe("Event Name Patterns", () => {
        it("should handle various event name formats", async () => {
            const eventNames = [
                "simple_event",
                "event.with.dots",
                "event-with-dashes",
                "CamelCaseEvent",
                "event123",
                "event_with_numbers_123",
            ];

            await runWithTracingContext(
                { externalCustomerId: "cust", externalProductId: "prod" },
                async () => {
                    const tracer = provider.getTracer("test");

                    for (const eventName of eventNames) {
                        tracer.startActiveSpan("signal", (span) => {
                            span.setAttribute("event_name", eventName);
                            span.end();
                        });
                    }
                }
            );

            const spans = exporter.getFinishedSpans();
            const capturedEventNames = spans.map((s) => s.attributes["event_name"]);

            for (const eventName of eventNames) {
                expect(capturedEventNames).toContain(eventName);
            }
        });
    });
});
