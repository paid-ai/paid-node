/**
 * Shared test fixtures for tracing tests.
 * Modeled after Python SDK's conftest.py
 */
import { afterEach, beforeEach } from "vitest";
import { NodeTracerProvider, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PaidSpanProcessor } from "../../src/tracing/spanProcessor.js";

// Re-export for convenience
export { InMemorySpanExporter } from "@opentelemetry/sdk-trace-base";
export type { ReadableSpan } from "@opentelemetry/sdk-trace-base";

/**
 * Test context that holds the exporter and provider for a test.
 * Use createTracingTestContext() to create one.
 */
export interface TracingTestContext {
    /** InMemorySpanExporter to capture spans for assertions */
    exporter: InMemorySpanExporter;
    /** TracerProvider configured with PaidSpanProcessor */
    provider: NodeTracerProvider;
    /** Cleanup function - call in afterEach */
    cleanup: () => void;
}

/**
 * Creates a tracing test context with InMemorySpanExporter and TracerProvider.
 * The provider is configured with PaidSpanProcessor for testing span processing.
 *
 * @example
 * ```ts
 * let ctx: TracingTestContext;
 *
 * beforeEach(() => {
 *   ctx = createTracingTestContext();
 * });
 *
 * afterEach(() => {
 *   ctx.cleanup();
 * });
 *
 * it("should create spans", async () => {
 *   // ... run code that creates spans ...
 *   const spans = ctx.exporter.getFinishedSpans();
 *   expect(spans).toHaveLength(1);
 * });
 * ```
 */
export function createTracingTestContext(): TracingTestContext {
    const exporter = new InMemorySpanExporter();

    const provider = new NodeTracerProvider({
        resource: resourceFromAttributes({
            [SEMRESATTRS_SERVICE_NAME]: "paid-node-test",
            "api.key": "test-api-key",
        }),
        spanProcessors: [new PaidSpanProcessor(), new SimpleSpanProcessor(exporter)],
    });

    // Register as global provider
    provider.register();

    const cleanup = () => {
        exporter.reset();
        provider.shutdown();
    };

    return { exporter, provider, cleanup };
}

/**
 * Creates a minimal tracing context without PaidSpanProcessor.
 * Useful for testing raw span behavior without paid-specific processing.
 */
export function createMinimalTracingTestContext(): TracingTestContext {
    const exporter = new InMemorySpanExporter();

    const provider = new NodeTracerProvider({
        resource: resourceFromAttributes({
            [SEMRESATTRS_SERVICE_NAME]: "paid-node-test-minimal",
        }),
        spanProcessors: [new SimpleSpanProcessor(exporter)],
    });

    provider.register();

    const cleanup = () => {
        exporter.reset();
        provider.shutdown();
    };

    return { exporter, provider, cleanup };
}

/**
 * Vitest setup hooks for tracing tests.
 * Import and call this in your test file to automatically set up and tear down tracing context.
 *
 * @example
 * ```ts
 * import { setupTracingTests } from "./setup";
 *
 * const { getContext } = setupTracingTests();
 *
 * it("should work", () => {
 *   const { exporter } = getContext();
 *   // ...
 * });
 * ```
 */
export function setupTracingTests() {
    let ctx: TracingTestContext | null = null;

    beforeEach(() => {
        ctx = createTracingTestContext();
    });

    afterEach(() => {
        ctx?.cleanup();
        ctx = null;
    });

    return {
        getContext: () => {
            if (!ctx) {
                throw new Error("Tracing context not initialized. Make sure test is running within beforeEach/afterEach hooks.");
            }
            return ctx;
        },
    };
}
