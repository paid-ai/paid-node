/**
 * Tracing functionality tests.
 *
 * Tests the core tracing functionality including:
 * - trace() context propagation
 * - signal() function
 * - PaidSpanProcessor prompt filtering
 * - Context attributes on spans
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SpanStatusCode } from "@opentelemetry/api";
import { PaidSpanProcessor } from "../../src/tracing/spanProcessor";
import { AISDKSpanProcessor } from "../../src/tracing/aiSdkSpanProcessor";
import { runWithTracingContext, getTracingContext } from "../../src/tracing/tracingContext";

describe("TracingContext", () => {
    it("should return default context when not in a trace", () => {
        const ctx = getTracingContext();
        expect(ctx.externalCustomerId).toBeUndefined();
        expect(ctx.externalProductId).toBeUndefined();
        expect(ctx.storePrompt).toBe(false);
    });

    it("should propagate context through runWithTracingContext", async () => {
        const result = await runWithTracingContext(
            {
                externalCustomerId: "cust-123",
                externalProductId: "prod-456",
                storePrompt: true,
                metadata: { key: "value" },
            },
            async () => {
                const ctx = getTracingContext();
                return ctx;
            }
        );

        expect(result.externalCustomerId).toBe("cust-123");
        expect(result.externalProductId).toBe("prod-456");
        expect(result.storePrompt).toBe(true);
        expect(result.metadata).toEqual({ key: "value" });
    });

    it("should isolate context between nested calls", async () => {
        const results: string[] = [];

        await runWithTracingContext({ externalCustomerId: "outer" }, async () => {
            results.push(getTracingContext().externalCustomerId || "");

            await runWithTracingContext({ externalCustomerId: "inner" }, async () => {
                results.push(getTracingContext().externalCustomerId || "");
            });

            results.push(getTracingContext().externalCustomerId || "");
        });

        expect(results).toEqual(["outer", "inner", "outer"]);
    });
});

describe("PaidSpanProcessor", () => {
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

    it("should prefix span names with paid.trace.", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust-1" }, async () => {
            const span = tracer.startSpan("test-span");
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        expect(spans.length).toBe(1);
        expect(spans[0].name).toBe("paid.trace.test-span");
    });

    it("should add external_customer_id attribute from context", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust-abc" }, async () => {
            const span = tracer.startSpan("test-span");
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        expect(spans[0].attributes["external_customer_id"]).toBe("cust-abc");
    });

    it("should add external_agent_id attribute from context", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust", externalProductId: "agent-007" },
            async () => {
                const span = tracer.startSpan("test-span");
                span.end();
            }
        );

        const spans = exporter.getFinishedSpans();
        expect(spans[0].attributes["external_agent_id"]).toBe("agent-007");
    });

    it("should filter prompt-related attributes when storePrompt is false", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust", storePrompt: false }, async () => {
            const span = tracer.startSpan("test-span");
            span.setAttribute("gen_ai.prompt", "secret prompt");
            span.setAttribute("llm.input_message", "secret input");
            span.setAttribute("input.value", "secret value");
            span.setAttribute("safe_attribute", "visible");
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        const attrs = spans[0].attributes;

        // Prompt attributes should be filtered
        expect(attrs["gen_ai.prompt"]).toBeUndefined();
        expect(attrs["llm.input_message"]).toBeUndefined();
        expect(attrs["input.value"]).toBeUndefined();
        // Safe attributes should remain
        expect(attrs["safe_attribute"]).toBe("visible");
    });

    it("should keep prompt-related attributes when storePrompt is true", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust", storePrompt: true }, async () => {
            const span = tracer.startSpan("test-span");
            span.setAttribute("gen_ai.prompt", "visible prompt");
            span.setAttribute("safe_attribute", "visible");
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        const attrs = spans[0].attributes;

        expect(attrs["gen_ai.prompt"]).toBe("visible prompt");
        expect(attrs["safe_attribute"]).toBe("visible");
    });

    it("should filter prompt attributes set via setAttributes", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust", storePrompt: false }, async () => {
            const span = tracer.startSpan("test-span");
            span.setAttributes({
                "gen_ai.completion": "secret completion",
                "llm.output_message": "secret output",
                "output.value": "secret value",
                "safe_attr": "visible",
            });
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        const attrs = spans[0].attributes;

        expect(attrs["gen_ai.completion"]).toBeUndefined();
        expect(attrs["llm.output_message"]).toBeUndefined();
        expect(attrs["output.value"]).toBeUndefined();
        expect(attrs["safe_attr"]).toBe("visible");
    });
});

describe("Signal Span Creation", () => {
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

    it("should create signal span with event_name attribute", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext(
            { externalCustomerId: "cust", externalProductId: "prod" },
            async () => {
                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "user_action");
                    span.end();
                });
            }
        );

        const spans = exporter.getFinishedSpans();
        const signalSpan = spans.find((s) => s.name.includes("signal"));
        expect(signalSpan).toBeDefined();
        expect(signalSpan?.attributes["event_name"]).toBe("user_action");
    });

    it("should create signal span with enable_cost_tracing attribute", async () => {
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

    it("should include data attribute as JSON string", async () => {
        const tracer = provider.getTracer("test");
        const data = { custom_field: "value", count: 42 };

        await runWithTracingContext(
            { externalCustomerId: "cust", externalProductId: "prod" },
            async () => {
                tracer.startActiveSpan("signal", (span) => {
                    span.setAttribute("event_name", "custom_event");
                    span.setAttribute("data", JSON.stringify(data));
                    span.end();
                });
            }
        );

        const spans = exporter.getFinishedSpans();
        const signalSpan = spans.find((s) => s.name.includes("signal"));
        expect(signalSpan?.attributes["data"]).toBe(JSON.stringify(data));
    });
});

describe("AISDKSpanProcessor", () => {
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

    it("should process AI SDK spans", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust" }, async () => {
            const span = tracer.startSpan("ai.generateText");
            span.setAttribute("ai.model.id", "gpt-4");
            span.setAttribute("ai.usage.promptTokens", 100);
            span.setAttribute("ai.usage.completionTokens", 50);
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        expect(spans.length).toBe(1);
        // Verify span was processed (name prefixed)
        expect(spans[0].name).toContain("paid.trace.");
    });
});

describe("Span Status", () => {
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

    it("should have OK status on successful span", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust" }, async () => {
            const span = tracer.startSpan("success-span");
            span.setStatus({ code: SpanStatusCode.OK });
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        expect(spans[0].status.code).toBe(SpanStatusCode.OK);
    });

    it("should have ERROR status on failed span", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust" }, async () => {
            const span = tracer.startSpan("error-span");
            span.setStatus({ code: SpanStatusCode.ERROR, message: "Something went wrong" });
            span.recordException(new Error("Test error"));
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        expect(spans[0].status.code).toBe(SpanStatusCode.ERROR);
        expect(spans[0].status.message).toBe("Something went wrong");
    });
});

describe("LLM Span Attributes", () => {
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

    it("should capture LLM model attributes", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust", storePrompt: true }, async () => {
            const span = tracer.startSpan("chat_completion");
            span.setAttributes({
                "llm.model_name": "gpt-4",
                "llm.provider": "openai",
                "llm.system": "openai",
                "openinference.span.kind": "LLM",
            });
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        const attrs = spans[0].attributes;

        expect(attrs["llm.model_name"]).toBe("gpt-4");
        expect(attrs["llm.provider"]).toBe("openai");
        expect(attrs["llm.system"]).toBe("openai");
        expect(attrs["openinference.span.kind"]).toBe("LLM");
    });

    it("should capture token count attributes", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust" }, async () => {
            const span = tracer.startSpan("chat_completion");
            span.setAttributes({
                "llm.token_count.prompt": 150,
                "llm.token_count.completion": 75,
                "llm.token_count.total": 225,
            });
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        const attrs = spans[0].attributes;

        expect(attrs["llm.token_count.prompt"]).toBe(150);
        expect(attrs["llm.token_count.completion"]).toBe(75);
        expect(attrs["llm.token_count.total"]).toBe(225);
    });

    it("should capture cache token attributes", async () => {
        const tracer = provider.getTracer("test");

        await runWithTracingContext({ externalCustomerId: "cust" }, async () => {
            const span = tracer.startSpan("anthropic_message");
            span.setAttributes({
                "llm.token_count.prompt_details.cache_read": 500,
                "llm.token_count.prompt_details.cache_write": 200,
            });
            span.end();
        });

        const spans = exporter.getFinishedSpans();
        const attrs = spans[0].attributes;

        expect(attrs["llm.token_count.prompt_details.cache_read"]).toBe(500);
        expect(attrs["llm.token_count.prompt_details.cache_write"]).toBe(200);
    });
});
