/**
 * SDK Tracing E2E Test Script
 *
 * This script tests the Paid SDK tracing functionality with real AI providers.
 * It tests signal capture capabilities for OpenAI and Anthropic providers.
 *
 * Required environment variables:
 * - PAID_API_KEY: API key for Paid tracing and REST API
 * - OPENAI_API_KEY: API key for OpenAI (optional, skips OpenAI tests if not set)
 * - ANTHROPIC_API_KEY: API key for Anthropic (optional, skips Anthropic tests if not set)
 *
 * Test coverage:
 * 1. Tracing initialization
 * 2. OpenAI wrapper (PaidOpenAI) - chat completions, embeddings
 * 3. Anthropic wrapper (PaidAnthropic) - messages
 * 4. Signal capture with trace() and signal()
 * 5. Signals REST API (createSignals)
 */

import { PaidClient } from "../../dist/cjs/index.js";
import { initializeTracing, trace, signal } from "../../dist/cjs/tracing/index.js";
import { PaidOpenAI } from "../../dist/cjs/openai-wrapper/index.js";
import { PaidAnthropic } from "../../dist/cjs/anthropic-wrapper/index.js";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Environment variables
const PAID_API_KEY = process.env.PAID_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!PAID_API_KEY) {
  console.error("Error: PAID_API_KEY environment variable is required");
  process.exit(1);
}

// Get commit hash and readable timestamp for test data identification
const commitHash = process.env.COMMIT_HASH || "local";
const now = new Date();
const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
const timeStr = now.toISOString().slice(11, 16).replace(":", ""); // HHMM
const testPrefix = `SDK-TRACING-${dateStr}-${timeStr}-${commitHash}`;

// Track test resources for cleanup
const createdResources: {
  customerId?: string;
  productId?: string;
} = {};

// Results tracking
interface TestResult {
  test: string;
  passed: boolean;
  error?: string;
  skipped?: boolean;
}

const results: TestResult[] = [];

async function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// ============================================================================
// Helper Functions
// ============================================================================

async function setupTestResources(client: PaidClient) {
  log("Setting up test resources...");

  // Create a test customer
  try {
    const customer = await client.customers.createCustomer({
      name: `${testPrefix}-Customer`,
      externalId: `${testPrefix}-external-customer`,
      billingAddress: {
        line1: "123 Test Street",
        city: "Test City",
        country: "US",
      },
    });
    createdResources.customerId = customer.id;
    log(`  Created test customer: ${customer.id}`);
  } catch (error: any) {
    log(`  Failed to create test customer: ${error.message}`);
    throw error;
  }

  // Create a test product
  try {
    const product = await client.products.createProduct({
      name: `${testPrefix}-Product`,
      externalId: `${testPrefix}-external-product`,
      description: "Test product for tracing e2e tests",
    });
    createdResources.productId = product.id;
    log(`  Created test product: ${product.id}`);
  } catch (error: any) {
    log(`  Failed to create test product: ${error.message}`);
    throw error;
  }
}

async function cleanupTestResources(client: PaidClient) {
  log("Cleaning up test resources...");

  if (createdResources.customerId) {
    try {
      await client.customers.deleteCustomerById({ id: createdResources.customerId });
      log(`  Deleted customer: ${createdResources.customerId}`);
    } catch (error: any) {
      log(`  Failed to delete customer: ${error.message}`);
    }
  }

  // Note: Products don't have a delete endpoint
}

// ============================================================================
// Tracing Tests
// ============================================================================

async function testTracingInitialization(): Promise<boolean> {
  log("Testing: Tracing Initialization");

  try {
    initializeTracing(PAID_API_KEY);
    log("  Tracing initialized successfully");
    return true;
  } catch (error: any) {
    throw new Error(`Tracing initialization failed: ${error.message}`);
  }
}

