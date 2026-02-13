/**
 * AI SDK Tracing E2E Test
 *
 * This test validates that the AI SDK tracing integration correctly
 * captures telemetry from Vercel AI SDK.
 *
 * Test Flow:
 * 1. Initialize AI SDK tracing
 * 2. Make an AI call using generateText with experimental_telemetry enabled
 * 3. Verify the call completes successfully and traces are flushed
 *
 * Required environment variables:
 * - PAID_API_TOKEN: API token for Paid API
 * - OPENAI_API_KEY: API key for OpenAI
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { initializeAISDKTracing, trace, getAISDKTracerProvider } from "../../dist/cjs/ai-sdk-wrapper/index.js";

const PAID_API_TOKEN = process.env.PAID_API_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!PAID_API_TOKEN) {
    console.error("Error: PAID_API_TOKEN environment variable is required");
    process.exit(1);
}

if (!OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    process.exit(1);
}

// Set PAID_API_KEY for tracing
process.env.PAID_API_KEY = PAID_API_TOKEN;

// Generate unique test IDs
const testRunId = `ai-sdk-test-${Date.now()}`;
const testCustomerId = `ai-sdk-customer-${testRunId}`;
const testProductId = `ai-sdk-product-${testRunId}`;

function log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

async function main() {
    log("=".repeat(70));
    log("AI SDK Tracing E2E Test");
    log("=".repeat(70));
    log(`Test Run ID: ${testRunId}`);
    log(`Customer ID: ${testCustomerId}`);
    log(`Product ID: ${testProductId}`);
    log("");

    // Step 1: Initialize AI SDK tracing
    log("Step 1: Initializing AI SDK tracing...");
    initializeAISDKTracing();

    const provider = getAISDKTracerProvider();
    if (!provider) {
        log("FAILED: AI SDK tracing provider not initialized");
        process.exit(1);
    }
    log("  AI SDK tracing initialized successfully");

    // Step 2: Make an AI call with trace() and experimental_telemetry
    log("Step 2: Making attributed AI SDK call with generateText...");

    const result = await trace(
        {
            externalCustomerId: testCustomerId,
            externalProductId: testProductId,
        },
        async () => {
            return await generateText({
                model: openai("gpt-4o-mini"),
                prompt: "Say hello in one word.",
                maxTokens: 10,
                experimental_telemetry: { isEnabled: true },
            });
        }
    );

    // Validate response
    if (!result.text) {
        log("FAILED: No text in response");
        process.exit(1);
    }

    log(`  AI SDK call completed successfully`);
    log(`  Response: "${result.text}"`);
    log(`  Tokens: input=${result.usage?.promptTokens}, output=${result.usage?.completionTokens}`);

    // Step 3: Flush traces
    log("Step 3: Flushing traces...");
    await provider.forceFlush();
    log("  Traces flushed successfully");

    // Step 4: Test streaming
    log("Step 4: Testing streamText with trace()...");

    const { streamText } = await import("ai");

    const streamResult = await trace(
        {
            externalCustomerId: testCustomerId,
            externalProductId: testProductId,
        },
        async () => {
            const result = streamText({
                model: openai("gpt-4o-mini"),
                prompt: "Count from 1 to 3.",
                maxTokens: 20,
                experimental_telemetry: { isEnabled: true },
            });

            let fullText = "";
            for await (const chunk of result.textStream) {
                fullText += chunk;
            }

            return { text: fullText, usage: await result.usage };
        }
    );

    if (!streamResult.text) {
        log("FAILED: No text in stream response");
        process.exit(1);
    }

    log(`  Stream completed successfully`);
    log(`  Response: "${streamResult.text}"`);
    log(`  Tokens: input=${streamResult.usage?.promptTokens}, output=${streamResult.usage?.completionTokens}`);

    // Final flush
    await provider.forceFlush();

    log("");
    log("=".repeat(70));
    log("SUCCESS: AI SDK tracing E2E test passed!");
    log("=".repeat(70));
    log("");
    log("Verified:");
    log("  - AI SDK tracing initialization works");
    log("  - generateText with trace() and experimental_telemetry works");
    log("  - streamText with trace() and experimental_telemetry works");
    log("  - Traces are flushed without errors");
    log("");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
