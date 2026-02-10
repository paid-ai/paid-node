/**
 * Helper functions for tracing test assertions.
 * Modeled after Python SDK's test helpers.
 */
import type { ReadableSpan } from "@opentelemetry/sdk-trace-base";
import type { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { SpanStatusCode } from "@opentelemetry/api";
import { expect } from "vitest";

/**
 * Get all finished spans from the exporter.
 */
export function getFinishedSpans(exporter: InMemorySpanExporter): ReadableSpan[] {
    return exporter.getFinishedSpans();
}

/**
 * Filter spans by name pattern.
 */
export function getSpansByName(exporter: InMemorySpanExporter, namePattern: string | RegExp): ReadableSpan[] {
    const spans = exporter.getFinishedSpans();
    if (typeof namePattern === "string") {
        return spans.filter((span) => span.name.includes(namePattern));
    }
    return spans.filter((span) => namePattern.test(span.name));
}

/**
 * Get spans that have the "paid.trace." prefix (processed by PaidSpanProcessor).
 */
export function getPaidSpans(exporter: InMemorySpanExporter): ReadableSpan[] {
    return exporter.getFinishedSpans().filter((span) => span.name.startsWith("paid.trace."));
}

/**
 * Get spans related to gen_ai operations (LLM calls).
 */
export function getGenAiSpans(exporter: InMemorySpanExporter): ReadableSpan[] {
    const spans = exporter.getFinishedSpans();
    return spans.filter((span) => {
        const attrs = span.attributes;
        return (
            attrs["gen_ai.system"] !== undefined ||
            attrs["gen_ai.operation.name"] !== undefined ||
            span.name.includes("chat") ||
            span.name.includes("completion")
        );
    });
}

/**
 * Get a specific attribute from a span.
 */
export function getSpanAttribute(span: ReadableSpan, key: string): unknown {
    return span.attributes[key];
}

/**
 * Check if a span has a specific attribute.
 */
export function spanHasAttribute(span: ReadableSpan, key: string): boolean {
    return key in span.attributes;
}

/**
 * Assert that a span has the expected status.
 */
export function assertSpanStatus(span: ReadableSpan, expectedCode: SpanStatusCode, expectedMessage?: string): void {
    expect(span.status.code).toBe(expectedCode);
    if (expectedMessage !== undefined) {
        expect(span.status.message).toBe(expectedMessage);
    }
}

/**
 * Assert that a span completed successfully (OK status).
 */
export function assertSpanOk(span: ReadableSpan): void {
    assertSpanStatus(span, SpanStatusCode.OK);
}

/**
 * Assert that a span has an error status.
 */
export function assertSpanError(span: ReadableSpan, expectedMessage?: string): void {
    assertSpanStatus(span, SpanStatusCode.ERROR, expectedMessage);
}

/**
 * Assert that a span has the expected attributes.
 */
export function assertSpanAttributes(span: ReadableSpan, expectedAttrs: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(expectedAttrs)) {
        expect(span.attributes[key]).toEqual(value);
    }
}

/**
 * Assert that a span does NOT have certain attribute keys.
 * Useful for testing prompt filtering.
 */
export function assertSpanMissingAttributes(span: ReadableSpan, keys: string[]): void {
    for (const key of keys) {
        expect(span.attributes[key]).toBeUndefined();
    }
}

/**
 * Assert that a span name starts with the paid prefix.
 */
export function assertPaidSpanPrefix(span: ReadableSpan): void {
    expect(span.name).toMatch(/^paid\.trace\./);
}

/**
 * Assert that no span contains prompt-related attributes.
 * Used to verify storePrompt=false filtering.
 */
export function assertNoPromptAttributes(spans: ReadableSpan[]): void {
    const promptPatterns = [
        "gen_ai.completion",
        "gen_ai.request.messages",
        "gen_ai.response.messages",
        "llm.output_message",
        "llm.input_message",
        "llm.invocation_parameters",
        "gen_ai.prompt",
        "langchain.prompt",
        "output.value",
        "input.value",
        "ai.response.text",
        "ai.prompt",
    ];

    for (const span of spans) {
        for (const key of Object.keys(span.attributes)) {
            const hasPromptAttr = promptPatterns.some((pattern) => key.includes(pattern));
            expect(hasPromptAttr, `Span "${span.name}" should not have prompt attribute "${key}"`).toBe(false);
        }
    }
}

/**
 * Assert that a span has the expected external_customer_id.
 */
export function assertExternalCustomerId(span: ReadableSpan, expectedId: string): void {
    expect(span.attributes["external_customer_id"]).toBe(expectedId);
}

/**
 * Assert that a span has the expected external_agent_id (product id).
 */
export function assertExternalAgentId(span: ReadableSpan, expectedId: string): void {
    expect(span.attributes["external_agent_id"]).toBe(expectedId);
}

/**
 * Wait for spans to be exported.
 * Some exporters may have async behavior.
 */
export async function waitForSpans(exporter: InMemorySpanExporter, expectedCount: number, timeoutMs = 1000): Promise<ReadableSpan[]> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
        const spans = exporter.getFinishedSpans();
        if (spans.length >= expectedCount) {
            return spans;
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
    return exporter.getFinishedSpans();
}

/**
 * Print spans for debugging purposes.
 */
export function debugPrintSpans(spans: ReadableSpan[]): void {
    console.log("\n=== Debug Spans ===");
    for (const span of spans) {
        console.log(`\nSpan: ${span.name}`);
        console.log(`  Status: ${SpanStatusCode[span.status.code]}`);
        console.log(`  Attributes:`);
        for (const [key, value] of Object.entries(span.attributes)) {
            const valueStr = typeof value === "string" && value.length > 100 ? value.substring(0, 100) + "..." : value;
            console.log(`    ${key}: ${valueStr}`);
        }
    }
    console.log("\n=== End Debug ===\n");
}