async function testOpenAIChatCompletion(): Promise<boolean> {
  log("Testing: OpenAI Chat Completion with Tracing");

  if (!OPENAI_API_KEY) {
    log("  Skipped: OPENAI_API_KEY not set");
    return true; // Mark as passed but skipped
  }

  const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

  try {
    const response = await trace(
      {
        externalCustomerId: `${testPrefix}-external-customer`,
        externalProductId: `${testPrefix}-external-product`,
      },
      async () => {
        const paidOpenAI = new PaidOpenAI(openaiClient);
        const completion = await paidOpenAI.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Say 'Hello from E2E test' in exactly 5 words." }],
          max_tokens: 20,
        });
        return completion;
      }
    );

    // Validate response structure
    if (!response.id) {
      throw new Error("Response missing id");
    }
    if (!response.choices || response.choices.length === 0) {
      throw new Error("Response missing choices");
    }
    if (!response.usage) {
      throw new Error("Response missing usage information");
    }

    // Validate usage tracking
    if (typeof response.usage.prompt_tokens !== "number" || response.usage.prompt_tokens <= 0) {
      throw new Error(`Invalid prompt_tokens: ${response.usage.prompt_tokens}`);
    }
    if (typeof response.usage.completion_tokens !== "number" || response.usage.completion_tokens <= 0) {
      throw new Error(`Invalid completion_tokens: ${response.usage.completion_tokens}`);
    }

    log(`  Completion successful - Model: ${response.model}`);
    log(`  Token usage - Input: ${response.usage.prompt_tokens}, Output: ${response.usage.completion_tokens}`);
    return true;
  } catch (error: any) {
    throw new Error(`OpenAI chat completion failed: ${error.message}`);
  }
}

async function testOpenAIEmbeddings(): Promise<boolean> {
  log("Testing: OpenAI Embeddings with Tracing");

  if (!OPENAI_API_KEY) {
    log("  Skipped: OPENAI_API_KEY not set");
    return true;
  }

  const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

  try {
    const response = await trace(
      {
        externalCustomerId: `${testPrefix}-external-customer`,
        externalProductId: `${testPrefix}-external-product`,
      },
      async () => {
        const paidOpenAI = new PaidOpenAI(openaiClient);
        const embedding = await paidOpenAI.embeddings.create({
          model: "text-embedding-3-small",
          input: "This is a test text for embedding generation.",
        });
        return embedding;
      }
    );

    // Validate response structure
    if (!response.data || response.data.length === 0) {
      throw new Error("Response missing embedding data");
    }
    if (!response.usage) {
      throw new Error("Response missing usage information");
    }

    const embeddingVector = response.data[0].embedding;
    if (!Array.isArray(embeddingVector) || embeddingVector.length === 0) {
      throw new Error("Invalid embedding vector");
    }

    log(`  Embedding successful - Model: ${response.model}`);
    log(`  Vector dimensions: ${embeddingVector.length}, Tokens: ${response.usage.prompt_tokens}`);
    return true;
  } catch (error: any) {
    throw new Error(`OpenAI embeddings failed: ${error.message}`);
  }
}

async function testAnthropicMessages(): Promise<boolean> {
  log("Testing: Anthropic Messages with Tracing");

  if (!ANTHROPIC_API_KEY) {
    log("  Skipped: ANTHROPIC_API_KEY not set");
    return true;
  }

  const anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  try {
    const response = await trace(
      {
        externalCustomerId: `${testPrefix}-external-customer`,
        externalProductId: `${testPrefix}-external-product`,
      },
      async () => {
        const paidAnthropic = new PaidAnthropic(anthropicClient);
        const message = await paidAnthropic.messages.create({
          model: "claude-3-5-haiku-latest",
          max_tokens: 50,
          messages: [{ role: "user", content: "Say 'Hello from E2E test' in exactly 5 words." }],
        });
        return message;
      }
    );

    // Validate response structure
    if (!response.id) {
      throw new Error("Response missing id");
    }
    if (!response.content || response.content.length === 0) {
      throw new Error("Response missing content");
    }
    if (!response.usage) {
      throw new Error("Response missing usage information");
    }

    // Validate usage tracking
    if (typeof response.usage.input_tokens !== "number" || response.usage.input_tokens <= 0) {
      throw new Error(`Invalid input_tokens: ${response.usage.input_tokens}`);
    }
    if (typeof response.usage.output_tokens !== "number" || response.usage.output_tokens <= 0) {
      throw new Error(`Invalid output_tokens: ${response.usage.output_tokens}`);
    }

    log(`  Message successful - Model: ${response.model}`);
    log(`  Token usage - Input: ${response.usage.input_tokens}, Output: ${response.usage.output_tokens}`);
    return true;
  } catch (error: any) {
    throw new Error(`Anthropic messages failed: ${error.message}`);
  }
}

