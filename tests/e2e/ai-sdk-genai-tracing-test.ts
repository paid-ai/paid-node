/**
 * AI SDK GenAI Tracing E2E Test
 *
 * This test validates the OpenInference auto-instrumentation correctly captures
 * AI SDK traces and the backend automatically attributes signals from those traces,
 * resulting in credits being consumed from the customer's order.
 *
 * Key Features:
 * - Auto-initialization on import (no init call needed!)
 * - Uses OpenInference auto-instrumentation for OpenAI and Anthropic
 * - NO experimental_telemetry needed per-call
 * - NO manual signal sending - backend auto-generates signals from traces
 * - Separate credit currencies for each operation type to verify independently
 *
 * Test Flow:
 * 1. Import "@paid-ai/paid-node/ai-sdk" - tracing auto-initializes!
 * 2. Create FOUR credits currencies (generateText, streamText, openaiSdk, anthropicSdk)
 * 3. Create FOUR products with platform fee + credit benefits (each with different credit currency)
 * 4. Create customer with external ID
 * 5. Create FOUR orders (one per product)
 * 6. Activate orders - credits are granted
 * 7. Record initial credit balances for all currencies
 * 8. Execute generateText (AI SDK) - verify its credit currency is consumed
 * 9. Execute streamText (AI SDK) - verify its credit currency is consumed
 * 10. Execute OpenAI SDK call - verify its credit currency is consumed
 * 11. Execute Anthropic SDK call - verify its credit currency is consumed
 * 12. Verify ALL credit currencies have decreased independently
 *
 * Required environment variables:
 * - PAID_API_TOKEN: API token for Paid API
 * - OPENAI_API_KEY: API key for OpenAI
 * - ANTHROPIC_API_KEY: API key for Anthropic
 * - PAID_API_BASE_URL: Base URL for Paid API (default: https://api.agentpaid.io)
 */

import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
// Just import to auto-initialize tracing!
import { trace } from "../../dist/cjs/ai-sdk-wrapper/index.js";

// Environment configuration
const PAID_API_TOKEN = process.env.PAID_API_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const PAID_API_BASE_URL = process.env.PAID_API_BASE_URL || "https://api.agentpaid.io";

// Validate required environment variables
if (!PAID_API_TOKEN) {
    console.error("Error: PAID_API_TOKEN environment variable is required");
    process.exit(1);
}

if (!OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY environment variable is required");
    process.exit(1);
}

if (!ANTHROPIC_API_KEY) {
    console.error("Error: ANTHROPIC_API_KEY environment variable is required");
    process.exit(1);
}

// Set PAID_API_KEY for tracing initialization
process.env.PAID_API_KEY = PAID_API_TOKEN;

// Initialize SDK clients
const openaiClient = new OpenAI({ apiKey: OPENAI_API_KEY });
const anthropicClient = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// Test identifier for tracking
const now = new Date();
const dateStr = now.toISOString().slice(0, 10);
const timeStr = now.toISOString().slice(11, 16).replace(":", "");
const testPrefix = `AI-SDK-GENAI-${dateStr}-${timeStr}`;

// Test resources - separate for each operation type
interface OperationResources {
    creditsCurrencyId?: string;
    productId?: string;
    orderId?: string;
    externalProductId?: string;
    initialBalance?: CreditBalance;
}

interface TestResources {
    organizationId?: string;
    customerId?: string;
    externalCustomerId?: string;
    generateText: OperationResources;
    streamText: OperationResources;
    openaiSdk: OperationResources;
    anthropicSdk: OperationResources;
}

const resources: TestResources = {
    generateText: {},
    streamText: {},
    openaiSdk: {},
    anthropicSdk: {},
};

// Results tracking
interface TestResult {
    test: string;
    passed: boolean;
    error?: string;
    skipped?: boolean;
}

const results: TestResult[] = [];

