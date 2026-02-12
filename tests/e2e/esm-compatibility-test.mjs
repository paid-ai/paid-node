/**
 * ESM Compatibility Test
 *
 * This test verifies that the package works correctly in a pure ESM environment.
 * It tests that all exports can be imported and basic functionality works.
 *
 * Run with: node tests/e2e/esm-compatibility-test.mjs
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Results tracking
const results = [];

function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

async function runTest(name, fn) {
    try {
        await fn();
        results.push({ test: name, passed: true });
        log(`  [PASS] ${name}`);
    } catch (error) {
        results.push({ test: name, passed: false, error: error.message });
        log(`  [FAIL] ${name}: ${error.message}`);
    }
}

// ============================================================================
// Tests
// ============================================================================

async function testMainExport() {
    // Test main package export
    const mainModule = await import("../../dist/esm/index.mjs");

    if (!mainModule.PaidClient) {
        throw new Error("PaidClient not exported from main module");
    }

    // Verify PaidClient can be instantiated (without making actual API calls)
    const client = new mainModule.PaidClient({ token: "test-token" });
    if (!client.customers || !client.products || !client.signals) {
        throw new Error("PaidClient missing expected properties");
    }
}

async function testTracingExport() {
    // Test tracing export
    const tracingModule = await import("../../dist/esm/tracing/index.mjs");

    if (typeof tracingModule.initializeTracing !== "function") {
        throw new Error("initializeTracing not exported from tracing module");
    }

    if (typeof tracingModule.trace !== "function") {
        throw new Error("trace not exported from tracing module");
    }

    if (typeof tracingModule.signal !== "function") {
        throw new Error("signal not exported from tracing module");
    }
}

async function testGenAISpanProcessor() {
    // Test GenAI span processor export
    const tracingModule = await import("../../dist/esm/tracing/genAISpanProcessor.mjs");

    if (!tracingModule.GenAISpanProcessor) {
        throw new Error("GenAISpanProcessor not exported");
    }

    // Verify it can be instantiated
    const processor = new tracingModule.GenAISpanProcessor();

    if (typeof processor.onStart !== "function") {
        throw new Error("GenAISpanProcessor missing onStart method");
    }
    if (typeof processor.onEnd !== "function") {
        throw new Error("GenAISpanProcessor missing onEnd method");
    }
    if (typeof processor.shutdown !== "function") {
        throw new Error("GenAISpanProcessor missing shutdown method");
    }
    if (typeof processor.forceFlush !== "function") {
        throw new Error("GenAISpanProcessor missing forceFlush method");
    }

    // Verify constants are exported
    if (!tracingModule.GenAIAttributes) {
        throw new Error("GenAIAttributes not exported");
    }
    if (!tracingModule.OpenInferenceSpanKinds) {
        throw new Error("OpenInferenceSpanKinds not exported");
    }
}

async function testAISDKWrapperExport() {
    // Test ai-sdk wrapper export
    // This is the critical test - it uses require() internally
    try {
        const aiSdkModule = await import("../../dist/esm/ai-sdk-wrapper/index.mjs");

        if (!aiSdkModule.GenAISpanProcessor) {
            throw new Error("GenAISpanProcessor not exported from ai-sdk wrapper");
        }

        if (typeof aiSdkModule.trace !== "function") {
            throw new Error("trace not exported from ai-sdk wrapper");
        }

        if (typeof aiSdkModule.initializeAISDKTracing !== "function") {
            throw new Error("initializeAISDKTracing not exported from ai-sdk wrapper");
        }

        // Verify GenAISpanProcessor can be instantiated
        const processor = new aiSdkModule.GenAISpanProcessor();
        if (typeof processor.onStart !== "function") {
            throw new Error("GenAISpanProcessor from ai-sdk wrapper missing onStart method");
        }
    } catch (error) {
        // Check if it's the require() ESM compatibility issue
        if (error.message.includes("require is not defined") ||
            error.message.includes("require is not a function")) {
            throw new Error(`ESM compatibility issue: ${error.message}`);
        }
        throw error;
    }
}

async function testOpenAIWrapperExport() {
    // Test OpenAI wrapper export
    const openaiModule = await import("../../dist/esm/openai-wrapper/index.mjs");

    if (!openaiModule.PaidOpenAI) {
        throw new Error("PaidOpenAI not exported from openai wrapper");
    }
}

async function testAnthropicWrapperExport() {
    // Test Anthropic wrapper export
    const anthropicModule = await import("../../dist/esm/anthropic-wrapper/index.mjs");

    if (!anthropicModule.PaidAnthropic) {
        throw new Error("PaidAnthropic not exported from anthropic wrapper");
    }
}

async function testRequireInESM() {
    // Test that require() is NOT available in pure ESM
    // This verifies we're actually running in ESM mode
    if (typeof require === "function") {
        throw new Error("require() should NOT be available in ESM - test environment is not pure ESM");
    }

    // Try to use require directly - should fail
    let requireWorks = false;
    try {
        const path = require("path");
        requireWorks = true;
    } catch (e) {
        // Expected: require is not defined
        if (!e.message.includes("require is not defined")) {
            throw new Error(`Unexpected error: ${e.message}`);
        }
    }

    if (requireWorks) {
        throw new Error("require() worked in ESM - this should not happen!");
    }
}

async function testAISDKAnthropicInstrumentationInESM() {
    // This test verifies that we detect the Anthropic instrumentation silent failure
    // The ai-sdk-wrapper uses require() to load Anthropic instrumentation,
    // which silently fails in ESM because require() is not available.

    // Read the source file to verify it contains require()
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sourceFile = path.join(__dirname, "../../dist/esm/ai-sdk-wrapper/index.mjs");

    const content = fs.readFileSync(sourceFile, "utf-8");

    // Check if the file contains require() for Anthropic
    const hasRequireForAnthropic = content.includes('require("@arizeai/openinference-instrumentation-anthropic")');

    if (hasRequireForAnthropic) {
        // This is a known issue - require() in ESM will fail silently
        // The test should WARN about this, not fail, since it's a known limitation
        log("  WARNING: ai-sdk-wrapper uses require() for Anthropic instrumentation");
        log("  WARNING: This will silently fail in pure ESM environments");
        log("  WARNING: Anthropic auto-instrumentation will NOT work in ESM");

        // Verify that require actually fails in ESM
        let requireFailed = false;
        try {
            require("@arizeai/openinference-instrumentation-anthropic");
        } catch (e) {
            requireFailed = true;
        }

        if (requireFailed) {
            // This confirms the issue exists
            throw new Error(
                "Anthropic instrumentation uses require() which fails in ESM. " +
                "Consider using dynamic import() for ESM compatibility."
            );
        }
    }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
    log("=".repeat(70));
    log("ESM Compatibility Test");
    log("=".repeat(70));
    log(`Node.js version: ${process.version}`);
    log(`ESM mode: true (.mjs file)`);
    log("");

    log("Testing ESM imports...");
    log("");

    await runTest("Main package export (PaidClient)", testMainExport);
    await runTest("Tracing export (initializeTracing, trace, signal)", testTracingExport);
    await runTest("GenAI Span Processor export", testGenAISpanProcessor);
    await runTest("AI SDK wrapper export (critical - uses require())", testAISDKWrapperExport);
    await runTest("OpenAI wrapper export (PaidOpenAI)", testOpenAIWrapperExport);
    await runTest("Anthropic wrapper export (PaidAnthropic)", testAnthropicWrapperExport);
    await runTest("Verify require() not available in ESM", testRequireInESM);
    await runTest("AI SDK Anthropic instrumentation in ESM (known issue)", testAISDKAnthropicInstrumentationInESM);

    log("");
    log("=".repeat(70));
    log("Test Results Summary");
    log("=".repeat(70));

    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;

    for (const result of results) {
        const status = result.passed ? "PASS" : "FAIL";
        const error = result.error ? ` (${result.error})` : "";
        log(`  [${status}] ${result.test}${error}`);
    }

    log("");
    log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
    log("=".repeat(70));

    if (failed > 0) {
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