async function testSignalCapture(): Promise<boolean> {
  log("Testing: Signal Capture with trace() and signal()");

  if (!OPENAI_API_KEY) {
    log("  Skipped: OPENAI_API_KEY not set (needed for signal context)");
    return true;
  }

  const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });

  try {
    await trace(
      {
        externalCustomerId: `${testPrefix}-external-customer`,
        externalProductId: `${testPrefix}-external-product`,
      },
      async () => {
        // Make an API call to establish cost context
        const paidOpenAI = new PaidOpenAI(openaiClient);
        await paidOpenAI.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 5,
        });

        // Send a signal with cost tracing enabled
        signal("e2e_test_signal", true, {
          test_id: testPrefix,
          provider: "openai",
          action: "signal_capture_test",
        });

        // Send another signal without cost tracing
        signal("e2e_test_event", false, {
          event_type: "test_completed",
        });
      }
    );

    log("  Signal capture completed successfully");
    return true;
  } catch (error: any) {
    throw new Error(`Signal capture failed: ${error.message}`);
  }
}

async function testMultiProviderTracing(): Promise<boolean> {
  log("Testing: Multi-Provider Tracing in Single Trace Context");

  if (!OPENAI_API_KEY || !ANTHROPIC_API_KEY) {
    log("  Skipped: Both OPENAI_API_KEY and ANTHROPIC_API_KEY required");
    return true;
  }

  const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
  const anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  try {
    const result = await trace(
      {
        externalCustomerId: `${testPrefix}-external-customer`,
        externalProductId: `${testPrefix}-external-product`,
      },
      async () => {
        const paidOpenAI = new PaidOpenAI(openaiClient);
        const paidAnthropic = new PaidAnthropic(anthropicClient);

        // Call OpenAI
        const openaiResponse = await paidOpenAI.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Say 'OpenAI'" }],
          max_tokens: 10,
        });

        // Call Anthropic
        const anthropicResponse = await paidAnthropic.messages.create({
          model: "claude-3-5-haiku-latest",
          max_tokens: 10,
          messages: [{ role: "user", content: "Say 'Anthropic'" }],
        });

        // Send a signal that combines both providers
        signal("multi_provider_test", true, {
          openai_tokens: openaiResponse.usage?.total_tokens,
          anthropic_tokens:
            (anthropicResponse.usage?.input_tokens || 0) + (anthropicResponse.usage?.output_tokens || 0),
        });

        return {
          openai: {
            model: openaiResponse.model,
            tokens: openaiResponse.usage?.total_tokens,
          },
          anthropic: {
            model: anthropicResponse.model,
            tokens: (anthropicResponse.usage?.input_tokens || 0) + (anthropicResponse.usage?.output_tokens || 0),
          },
        };
      }
    );

    log(`  Multi-provider tracing successful`);
    log(`  OpenAI: ${result.openai.model} (${result.openai.tokens} tokens)`);
    log(`  Anthropic: ${result.anthropic.model} (${result.anthropic.tokens} tokens)`);
    return true;
  } catch (error: any) {
    throw new Error(`Multi-provider tracing failed: ${error.message}`);
  }
}

// ============================================================================
// Signals REST API Tests
// ============================================================================