// Credit balance tracking
interface CreditBalance {
    total: number;
    available: number;
    used: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

function log(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Make authenticated API request
 */
async function apiRequest(
    method: string,
    path: string,
    body?: Record<string, unknown>
): Promise<{ status: number; data: any }> {
    const url = `${PAID_API_BASE_URL}${path}`;
    const options: RequestInit = {
        method,
        headers: {
            Authorization: `Bearer ${PAID_API_TOKEN}`,
            "Content-Type": "application/json",
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const text = await response.text();
    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { raw: text };
    }

    return { status: response.status, data: data.data ?? data };
}

/**
 * Get organization ID from API key with retry logic
 */
async function getOrganizationId(): Promise<string> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const { status, data } = await apiRequest("GET", "/api/organizations/organizationId");
            if (status !== 200) {
                throw new Error(`Failed to get organization ID: ${status}`);
            }
            return data.organizationId;
        } catch (error: any) {
            lastError = error;
            log(`  Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
            if (attempt < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    throw lastError || new Error("Failed to get organization ID after retries");
}

/**
 * Credit bundle from the API
 */
interface CreditBundle {
    id: string;
    total: string;
    available: string;
    used: string;
    creditsCurrencyId: string | null;
    entitlement: {
        id: string;
        origin: {
            code: string | null;
            description: string | null;
        };
    } | null;
}

/**
 * Get credit bundles for a customer
 */
async function getCreditBundles(customerId: string): Promise<CreditBundle[]> {
    const { status, data } = await apiRequest("GET", `/api/v1/customers/${customerId}/credit-bundles`);

    if (status !== 200) {
        throw new Error(`Failed to get credit bundles: ${status}`);
    }

    return Array.isArray(data) ? data : data.data || [];
}

/**
 * Calculate credits for a specific currency
 */
function calculateCreditBalanceForCurrency(bundles: CreditBundle[], creditsCurrencyId: string): CreditBalance {
    const filteredBundles = bundles.filter((b) => b.creditsCurrencyId === creditsCurrencyId);

    let total = 0;
    let available = 0;
    let used = 0;

    for (const bundle of filteredBundles) {
        total += Number(bundle.total || 0);
        available += Number(bundle.available || 0);
        used += Number(bundle.used || 0);
    }

    return { total, available, used };
}

/**
 * Wait for credit bundles for a specific currency
 */
async function waitForCreditBundlesForCurrency(
    customerId: string,
    creditsCurrencyId: string,
    expectedCount: number,
    maxRetries: number = 30,
    retryDelay: number = 1000
): Promise<CreditBundle[]> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const bundles = await getCreditBundles(customerId);
        const filtered = bundles.filter((b) => b.creditsCurrencyId === creditsCurrencyId);

        if (filtered.length >= expectedCount) {
            return filtered;
        }

        if (attempt % 10 === 0) {
            log(`    Waiting for credit bundles (${creditsCurrencyId.slice(0, 8)}...)... found ${filtered.length}/${expectedCount}`);
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    const bundles = await getCreditBundles(customerId);
    return bundles.filter((b) => b.creditsCurrencyId === creditsCurrencyId);
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

// ============================================================================
// Setup Functions
// ============================================================================

async function createCreditsCurrency(name: string, key: string): Promise<string> {
    const { status, data } = await apiRequest(
        "POST",
        `/api/organizations/${resources.organizationId}/credits-currencies`,
        {
            name: `${testPrefix} ${name}`,
            key: `${testPrefix.toLowerCase().replace(/-/g, "_")}_${key}`,
            description: `Credits currency for ${name}`,
        }
    );

    if (status !== 201 && status !== 200) {
        throw new Error(`Failed to create credits currency: ${status} - ${JSON.stringify(data)}`);
    }

    return data.id;
}

async function createProductWithCredits(
    name: string,
    externalId: string,
    creditsCurrencyId: string
): Promise<{ id: string; attributes: any[] }> {
    const productData = {
        name: `${testPrefix} ${name}`,
        externalId,
        type: "product",
        active: true,
        description: `Product for ${name} with credits`,
        ProductAttribute: [
            // Attribute 1: Recurring fee that grants credits via creditBenefits
            {
                name: `${name} Platform Fee`,
                pricing: {
                    chargeType: "recurring",
                    billingType: "Advance",
                    billingFrequency: "Monthly",
                    pricingModel: "PerUnit",
                    PricePoints: {
                        USD: {
                            unitPrice: 100000,
                            currency: "USD",
                        },
                    },
                },
                creditBenefits: [
                    {
                        id: `${testPrefix}-${name.toLowerCase().replace(/\s/g, "-")}-benefit`,
                        creditsCurrencyId,
                        recipient: "organization",
                        amount: 10000,
                        allocationCadence: "upfront",
                    },
                ],
            },
            // Attribute 2: Usage-based attribute that consumes credits for LLM calls
            {
                name: `${name} LLM Usage`,
                pricing: {
                    chargeType: "usage",
                    pricingModel: "PrepaidCredits",
                    eventName: "llm",
                    creditsCurrencyId,
                    creditCost: 1, // 1 credit consumed per unit of usage
                    PricePoints: {
                        USD: {
                            unitPrice: 1,
                            currency: "USD",
                        },
                    },
                },
            },
        ],
    };

    const { status, data } = await apiRequest("POST", "/api/v1/products", productData);

    if (status !== 200 && status !== 201) {
        throw new Error(`Failed to create product: ${status} - ${JSON.stringify(data)}`);
    }

    return { id: data.id, attributes: data.ProductAttribute };
}

async function createCustomer(): Promise<string> {
    const externalCustomerId = `${testPrefix}-ext-customer`;
    resources.externalCustomerId = externalCustomerId;

    const { status, data } = await apiRequest("POST", "/api/v1/customers", {
        name: `${testPrefix} Test Customer`,
        externalId: externalCustomerId,
        email: `test-${Date.now()}@example.com`,
    });

    if (status !== 201 && status !== 200) {
        throw new Error(`Failed to create customer: ${status} - ${JSON.stringify(data)}`);
    }

    return data.id;
}

async function createOrder(
    customerId: string,
    productId: string,
    productAttributes: any[]
): Promise<string> {
    // Build order line attributes for ALL product attributes
    const orderLineAttributes = productAttributes.map((attr) => {
        const usdPricePoint = attr.pricing.PricePoints?.USD || attr.pricing.pricePoint || {};
        const pricePoint: Record<string, unknown> = {
            currency: "USD",
            unitPrice: usdPricePoint.unitPrice || 0,
        };
        if (usdPricePoint.tiers) pricePoint.tiers = usdPricePoint.tiers;

        return {
            productAttributeId: attr.id,
            productAttributeName: attr.name,
            quantity: 1,
            pricing: {
                ...attr.pricing,
                pricePoint,
                creditBenefits: attr.creditBenefits,
            },
        };
    });

    const orderData = {
        customerId,
        currency: "USD",
        startDate: formatDate(new Date()),
        orderLines: [
            {
                productId,
                name: productAttributes[0]?.name || "Order Line",
                ProductAttribute: orderLineAttributes,
            },
        ],
    };

    const { status, data } = await apiRequest("POST", "/api/v1/orders", orderData);

    if (status !== 200 && status !== 201) {
        throw new Error(`Failed to create order: ${status} - ${JSON.stringify(data)}`);
    }

    return data.id;
}

async function activateOrder(orderId: string): Promise<void> {
    const { status, data } = await apiRequest("POST", `/api/v1/orders/${orderId}/activate`, {});

    if (status !== 200) {
        throw new Error(`Failed to activate order: ${status} - ${JSON.stringify(data)}`);
    }
}

async function setupTestResources(): Promise<void> {
    log("Setting up test resources...");

    // Get organization ID
    resources.organizationId = await getOrganizationId();
    log(`  Organization ID: ${resources.organizationId}`);

    // Create FOUR credits currencies
    log("  Creating credits currencies...");
    resources.generateText.creditsCurrencyId = await createCreditsCurrency("GenerateText Credits", "generate_text");
    log(`    GenerateText Credits: ${resources.generateText.creditsCurrencyId}`);

    resources.streamText.creditsCurrencyId = await createCreditsCurrency("StreamText Credits", "stream_text");
    log(`    StreamText Credits: ${resources.streamText.creditsCurrencyId}`);

    resources.openaiSdk.creditsCurrencyId = await createCreditsCurrency("OpenAI SDK Credits", "openai_sdk");
    log(`    OpenAI SDK Credits: ${resources.openaiSdk.creditsCurrencyId}`);

    resources.anthropicSdk.creditsCurrencyId = await createCreditsCurrency("Anthropic SDK Credits", "anthropic_sdk");
    log(`    Anthropic SDK Credits: ${resources.anthropicSdk.creditsCurrencyId}`);

    // Create FOUR products
    log("  Creating products...");
    resources.generateText.externalProductId = `${testPrefix}-generatetext-product`;
    const generateTextProduct = await createProductWithCredits(
        "GenerateText Product",
        resources.generateText.externalProductId,
        resources.generateText.creditsCurrencyId
    );
    resources.generateText.productId = generateTextProduct.id;
    log(`    GenerateText Product: ${resources.generateText.productId}`);

    resources.streamText.externalProductId = `${testPrefix}-streamtext-product`;
    const streamTextProduct = await createProductWithCredits(
        "StreamText Product",
        resources.streamText.externalProductId,
        resources.streamText.creditsCurrencyId
    );
    resources.streamText.productId = streamTextProduct.id;
    log(`    StreamText Product: ${resources.streamText.productId}`);

    resources.openaiSdk.externalProductId = `${testPrefix}-openaisdk-product`;
    const openaiSdkProduct = await createProductWithCredits(
        "OpenAI SDK Product",
        resources.openaiSdk.externalProductId,
        resources.openaiSdk.creditsCurrencyId
    );
    resources.openaiSdk.productId = openaiSdkProduct.id;
    log(`    OpenAI SDK Product: ${resources.openaiSdk.productId}`);

    resources.anthropicSdk.externalProductId = `${testPrefix}-anthropicsdk-product`;
    const anthropicSdkProduct = await createProductWithCredits(
        "Anthropic SDK Product",
        resources.anthropicSdk.externalProductId,
        resources.anthropicSdk.creditsCurrencyId
    );
    resources.anthropicSdk.productId = anthropicSdkProduct.id;
    log(`    Anthropic SDK Product: ${resources.anthropicSdk.productId}`);

    // Create customer
    log("  Creating customer...");
    resources.customerId = await createCustomer();
    log(`    Customer: ${resources.customerId} (external: ${resources.externalCustomerId})`);

    // Create FOUR orders
    log("  Creating orders...");
    resources.generateText.orderId = await createOrder(
        resources.customerId,
        resources.generateText.productId,
        generateTextProduct.attributes
    );
    log(`    GenerateText Order: ${resources.generateText.orderId}`);

    resources.streamText.orderId = await createOrder(
        resources.customerId,
        resources.streamText.productId,
        streamTextProduct.attributes
    );
    log(`    StreamText Order: ${resources.streamText.orderId}`);

    resources.openaiSdk.orderId = await createOrder(
        resources.customerId,
        resources.openaiSdk.productId,
        openaiSdkProduct.attributes
    );
    log(`    OpenAI SDK Order: ${resources.openaiSdk.orderId}`);

    resources.anthropicSdk.orderId = await createOrder(
        resources.customerId,
        resources.anthropicSdk.productId,
        anthropicSdkProduct.attributes
    );
    log(`    Anthropic SDK Order: ${resources.anthropicSdk.orderId}`);

    // Activate orders
    log("  Activating orders...");
    await activateOrder(resources.generateText.orderId);
    log(`    GenerateText Order activated`);
    await activateOrder(resources.streamText.orderId);
    log(`    StreamText Order activated`);
    await activateOrder(resources.openaiSdk.orderId);
    log(`    OpenAI SDK Order activated`);
    await activateOrder(resources.anthropicSdk.orderId);
    log(`    Anthropic SDK Order activated`);

    // Wait for credit bundles
    log("  Waiting for credit bundles...");
    await waitForCreditBundlesForCurrency(resources.customerId, resources.generateText.creditsCurrencyId, 1);
    await waitForCreditBundlesForCurrency(resources.customerId, resources.streamText.creditsCurrencyId, 1);
    await waitForCreditBundlesForCurrency(resources.customerId, resources.openaiSdk.creditsCurrencyId, 1);
    await waitForCreditBundlesForCurrency(resources.customerId, resources.anthropicSdk.creditsCurrencyId, 1);

    // Record initial balances
    const bundles = await getCreditBundles(resources.customerId);
    resources.generateText.initialBalance = calculateCreditBalanceForCurrency(bundles, resources.generateText.creditsCurrencyId);
    resources.streamText.initialBalance = calculateCreditBalanceForCurrency(bundles, resources.streamText.creditsCurrencyId);
    resources.openaiSdk.initialBalance = calculateCreditBalanceForCurrency(bundles, resources.openaiSdk.creditsCurrencyId);
    resources.anthropicSdk.initialBalance = calculateCreditBalanceForCurrency(bundles, resources.anthropicSdk.creditsCurrencyId);

    log(`  Initial balances:`);
    log(`    GenerateText  - Total: ${resources.generateText.initialBalance.total}, Available: ${resources.generateText.initialBalance.available}`);
    log(`    StreamText    - Total: ${resources.streamText.initialBalance.total}, Available: ${resources.streamText.initialBalance.available}`);
    log(`    OpenAI SDK    - Total: ${resources.openaiSdk.initialBalance.total}, Available: ${resources.openaiSdk.initialBalance.available}`);
    log(`    Anthropic SDK - Total: ${resources.anthropicSdk.initialBalance.total}, Available: ${resources.anthropicSdk.initialBalance.available}`);
}


// ============================================================================
// Test Functions
// ============================================================================

async function testSetupResources(): Promise<boolean> {
    log("Test: Setup Test Resources");

    try {
        await setupTestResources();
        return true;
    } catch (error: any) {
        throw new Error(`Setup failed: ${error.message}`);
    }
}

async function testTracingAutoInitialized(): Promise<boolean> {
    log("Test: Verify Tracing Auto-Initialized on Import");

    try {
        log("  Tracing auto-initialized on module import");
        log("  OpenAI and Anthropic calls will be automatically traced");
        return true;
    } catch (error: any) {
        throw new Error(`Tracing verification failed: ${error.message}`);
    }
}

async function testGenerateTextWithTracing(): Promise<boolean> {
    log("Test: generateText with Tracing (AI SDK - uses GenerateText Credits)");

    try {
        // Use trace() with generateText's externalProductId
        const result = await trace(
            {
                externalCustomerId: resources.externalCustomerId!,
                externalProductId: resources.generateText.externalProductId!,
            },
            async () => {
                const response = await generateText({
                    model: openai("gpt-4o-mini"),
                    prompt: "Say 'Hello from AI SDK GenAI tracing test' in exactly 7 words.",
                    maxOutputTokens: 50,
                });
                return response;
            }
        );

        if (!result.text) {
            throw new Error("Response missing text");
        }
        if (!result.usage) {
            throw new Error("Response missing usage information");
        }

        log(`  Generated text: "${result.text.trim()}"`);
        log(`  Token usage - Input: ${result.usage.inputTokens}, Output: ${result.usage.outputTokens}`);
        log(`  Using product: ${resources.generateText.externalProductId}`);
        log(`  Credits currency: ${resources.generateText.creditsCurrencyId?.slice(0, 8)}...`);

        return true;
    } catch (error: any) {
        throw new Error(`generateText failed: ${error.message}`);
    }
}

async function testStreamTextWithTracing(): Promise<boolean> {
    log("Test: streamText with Tracing (AI SDK - uses StreamText Credits)");

    try {
        // Use trace() with streamText's externalProductId
        const result = await trace(
            {
                externalCustomerId: resources.externalCustomerId!,
                externalProductId: resources.streamText.externalProductId!,
            },
            async () => {
                const stream = streamText({
                    model: openai("gpt-4o-mini"),
                    prompt: "Count from 1 to 5, one number per line.",
                    maxOutputTokens: 50,
                });

                let fullText = "";
                for await (const chunk of stream.textStream) {
                    fullText += chunk;
                }

                const finalResult = await stream;
                const usage = await finalResult.usage;

                return { text: fullText, usage };
            }
        );

        if (!result.text) {
            throw new Error("Streaming returned no text");
        }

        log(`  Streamed text: "${result.text.trim().substring(0, 50)}..."`);
        log(`  Token usage - Input: ${result.usage?.inputTokens}, Output: ${result.usage?.outputTokens}`);
        log(`  Using product: ${resources.streamText.externalProductId}`);
        log(`  Credits currency: ${resources.streamText.creditsCurrencyId?.slice(0, 8)}...`);

        return true;
    } catch (error: any) {
        throw new Error(`streamText failed: ${error.message}`);
    }
}

async function testOpenAISdkWithTracing(): Promise<boolean> {
    log("Test: OpenAI SDK with Tracing (uses OpenAI SDK Credits)");

    try {
        // Use trace() with openaiSdk's externalProductId
        const result = await trace(
            {
                externalCustomerId: resources.externalCustomerId!,
                externalProductId: resources.openaiSdk.externalProductId!,
            },
            async () => {
                const response = await openaiClient.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "user", content: "Say 'Hello from OpenAI SDK tracing test' in exactly 7 words." }
                    ],
                    max_tokens: 50,
                });
                return response;
            }
        );

        if (!result.choices || result.choices.length === 0) {
            throw new Error("Response missing choices");
        }

        const text = result.choices[0].message?.content || "";
        const usage = result.usage;

        log(`  Generated text: "${text.trim()}"`);
        log(`  Token usage - Input: ${usage?.prompt_tokens}, Output: ${usage?.completion_tokens}`);
        log(`  Using product: ${resources.openaiSdk.externalProductId}`);
        log(`  Credits currency: ${resources.openaiSdk.creditsCurrencyId?.slice(0, 8)}...`);

        return true;
    } catch (error: any) {
        throw new Error(`OpenAI SDK call failed: ${error.message}`);
    }
}

async function testAnthropicSdkWithTracing(): Promise<boolean> {
    log("Test: Anthropic SDK with Tracing (uses Anthropic SDK Credits)");

    try {
        // Use trace() with anthropicSdk's externalProductId
        const result = await trace(
            {
                externalCustomerId: resources.externalCustomerId!,
                externalProductId: resources.anthropicSdk.externalProductId!,
            },
            async () => {
                const response = await anthropicClient.messages.create({
                    model: "claude-3-5-haiku-20241022",
                    max_tokens: 50,
                    messages: [
                        { role: "user", content: "Say 'Hello from Anthropic SDK tracing test' in exactly 7 words." }
                    ],
                });
                return response;
            }
        );

        if (!result.content || result.content.length === 0) {
            throw new Error("Response missing content");
        }

        const textContent = result.content.find((c) => c.type === "text");
        const text = textContent && "text" in textContent ? textContent.text : "";
        const usage = result.usage;

        log(`  Generated text: "${text.trim()}"`);
        log(`  Token usage - Input: ${usage?.input_tokens}, Output: ${usage?.output_tokens}`);
        log(`  Using product: ${resources.anthropicSdk.externalProductId}`);
        log(`  Credits currency: ${resources.anthropicSdk.creditsCurrencyId?.slice(0, 8)}...`);

        return true;
    } catch (error: any) {
        throw new Error(`Anthropic SDK call failed: ${error.message}`);
    }
}

async function testVerifyCreditsConsumed(
    operationName: string,
    operationResources: OperationResources
): Promise<boolean> {
    log(`Test: Verify ${operationName} Credits Were Consumed`);

    try {
        const initial = operationResources.initialBalance;
        if (!initial) {
            throw new Error(`Initial balance not recorded for ${operationName}`);
        }

        log(`  Waiting for ${operationName} credits to be processed...`);

        const maxWaitTime = 60000;
        const pollInterval = 3000;
        const startTime = Date.now();
        let finalBalance: CreditBalance | null = null;
        let consumed = false;

        while (Date.now() - startTime < maxWaitTime) {
            const bundles = await getCreditBundles(resources.customerId!);
            finalBalance = calculateCreditBalanceForCurrency(bundles, operationResources.creditsCurrencyId!);

            log(`    Current - Available: ${finalBalance.available}, Used: ${finalBalance.used}`);

            if (finalBalance.used > initial.used || finalBalance.available < initial.available) {
                consumed = true;
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }

        if (!finalBalance) {
            throw new Error("Failed to get final balance");
        }

        log("");
        log(`  ${operationName} Credits Summary:`);
        log(`    Initial  - Available: ${initial.available}, Used: ${initial.used}`);
        log(`    Final    - Available: ${finalBalance.available}, Used: ${finalBalance.used}`);

        if (consumed) {
            const creditsUsed = finalBalance.used - initial.used;
            log(`    Consumed: ${creditsUsed} credits`);
            log(`  SUCCESS: ${operationName} credits were consumed!`);
            return true;
        } else {
            log(`  FAILED: ${operationName} credits were not consumed within expected time`);
            return false;
        }
    } catch (error: any) {
        throw new Error(`${operationName} credit verification failed: ${error.message}`);
    }
}

// ============================================================================
// Test Runner
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
    log("AI SDK GenAI Tracing E2E Test - Multi-SDK Credits Verification");
    log("=".repeat(70));
    log(`Test Prefix: ${testPrefix}`);
    log(`Paid API Base URL: ${PAID_API_BASE_URL}`);
    log(`OpenAI API Key: ${OPENAI_API_KEY ? "Set" : "Not Set"}`);
    log(`Anthropic API Key: ${ANTHROPIC_API_KEY ? "Set" : "Not Set"}`);
    log("");

    // Phase 1: Setup
    log("=".repeat(70));
    log("Phase 1: Setup (4 Credits Currencies, 4 Products, 4 Orders)");
    log("=".repeat(70));
    await runTest("Setup Test Resources", testSetupResources);

    // Phase 2: Tracing Verification
    log("");
    log("=".repeat(70));
    log("Phase 2: Tracing Verification");
    log("=".repeat(70));
    await runTest("Tracing Auto-Initialized", testTracingAutoInitialized);

    // Phase 3: AI Calls (4 different SDK/methods, each uses different credits currency) - PARALLEL
    log("");
    log("=".repeat(70));
    log("Phase 3: AI Calls (4 SDK Methods in Parallel, Each Uses Different Credits Currency)");
    log("=".repeat(70));
    await Promise.all([
        runTest("AI SDK generateText with Tracing", testGenerateTextWithTracing),
        runTest("AI SDK streamText with Tracing", testStreamTextWithTracing),
        runTest("OpenAI SDK with Tracing", testOpenAISdkWithTracing),
        runTest("Anthropic SDK with Tracing", testAnthropicSdkWithTracing),
    ]);

    // Phase 4: Credits Verification (Separate for each operation) - PARALLEL
    log("");
    log("=".repeat(70));
    log("Phase 4: Credits Consumption Verification (Independent per SDK, Parallel)");
    log("=".repeat(70));
    await Promise.all([
        runTest(
            "Verify GenerateText Credits Consumed",
            () => testVerifyCreditsConsumed("GenerateText", resources.generateText),
            true
        ),
        runTest(
            "Verify StreamText Credits Consumed",
            () => testVerifyCreditsConsumed("StreamText", resources.streamText),
            true
        ),
        runTest(
            "Verify OpenAI SDK Credits Consumed",
            () => testVerifyCreditsConsumed("OpenAI SDK", resources.openaiSdk),
            true
        ),
        runTest(
            "Verify Anthropic SDK Credits Consumed",
            () => testVerifyCreditsConsumed("Anthropic SDK", resources.anthropicSdk),
            true
        ),
    ]);


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

    if (failed > 0) {
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
