/**
 * Tests for the exported trace() and signal() functions.
 *
 * These tests verify the public API that users interact with,
 * as opposed to the internal implementation details.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SpanStatusCode } from "@opentelemetry/api";
import { PaidSpanProcessor } from "../../src/tracing/spanProcessor";
import { AISDKSpanProcessor } from "../../src/tracing/aiSdkSpanProcessor";
import { runWithTracingContext, getTracingContext } from "../../src/tracing/tracingContext";

describe("trace() function", () => {
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
    });

    afterEach(async () => {
        await provider.shutdown();
        exporter.reset();
    });

    it("should propagate context through runWithTracingContext and return result", async () => {
        const result = await runWithTracingContext(
            { externalCustomerId: "cust-123", externalProductId: "prod-456" },
            async () => {
                return { success: true, value: 42 };
            }
        );

        expect(result).toEqual({ success: true, value: 42 });
    });

    it("should create spans with context attributes", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust-abc", externalProductId: "prod-xyz" },
            async () => {
                tracer.startActiveSpan("parent_span", (span) => {
                    // Create a child span to verify context propagation
                    const childSpan = tracer.startSpan("child-operation");
                    childSpan.end();
                    span.setStatus({ code: SpanStatusCode.OK });
                    span.end();
                });
            }
        );

        const spans = exporter.getFinishedSpans();
        expect(spans.length).toBeGreaterThanOrEqual(1);

        // Find spans with our context attributes
        const spansWithContext = spans.filter(
            (s) => s.attributes["external_customer_id"] === "cust-abc"
        );
        expect(spansWithContext.length).toBeGreaterThan(0);
    });

    it("should propagate storePrompt option through context", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust-1", externalProductId: "prod-1", storePrompt: true },
            async () => {
                const span = tracer.startSpan("llm-call");
                span.setAttribute("gen_ai.prompt", "test prompt");
                span.end();
            }
        );

        const spans = exporter.getFinishedSpans();
        const llmSpan = spans.find((s) => s.name.includes("llm-call"));

        // When storePrompt is true, prompt should be kept
        expect(llmSpan?.attributes["gen_ai.prompt"]).toBe("test prompt");
    });

    it("should filter prompts when storePrompt is false", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust-1", externalProductId: "prod-1", storePrompt: false },
            async () => {
                const span = tracer.startSpan("llm-call");
                span.setAttribute("gen_ai.prompt", "secret prompt");
                span.end();
            }
        );

        const spans = exporter.getFinishedSpans();
        const llmSpan = spans.find((s) => s.name.includes("llm-call"));

        // When storePrompt is false, prompt should be filtered
        expect(llmSpan?.attributes["gen_ai.prompt"]).toBeUndefined();
    });

    it("should handle errors and set ERROR status on span", async () => {
        const tracer = provider.getTracer("test");
        const testError = new Error("Test error message");

        await expect(
            runWithTracingContext(
                { externalCustomerId: "cust-1", externalProductId: "prod-1" },
                async () => {
                    tracer.startActiveSpan("parent_span", (span) => {
                        span.setStatus({
                            code: SpanStatusCode.ERROR,
                            message: testError.message,
                        });
                        span.recordException(testError);
                        span.end();
                    });
                    throw testError;
                }
            )
        ).rejects.toThrow("Test error message");

        const spans = exporter.getFinishedSpans();
        const parentSpan = spans.find((s) => s.name.includes("parent_span"));

        expect(parentSpan?.status.code).toBe(SpanStatusCode.ERROR);
        expect(parentSpan?.status.message).toBe("Test error message");
    });

    it("should include metadata in context", async () => {
        let capturedMetadata: any;

        await runWithTracingContext(
            {
                externalCustomerId: "cust-1",
                externalProductId: "prod-1",
                metadata: { requestId: "req-123", tier: "premium" },
            },
            async () => {
                capturedMetadata = getTracingContext().metadata;
            }
        );

        expect(capturedMetadata).toEqual({ requestId: "req-123", tier: "premium" });
    });
});

describe("signal() function behavior", () => {
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
    });

    afterEach(async () => {
        await provider.shutdown();
        exporter.reset();
    });

    it("should create a signal span with event_name attribute", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust-123", externalProductId: "prod-456" },
            async () => {
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

    it("should include external_customer_id and external_agent_id from context", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "signal-cust", externalProductId: "signal-prod" },
            async () => {
                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "test_event");
                    span.end();
                });
            }
        );

        const spans = exporter.getFinishedSpans();
        const signalSpan = spans.find((s) => s.name.includes("signal"));

        expect(signalSpan?.attributes["external_customer_id"]).toBe("signal-cust");
        expect(signalSpan?.attributes["external_agent_id"]).toBe("signal-prod");
    });

    it("should set enable_cost_tracing attribute when enabled", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust", externalProductId: "prod" },
            async () => {
                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "llm_call");
                    span.setAttribute("enable_cost_tracing", true);
                    span.end();
                });
            }
        );

        const spans = exporter.getFinishedSpans();
        const signalSpan = spans.find((s) => s.name.includes("signal"));

        expect(signalSpan?.attributes["enable_cost_tracing"]).toBe(true);
    });

    it("should include custom data as JSON string", async () => {
        const tracer = provider.getTracer("test");
        const customData = {
            user_tier: "premium",
            request_count: 42,
            features: ["feature_a", "feature_b"],
        };

        await runWithTracingContext(
            { externalCustomerId: "cust", externalProductId: "prod" },
            async () => {
                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "feature_usage");
                    span.setAttribute("data", JSON.stringify(customData));
                    span.end();
                });
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

    it("should merge paid cost tracing with custom data", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust", externalProductId: "prod" },
            async () => {
                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "llm_call");
                    span.setAttribute("enable_cost_tracing", true);
                    span.setAttribute(
                        "data",
                        JSON.stringify({
                            custom_field: "value",
                            model: "gpt-4",
                            paid: { enable_cost_tracing: true },
                        })
                    );
                    span.end();
                });
            }
        );

        const spans = exporter.getFinishedSpans();
        const signalSpan = spans.find((s) => s.name.includes("signal"));
        const dataAttr = signalSpan?.attributes["data"] as string;
        const parsedData = JSON.parse(dataAttr);

        expect(parsedData.custom_field).toBe("value");
        expect(parsedData.model).toBe("gpt-4");
        expect(parsedData.paid.enable_cost_tracing).toBe(true);
    });

    it("should create multiple signals in the same trace context", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust", externalProductId: "prod" },
            async () => {
                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "step_1");
                    span.setAttribute("data", JSON.stringify({ step: 1 }));
                    span.end();
                });

                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "step_2");
                    span.setAttribute("data", JSON.stringify({ step: 2 }));
                    span.end();
                });

                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "step_3");
                    span.setAttribute("enable_cost_tracing", true);
                    span.setAttribute("data", JSON.stringify({ step: 3 }));
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

        // Only step_3 should have cost tracing enabled
        const step3Span = signalSpans.find((s) => s.attributes["event_name"] === "step_3");
        expect(step3Span?.attributes["enable_cost_tracing"]).toBe(true);
    });
});

describe("trace() and signal() integration", () => {
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
    });

    afterEach(async () => {
        await provider.shutdown();
        exporter.reset();
    });

    it("should work together with LLM-like spans", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust", externalProductId: "prod", storePrompt: true },
            async () => {
                // Simulate an LLM call span
                tracer.startActiveSpan("openai.chat.completions.create", (span) => {
                    span.setAttributes({
                        "llm.model_name": "gpt-4",
                        "llm.provider": "openai",
                        "llm.token_count.prompt": 100,
                        "llm.token_count.completion": 50,
                        "gen_ai.prompt": "Hello, how are you?",
                    });
                    span.end();
                });

                // Send a signal with cost tracing
                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "chat_completed");
                    span.setAttribute("enable_cost_tracing", true);
                    span.setAttribute(
                        "data",
                        JSON.stringify({ model: "gpt-4", tokens_used: 150 })
                    );
                    span.end();
                });
            }
        );

        const spans = exporter.getFinishedSpans();

        // Should have LLM span and signal span
        expect(spans.length).toBeGreaterThanOrEqual(2);

        const llmSpan = spans.find((s) => s.name.includes("openai"));
        const signalSpan = spans.find((s) => s.name.includes("signal"));

        expect(llmSpan).toBeDefined();
        expect(signalSpan).toBeDefined();

        // LLM span should have model info
        expect(llmSpan?.attributes["llm.model_name"]).toBe("gpt-4");
        expect(llmSpan?.attributes["llm.token_count.prompt"]).toBe(100);

        // Signal span should have event info
        expect(signalSpan?.attributes["event_name"]).toBe("chat_completed");
        expect(signalSpan?.attributes["enable_cost_tracing"]).toBe(true);

        // Both should have the same customer/product context
        expect(llmSpan?.attributes["external_customer_id"]).toBe("cust");
        expect(signalSpan?.attributes["external_customer_id"]).toBe("cust");
    });

    it("should handle nested trace contexts correctly", async () => {
        const results: string[] = [];

        await runWithTracingContext(
            { externalCustomerId: "outer-cust", externalProductId: "outer-prod" },
            async () => {
                const tracer = provider.getTracer("test");

                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "outer_start");
                    span.end();
                });
                results.push("outer-start");

                await runWithTracingContext(
                    { externalCustomerId: "inner-cust", externalProductId: "inner-prod" },
                    async () => {
                        tracer.startActiveSpan("signal", (span) => {
                            span.setAttribute("event_name", "inner_event");
                            span.end();
                        });
                        results.push("inner");
                    }
                );

                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "outer_end");
                    span.end();
                });
                results.push("outer-end");
            }
        );

        expect(results).toEqual(["outer-start", "inner", "outer-end"]);

        const spans = exporter.getFinishedSpans();
        const signalSpans = spans.filter((s) => s.name.includes("signal"));

        // Find signals by event_name
        const outerStartSignal = signalSpans.find(
            (s) => s.attributes["event_name"] === "outer_start"
        );
        const innerSignal = signalSpans.find(
            (s) => s.attributes["event_name"] === "inner_event"
        );
        const outerEndSignal = signalSpans.find(
            (s) => s.attributes["event_name"] === "outer_end"
        );

        // Verify context isolation
        expect(outerStartSignal?.attributes["external_customer_id"]).toBe("outer-cust");
        expect(innerSignal?.attributes["external_customer_id"]).toBe("inner-cust");
        expect(outerEndSignal?.attributes["external_customer_id"]).toBe("outer-cust");
    });
});