async function testSignalsAPI(client: PaidClient): Promise<boolean> {
  log("Testing: Signals REST API (createSignals)");

  if (!createdResources.customerId) {
    log("  Skipped: No customer created for signals test");
    return false;
  }

  try {
    // Test 1: Create a single signal with customerId
    const singleSignalResponse = await client.signals.createSignals({
      signals: [
        {
          eventName: `${testPrefix}_openai_completion`,
          customer: { customerId: createdResources.customerId },
          attribution: createdResources.productId ? { productId: createdResources.productId } : undefined,
          data: {
            provider: "openai",
            model: "gpt-4o-mini",
            input_tokens: 100,
            output_tokens: 50,
          },
          idempotencyKey: `${testPrefix}_single_1`,
        },
      ],
    });

    if (singleSignalResponse.ingested !== 1) {
      throw new Error(`Expected 1 ingested signal, got ${singleSignalResponse.ingested}`);
    }
    log(`  Single signal created: ingested=${singleSignalResponse.ingested}`);

    // Test 2: Create multiple signals for different providers
    const multiSignalResponse = await client.signals.createSignals({
      signals: [
        {
          eventName: `${testPrefix}_openai_embedding`,
          customer: { customerId: createdResources.customerId },
          attribution: createdResources.productId ? { productId: createdResources.productId } : undefined,
          data: {
            provider: "openai",
            model: "text-embedding-3-small",
            input_tokens: 20,
          },
          idempotencyKey: `${testPrefix}_multi_openai`,
        },
        {
          eventName: `${testPrefix}_anthropic_message`,
          customer: { customerId: createdResources.customerId },
          attribution: createdResources.productId ? { productId: createdResources.productId } : undefined,
          data: {
            provider: "anthropic",
            model: "claude-3-5-haiku-latest",
            input_tokens: 80,
            output_tokens: 30,
          },
          idempotencyKey: `${testPrefix}_multi_anthropic`,
        },
      ],
    });

    if (multiSignalResponse.ingested !== 2) {
      throw new Error(`Expected 2 ingested signals, got ${multiSignalResponse.ingested}`);
    }
    log(`  Multiple signals created: ingested=${multiSignalResponse.ingested}`);

    // Test 3: Test idempotency (duplicate signal)
    const duplicateResponse = await client.signals.createSignals({
      signals: [
        {
          eventName: `${testPrefix}_openai_completion`,
          customer: { customerId: createdResources.customerId },
          data: { provider: "openai" },
          idempotencyKey: `${testPrefix}_single_1`, // Same key as before
        },
      ],
    });

    if (duplicateResponse.duplicates !== 1) {
      throw new Error(`Expected 1 duplicate signal, got ${duplicateResponse.duplicates}`);
    }
    log(`  Idempotency test passed: duplicates=${duplicateResponse.duplicates}`);

    // Test 4: Create signal with externalCustomerId
    const externalIdResponse = await client.signals.createSignals({
      signals: [
        {
          eventName: `${testPrefix}_external_id_test`,
          customer: { externalCustomerId: `${testPrefix}-external-customer` },
          attribution: { externalProductId: `${testPrefix}-external-product` },
          data: {
            test: "external_id_attribution",
          },
          idempotencyKey: `${testPrefix}_external_id`,
        },
      ],
    });

    if (externalIdResponse.ingested !== 1) {
      throw new Error(`Expected 1 ingested signal with externalId, got ${externalIdResponse.ingested}`);
    }
    log(`  External ID signal created: ingested=${externalIdResponse.ingested}`);

    return true;
  } catch (error: any) {
    throw new Error(`Signals API test failed: ${error.message}`);
  }
}

