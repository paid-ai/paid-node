/**
 * Infrastructure sanity tests.
 * Verifies that the test setup and helpers work correctly.
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
    getPaidSpans,
    assertSpanOk,
    assertSpanError,
    assertSpanAttributes,
    assertPaidSpanPrefix,
} from "./helpers";

describe("Test Infrastructure", () => {
    describe("createTracingTestContext", () => {
        let ctx: TracingTestContext;

        beforeEach(() => {
            ctx = createTracingTestContext();
        });

        afterEach(() => {
            ctx.cleanup();
        });

        it("should create a valid exporter", () => {
            expect(ctx.exporter).toBeDefined();
            expect(ctx.exporter.getFinishedSpans()).toEqual([]);
        });

        it("should create a valid provider", () => {
            expect(ctx.provider).toBeDefined();
            expect(ctx.provider.getTracer).toBeDefined();
        });

        it("should capture spans created by the provider", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("test-span");
            span.end();

            const spans = ctx.exporter.getFinishedSpans();
            expect(spans).toHaveLength(1);
            expect(spans[0].name).toBe("paid.trace.test-span"); // PaidSpanProcessor adds prefix
        });

        it("should apply PaidSpanProcessor prefix to span names", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("my-operation");
            span.end();

            const spans = getFinishedSpans(ctx.exporter);
            expect(spans[0].name).toMatch(/^paid\.trace\./);
        });

        it("should reset exporter on cleanup", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("test-span");
            span.end();

            expect(ctx.exporter.getFinishedSpans()).toHaveLength(1);

            ctx.exporter.reset();
            expect(ctx.exporter.getFinishedSpans()).toHaveLength(0);
        });
    });

    describe("createMinimalTracingTestContext", () => {
        let ctx: TracingTestContext;

        beforeEach(() => {
            ctx = createMinimalTracingTestContext();
        });

        afterEach(() => {
            ctx.cleanup();
        });

        it("should NOT apply PaidSpanProcessor prefix", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("raw-span");
            span.end();

            const spans = ctx.exporter.getFinishedSpans();
            expect(spans[0].name).toBe("raw-span"); // No prefix
        });
    });

    describe("Helper Functions", () => {
        let ctx: TracingTestContext;

        beforeEach(() => {
            ctx = createTracingTestContext();
        });

        afterEach(() => {
            ctx.cleanup();
        });

        it("getFinishedSpans should return all spans", () => {
            const tracer = ctx.provider.getTracer("test");
            tracer.startSpan("span-1").end();
            tracer.startSpan("span-2").end();

            const spans = getFinishedSpans(ctx.exporter);
            expect(spans).toHaveLength(2);
        });

        it("getPaidSpans should filter spans with paid prefix", () => {
            const tracer = ctx.provider.getTracer("test");
            tracer.startSpan("operation").end();

            const paidSpans = getPaidSpans(ctx.exporter);
            expect(paidSpans).toHaveLength(1);
            expect(paidSpans[0].name).toMatch(/^paid\.trace\./);
        });

        it("assertSpanOk should pass for OK status", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("test-span");
            span.setStatus({ code: SpanStatusCode.OK });
            span.end();

            const spans = ctx.exporter.getFinishedSpans();
            expect(() => assertSpanOk(spans[0])).not.toThrow();
        });

        it("assertSpanError should pass for ERROR status", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("test-span");
            span.setStatus({ code: SpanStatusCode.ERROR, message: "test error" });
            span.end();

            const spans = ctx.exporter.getFinishedSpans();
            expect(() => assertSpanError(spans[0], "test error")).not.toThrow();
        });

        it("assertSpanAttributes should verify attributes", () => {
            const tracer = ctx.provider.getTracer("test");
            const span = tracer.startSpan("test-span");
            span.setAttribute("key1", "value1");
            span.setAttribute("key2", 123);
            span.end();

            const spans = ctx.exporter.getFinishedSpans();
            expect(() =>
                assertSpanAttributes(spans[0], {
                    key1: "value1",
                    key2: 123,
                })
            ).not.toThrow();
        });

        it("assertPaidSpanPrefix should verify prefix", () => {
            const tracer = ctx.provider.getTracer("test");
            tracer.startSpan("operation").end();

            const spans = ctx.exporter.getFinishedSpans();
            expect(() => assertPaidSpanPrefix(spans[0])).not.toThrow();
        });
    });
});
