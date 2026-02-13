/**
 * Trace Attribution E2E Test
 *
 * This test proves that SDK traces can be attributed to external customer and product IDs.
 * It validates that when using trace() with externalCustomerId and externalProductId,
 * the resulting signals in the analytics API contain the correct attribution.
 *
 * Required environment variables:
 * - PAID_API_TOKEN: API token for Paid tracing and REST API
 * - OPENAI_API_KEY: API key for OpenAI
 */

import { paidAutoInstrument, trace } from "../../dist/cjs/tracing/index.js";
import OpenAI from "openai";

const PAID_API_TOKEN = process.env.PAID_API_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PAID_API_BASE_URL = process.env.PAID_API_BASE_URL || "https://api.paid.ai";

if (!PAID_API_TOKEN) {
  console.error("Error: PAID_API_TOKEN environment variable is required");
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

// Set PAID_API_KEY for auto-instrumentation
process.env.PAID_API_KEY = PAID_API_TOKEN;

// Generate unique test IDs for this run
const testRunId = `attribution-test-${Date.now()}`;
const testCustomerId = `test-customer-${testRunId}`;
const testProductId = `test-product-${testRunId}`;

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

      // Look for a signal with matching attribution
      const matchingSignal = detail.occurrences.data.find(
        (occ) => occ.external_customer_id === expectedCustomerId && occ.external_agent_id === expectedProductId
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
  log("Trace Attribution E2E Test");
  log("=".repeat(70));
  log(`Test Run ID: ${testRunId}`);
  log(`Expected Customer ID: ${testCustomerId}`);
  log(`Expected Product ID: ${testProductId}`);
  log("");

  // Step 1: Get organization ID
  log("Step 1: Getting organization ID...");
  const orgId = await getOrganizationId();
  log(`  Organization ID: ${orgId}`);

  // Step 2: Initialize auto-instrumentation
  log("Step 2: Initializing auto-instrumentation...");
  await paidAutoInstrument({ openai: OpenAI });
  log("  Auto-instrumentation initialized");

  // Step 3: Make an AI call with trace() attribution
  log("Step 3: Making attributed AI call...");
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const result = await trace(
    {
      externalCustomerId: testCustomerId,
      externalProductId: testProductId,
    },
    async () => {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say hello in one word." }],
        max_tokens: 10,
      });
      return completion;
    }
  );

  log(`  AI call completed - Model: ${result.model}`);
  log(`  Tokens: input=${result.usage?.prompt_tokens}, output=${result.usage?.completion_tokens}`);

  // Step 4: Wait for the signal to appear with correct attribution
  log("Step 4: Verifying signal attribution in analytics API...");
  log("  (Waiting for signal to be processed and available in ClickHouse...)");

  // The auto-instrumentation should create signals - let's look for any signal
  // with our specific attribution
  const eventName = "llm"; // Standard event name from OpenInference instrumentation

  const attributedSignal = await waitForAttributedSignal(orgId, eventName, testCustomerId, testProductId, 60000);

  if (!attributedSignal) {
    log("");
    log("FAILED: Could not find signal with expected attribution");
    log(`  Expected external_customer_id: ${testCustomerId}`);
    log(`  Expected external_agent_id: ${testProductId}`);
    process.exit(1);
  }

  // Step 5: Validate the attribution
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

  // Check that signal has model/token data
  const data = attributedSignal.data;
  const hasModelInfo = data && ("model" in data || "llm.model" in data || "gen_ai.request.model" in data);
  const hasTokenInfo =
    data &&
    ("input_tokens" in data ||
      "output_tokens" in data ||
      "llm.token_count.prompt" in data ||
      "gen_ai.usage.prompt_tokens" in data);

  log(`  Has model info: ${hasModelInfo}`);
  log(`  Has token info: ${hasTokenInfo}`);

  log("");
  log("=".repeat(70));
  log("SUCCESS: Trace attribution verified!");
  log("=".repeat(70));
  log("The SDK correctly attributes traces to external customer and product IDs.");
  log("");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
