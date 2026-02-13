/**
 * AI SDK Tracing E2E Test
 *
 * This test validates that the AI SDK tracing integration correctly
 * captures telemetry from Vercel AI SDK and attributes it for billing.
 *
 * Test Flow:
 * 1. Initialize AI SDK tracing
 * 2. Make an AI call using generateText with experimental_telemetry enabled
 * 3. Verify the signal appears in the analytics API with correct attribution
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
const PAID_API_BASE_URL = process.env.PAID_API_BASE_URL || "https://api.agentpaid.io";

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

async function getOrganizationId(): Promise<string> {
    const response = await fetch(`${PAID_API_BASE_URL}/api/organizations/organizationId`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${PAID_API_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to get organization ID: ${response.status}`);
    }

    const data = await response.json();
    return data.organizationId;
}

interface SignalOccurrence {
    external_customer_id: string | null;
    external_agent_id: string | null;
    trace_id: string | null;
    data: Record<string, unknown>;
}

interface SignalDetailResponse {
    occurrences: {
        total_count: number;
        data: SignalOccurrence[];
    };
}

async function getSignalDetail(orgId: string, eventName: string): Promise<SignalDetailResponse> {
    const url = `${PAID_API_BASE_URL}/api/analytics/${orgId}/signal/${encodeURIComponent(eventName)}/detail?period=1h&limit=100`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${PAID_API_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to get signal detail: ${response.status} - ${text}`);
    }

    return response.json();
}

async function waitForAttributedSignal(
    orgId: string,
    eventName: string,
    expectedCustomerId: string,
    expectedProductId: string,
    maxWaitMs: number = 60000
): Promise<SignalOccurrence | null> {
    const startTime = Date.now();
    const pollInterval = 3000;

    while (Date.now() - startTime < maxWaitMs) {
        try {
            const detail = await getSignalDetail(orgId, eventName);

            const matchingSignal = detail.occurrences.data.find(
                (occ) =>
                    occ.external_customer_id === expectedCustomerId && occ.external_agent_id === expectedProductId
            );

            if (matchingSignal) {
                return matchingSignal;
            }

            log(`  Waiting for attributed signal... found ${detail.occurrences.total_count} signals, none matching yet`);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            log(`  Polling... ${message}`);
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    return null;
}

async function main() {
    log("=".repeat(70));
    log("AI SDK Tracing E2E Test");
    log("=".repeat(70));
    log(`Test Run ID: ${testRunId}`);
    log(`Expected Customer ID: ${testCustomerId}`);
    log(`Expected Product ID: ${testProductId}`);
    log("");

    // Step 1: Get organization ID
    log("Step 1: Getting organization ID...");
    const orgId = await getOrganizationId();
    log(`  Organization ID: ${orgId}`);

    // Step 2: Initialize AI SDK tracing
    log("Step 2: Initializing AI SDK tracing...");
    initializeAISDKTracing();
    log("  AI SDK tracing initialized");

    // Step 3: Make an AI call with trace() and experimental_telemetry
    log("Step 3: Making attributed AI SDK call with generateText...");

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

    log(`  AI SDK call completed`);
    log(`  Response: "${result.text}"`);
    log(`  Tokens: input=${result.usage?.promptTokens}, output=${result.usage?.completionTokens}`);

    // Flush traces
    log("  Flushing traces...");
    const provider = getAISDKTracerProvider();
    if (provider) {
        await provider.forceFlush();
    }

    // Step 4: Verify signal attribution
    log("Step 4: Verifying signal attribution in analytics API...");
    log("  (Waiting for signal to be processed...)");

    const eventName = "llm";
    const attributedSignal = await waitForAttributedSignal(orgId, eventName, testCustomerId, testProductId, 60000);

    if (!attributedSignal) {
        log("");
        log("FAILED: Could not find signal with expected attribution");
        log(`  Expected external_customer_id: ${testCustomerId}`);
        log(`  Expected external_agent_id: ${testProductId}`);
        process.exit(1);
    }

    // Step 5: Validate attribution
    log("");
    log("Step 5: Validating attribution...");
    log(`  Found signal with trace_id: ${attributedSignal.trace_id}`);
    log(`  external_customer_id: ${attributedSignal.external_customer_id}`);
    log(`  external_agent_id: ${attributedSignal.external_agent_id}`);

    const customerMatch = attributedSignal.external_customer_id === testCustomerId;
    const productMatch = attributedSignal.external_agent_id === testProductId;

    if (!customerMatch) {
        log(`FAILED: Customer ID mismatch`);
        log(`  Expected: ${testCustomerId}`);
        log(`  Got: ${attributedSignal.external_customer_id}`);
        process.exit(1);
    }

    if (!productMatch) {
        log(`FAILED: Product ID mismatch`);
        log(`  Expected: ${testProductId}`);
        log(`  Got: ${attributedSignal.external_agent_id}`);
        process.exit(1);
    }

    // Check for GenAI attributes
    const data = attributedSignal.data;
    const hasModelInfo = data && (
        "gen_ai.request.model" in data ||
        "gen_ai.response.model" in data ||
        "ai.model.id" in data
    );
    const hasTokenInfo = data && (
        "gen_ai.usage.input_tokens" in data ||
        "gen_ai.usage.output_tokens" in data ||
        "ai.usage.promptTokens" in data
    );

    log(`  Has model info: ${hasModelInfo}`);
    log(`  Has token info: ${hasTokenInfo}`);

    log("");
    log("=".repeat(70));
    log("SUCCESS: AI SDK trace attribution verified!");
    log("=".repeat(70));
    log("The AI SDK integration correctly attributes traces to external customer and product IDs.");
    log("");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
