/**
 * PaidSpanProcessor tests.
 * Tests span name prefixing, context attribute injection, and prompt filtering.
 * Modeled after Python SDK's TestPaidSpanProcessor class.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SpanStatusCode } from "@opentelemetry/api";
import {
    createTracingTestContext,
    createMinimalTracingTestContext,
    type TracingTestContext,
} from "./setup";
import {
    getFinishedSpans,
    assertPaidSpanPrefix,
    assertNoPromptAttributes,
    assertSpanAttributes,
    assertExternalCustomerId,
    assertExternalAgentId,
} from "./helpers";
import { PROMPT_ATTRIBUTE_KEYS } from "./constants";
import { runWithTracingContext } from "../../src/tracing/tracingContext.js";

describe("PaidSpanProcessor", () => {
    let ctx: TracingTestContext;

    beforeEach(() => {
        ctx = createTracingTestContext();
    });

    afterEach(() => {
        ctx.cleanup();
    });

    describe("Span Name Prefixing", () => {
        it("should add paid.trace. prefix to span names", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("my_operation");
            span.end();

            const spans = getFinishedSpans(ctx.exporter);
            expect(spans).toHaveLength(1);
            expect(spans[0].name).toBe("paid.trace.my_operation");
        });

        it("should not double-prefix already prefixed span names", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("paid.trace.already_prefixed");
            span.end();

            const spans = getFinishedSpans(ctx.exporter);
            expect(spans[0].name).toBe("paid.trace.already_prefixed");
        });

        it("should prefix nested span names", () => {
            const tracer = ctx.provider.getTracer("test");

            tracer.startActiveSpan("parent", (parentSpan) => {
                tracer.startActiveSpan("child", (childSpan) => {
                    childSpan.end();
                });
                parentSpan.end();
            });

            const spans = getFinishedSpans(ctx.exporter);
            expect(spans).toHaveLength(2);
            expect(spans.every((s) => s.name.startsWith("paid.trace."))).toBe(true);
        });
    });

    describe("Context Attribute Injection", () => {
        it("should add external_customer_id from context", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { externalCustomerId: "cust-123" },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            assertExternalCustomerId(spans[0], "cust-123");
        });

        it("should add external_agent_id from context", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { externalProductId: "agent-456" },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            assertExternalAgentId(spans[0], "agent-456");
        });

        it("should add both customer and agent IDs", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                {
                    externalCustomerId: "cust-789",
                    externalProductId: "agent-012",
                },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            assertExternalCustomerId(spans[0], "cust-789");
            assertExternalAgentId(spans[0], "agent-012");
        });

        it("should not add undefined context values", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("test_op");
            span.end();

            const spans = getFinishedSpans(ctx.exporter);
            expect(spans[0].attributes["external_customer_id"]).toBeUndefined();
            expect(spans[0].attributes["external_agent_id"]).toBeUndefined();
        });
    });

    describe("Prompt Attribute Filtering", () => {
        it("should filter prompt attributes by default (storePrompt=false)", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { storePrompt: false },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.setAttribute("gen_ai.completion", "some completion text");
                    span.setAttribute("gen_ai.prompt", "some prompt text");
                    span.setAttribute("gen_ai.request.messages", "[{...}]");
                    span.setAttribute("llm.input_message", "user message");
                    span.setAttribute("gen_ai.usage.input_tokens", 100); // Should survive
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const attrs = spans[0].attributes;

            expect(attrs["gen_ai.completion"]).toBeUndefined();
            expect(attrs["gen_ai.prompt"]).toBeUndefined();
            expect(attrs["gen_ai.request.messages"]).toBeUndefined();
            expect(attrs["llm.input_message"]).toBeUndefined();
            expect(attrs["gen_ai.usage.input_tokens"]).toBe(100); // Usage survives
        });

        it("should keep prompt attributes when storePrompt=true", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { storePrompt: true },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.setAttribute("gen_ai.completion", "some completion text");
                    span.setAttribute("gen_ai.prompt", "some prompt text");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const attrs = spans[0].attributes;

            expect(attrs["gen_ai.completion"]).toBe("some completion text");
            expect(attrs["gen_ai.prompt"]).toBe("some prompt text");
        });

        it("should filter all prompt-related attribute patterns", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { storePrompt: false },
                async () => {
                    const span = tracer.startSpan("test_op");
                    // Set all prompt-related attributes
                    PROMPT_ATTRIBUTE_KEYS.forEach((key, i) => {
                        span.setAttribute(key, `value-${i}`);
                    });
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            assertNoPromptAttributes(spans);
        });

        it("should filter attributes containing prompt substrings", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { storePrompt: false },
                async () => {
                    const span = tracer.startSpan("test_op");
                    // These contain the filtered substrings
                    span.setAttribute("custom.gen_ai.completion.result", "filtered");
                    span.setAttribute("prefix.llm.input_message.0", "filtered");
                    span.setAttribute("ai.prompt.template", "filtered");
                    // This should not be filtered
                    span.setAttribute("gen_ai.model", "gpt-4");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const attrs = spans[0].attributes;

            expect(attrs["custom.gen_ai.completion.result"]).toBeUndefined();
            expect(attrs["prefix.llm.input_message.0"]).toBeUndefined();
            expect(attrs["ai.prompt.template"]).toBeUndefined();
            expect(attrs["gen_ai.model"]).toBe("gpt-4");
        });

        it("should filter attributes set via setAttributes batch method", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { storePrompt: false },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.setAttributes({
                        "gen_ai.prompt": "filtered",
                        "gen_ai.completion": "filtered",
                        "gen_ai.model": "kept",
                        "gen_ai.usage.tokens": 50,
                    });
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const attrs = spans[0].attributes;

            expect(attrs["gen_ai.prompt"]).toBeUndefined();
            expect(attrs["gen_ai.completion"]).toBeUndefined();
            expect(attrs["gen_ai.model"]).toBe("kept");
            expect(attrs["gen_ai.usage.tokens"]).toBe(50);
        });

        it("should filter attributes set before onStart (during span creation)", async () => {
            // This tests that existing attributes are also filtered
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { storePrompt: false },
                async () => {
                    const span = tracer.startSpan("test_op", {
                        attributes: {
                            "gen_ai.prompt": "should be filtered",
                            "other.attr": "should remain",
                        },
                    });
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const attrs = spans[0].attributes;

            expect(attrs["gen_ai.prompt"]).toBeUndefined();
            expect(attrs["other.attr"]).toBe("should remain");
        });
    });

    describe("Default storePrompt behavior", () => {
        it("should default to storePrompt=false when no context", () => {
            const tracer = ctx.provider.getTracer("test");

            const span = tracer.startSpan("test_op");
            span.setAttribute("gen_ai.prompt", "should be filtered");
            span.end();

            const spans = getFinishedSpans(ctx.exporter);
            expect(spans[0].attributes["gen_ai.prompt"]).toBeUndefined();
        });
    });

    describe("Comparison with minimal context (no PaidSpanProcessor)", () => {
        let minimalCtx: TracingTestContext;

        beforeEach(() => {
            minimalCtx = createMinimalTracingTestContext();
        });

        afterEach(() => {
            minimalCtx.cleanup();
        });

        it("minimal context should not add prefix", () => {
            const tracer = minimalCtx.provider.getTracer("test");
            const span = tracer.startSpan("raw_operation");
            span.end();

            const spans = minimalCtx.exporter.getFinishedSpans();
            expect(spans[0].name).toBe("raw_operation");
        });

        it("minimal context should not filter prompt attributes", () => {
            const tracer = minimalCtx.provider.getTracer("test");
            const span = tracer.startSpan("test_op");
            span.setAttribute("gen_ai.prompt", "should remain");
            span.end();

            const spans = minimalCtx.exporter.getFinishedSpans();
            expect(spans[0].attributes["gen_ai.prompt"]).toBe("should remain");
        });
    });

    describe("Metadata Flattening", () => {
        /**
         * These tests verify that metadata from context is flattened and added to spans.
         * Python SDK flattens nested metadata with "metadata." prefix.
         * Example: { user: { id: 123 } } -> span.attribute["metadata.user.id"] = 123
         */

        it("should flatten simple metadata to span attributes", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                {
                    externalCustomerId: "cust-123",
                    metadata: { env: "test", version: "v2" },
                },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const attrs = spans[0].attributes;

            // Metadata should be flattened with "metadata." prefix
            expect(attrs["metadata.env"]).toBe("test");
            expect(attrs["metadata.version"]).toBe("v2");
        });

        it("should flatten nested metadata to span attributes", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                {
                    externalCustomerId: "cust-123",
                    metadata: {
                        user: { id: 123, name: "Alice" },
                        config: { nested: { deep: "value" } },
                    },
                },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const attrs = spans[0].attributes;

            // Nested metadata should be flattened with dot notation
            expect(attrs["metadata.user.id"]).toBe(123);
            expect(attrs["metadata.user.name"]).toBe("Alice");
            expect(attrs["metadata.config.nested.deep"]).toBe("value");
        });

        it("should handle empty metadata gracefully", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                {
                    externalCustomerId: "cust-123",
                    metadata: {},
                },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            // Should not throw, span should exist
            expect(spans).toHaveLength(1);
        });

        it("should handle undefined metadata gracefully", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                {
                    externalCustomerId: "cust-123",
                    metadata: undefined,
                },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            // Should not throw, span should exist
            expect(spans).toHaveLength(1);
        });

        it("should handle array values in metadata", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                {
                    externalCustomerId: "cust-123",
                    metadata: { tags: ["a", "b", "c"] },
                },
                async () => {
                    const span = tracer.startSpan("test_op");
                    span.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const attrs = spans[0].attributes;

            // Arrays should be handled (either as JSON string or indexed)
            expect(
                attrs["metadata.tags"] !== undefined ||
                attrs["metadata.tags.0"] !== undefined
            ).toBe(true);
        });
    });

    describe("LangChain Duplicate Span Filtering", () => {
        /**
         * These tests verify that duplicate LangChain spans are filtered out.
         * Python SDK filters spans with names like "ChatOpenAI", "ChatAnthropic"
         * to avoid double-counting from LangChain instrumentation.
         */

        it("should filter out ChatOpenAI span names", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { externalCustomerId: "cust-123" },
                async () => {
                    // Simulate LangChain creating a ChatOpenAI span
                    const span = tracer.startSpan("ChatOpenAI");
                    span.end();

                    // Also create a legitimate span
                    const legitimateSpan = tracer.startSpan("legitimate_operation");
                    legitimateSpan.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const spanNames = spans.map((s) => s.name);

            // ChatOpenAI should be filtered out
            expect(spanNames.some((n) => n.includes("ChatOpenAI"))).toBe(false);
            // Legitimate span should remain
            expect(spanNames.some((n) => n.includes("legitimate_operation"))).toBe(true);
        });

        it("should filter out ChatAnthropic span names", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { externalCustomerId: "cust-123" },
                async () => {
                    // Simulate LangChain creating a ChatAnthropic span
                    const span = tracer.startSpan("ChatAnthropic");
                    span.end();

                    // Also create a legitimate span
                    const legitimateSpan = tracer.startSpan("my_agent_call");
                    legitimateSpan.end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            const spanNames = spans.map((s) => s.name);

            // ChatAnthropic should be filtered out
            expect(spanNames.some((n) => n.includes("ChatAnthropic"))).toBe(false);
            // Legitimate span should remain
            expect(spanNames.some((n) => n.includes("my_agent_call"))).toBe(true);
        });

        it("should keep spans that are not in the filter list", async () => {
            const tracer = ctx.provider.getTracer("test");

            await runWithTracingContext(
                { externalCustomerId: "cust-123" },
                async () => {
                    tracer.startSpan("OpenAIChat").end(); // Not exactly "ChatOpenAI"
                    tracer.startSpan("AnthropicMessages").end();
                    tracer.startSpan("MyCustomSpan").end();
                }
            );

            const spans = getFinishedSpans(ctx.exporter);
            // All these should remain (they don't match the exact filter patterns)
            expect(spans.length).toBeGreaterThanOrEqual(3);
        });
    });
});