async function testSignalsAPIProviderEvents(client: PaidClient): Promise<boolean> {
  log("Testing: Signals API with Provider-Specific Events");

  if (!createdResources.customerId) {
    log("  Skipped: No customer created");
    return false;
  }

  const providerEvents = [
    {
      provider: "openai",
      events: [
        { name: "chat_completion", model: "gpt-4o", input: 150, output: 200 },
        { name: "embedding", model: "text-embedding-3-large", input: 500 },
        { name: "image_generation", model: "dall-e-3", count: 1 },
      ],
    },
    {
      provider: "anthropic",
      events: [
        { name: "message", model: "claude-3-5-sonnet-latest", input: 200, output: 150 },
        { name: "message_with_cache", model: "claude-3-5-sonnet-latest", input: 1000, output: 100, cache_read: 800 },
      ],
    },
  ];

  try {
    for (const provider of providerEvents) {
      for (const event of provider.events) {
        const signalData: Record<string, unknown> = {
          provider: provider.provider,
          model: event.model,
        };

        if ("input" in event) signalData.input_tokens = event.input;
        if ("output" in event) signalData.output_tokens = event.output;
        if ("cache_read" in event) signalData.cache_read_input_tokens = event.cache_read;
        if ("count" in event) signalData.image_count = event.count;

        const response = await client.signals.createSignals({
          signals: [
            {
              eventName: `${testPrefix}_${provider.provider}_${event.name}`,
              customer: { customerId: createdResources.customerId },
              attribution: createdResources.productId ? { productId: createdResources.productId } : undefined,
              data: signalData,
              idempotencyKey: `${testPrefix}_${provider.provider}_${event.name}_${Date.now()}`,
            },
          ],
        });

        if (response.ingested !== 1) {
          throw new Error(
            `Failed to ingest ${provider.provider}/${event.name} signal: ingested=${response.ingested}`
          );
        }
      }
      log(`  ${provider.provider}: ${provider.events.length} event types tested`);
    }

    return true;
  } catch (error: any) {
    throw new Error(`Provider events test failed: ${error.message}`);
  }
}

// ============================================================================
// Main Test Runner
// ============================================================================

async function runTest(name: string, fn: () => Promise<boolean>, skippable = false) {
  try {
    const passed = await fn();
    results.push({ test: name, passed, skipped: skippable && !passed });
  } catch (error: any) {
    log(`  ERROR: ${error.message}`);
    results.push({ test: name, passed: false, error: error.message });
  }
}

async function main() {
  log("=".repeat(70));
  log("Starting Paid SDK Tracing E2E Tests");
  log("=".repeat(70));
  log(`Test Prefix: ${testPrefix}`);
  log(`OpenAI API Key: ${OPENAI_API_KEY ? "Set" : "Not Set"}`);
  log(`Anthropic API Key: ${ANTHROPIC_API_KEY ? "Set" : "Not Set"}`);
  log("");

  // Initialize the REST API client
  const client = new PaidClient({
    token: PAID_API_KEY,
  });

  // Setup test resources
  try {
    await setupTestResources(client);
  } catch (error: any) {
    log(`Failed to setup test resources: ${error.message}`);
    process.exit(1);
  }

  log("");
  log("=".repeat(70));
  log("Running Tracing Tests");
  log("=".repeat(70));

  // Run tracing tests
  await runTest("Tracing Initialization", testTracingInitialization);
  await runTest("OpenAI Chat Completion", testOpenAIChatCompletion, true);
  await runTest("OpenAI Embeddings", testOpenAIEmbeddings, true);
  await runTest("Anthropic Messages", testAnthropicMessages, true);
  await runTest("Signal Capture", testSignalCapture, true);
  await runTest("Multi-Provider Tracing", testMultiProviderTracing, true);

  log("");
  log("=".repeat(70));
  log("Running Signals REST API Tests");
  log("=".repeat(70));

  // Run signals API tests
  await runTest("Signals API Basic", () => testSignalsAPI(client));
  await runTest("Signals API Provider Events", () => testSignalsAPIProviderEvents(client));

  // Cleanup
  log("");
  log("=".repeat(70));
  log("Cleaning up test data");
  log("=".repeat(70));

  await cleanupTestResources(client);

  // Summary
  log("");
  log("=".repeat(70));
  log("Test Results Summary");
  log("=".repeat(70));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed && !r.skipped).length;
  const skipped = results.filter((r) => r.skipped).length;

  for (const result of results) {
    let status = result.passed ? "PASS" : "FAIL";
    if (result.skipped) status = "SKIP";
    const error = result.error ? ` (${result.error})` : "";
    log(`  [${status}] ${result.test}${error}`);
  }

  log("");
  log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed} | Skipped: ${skipped}`);
  log("=".repeat(70));

  // Give some time for spans to be exported
  log("");
  log("Waiting for trace export...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
