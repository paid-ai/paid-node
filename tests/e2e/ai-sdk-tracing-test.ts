/**
 * AI SDK Tracing E2E Test
 *
 * This test validates that the AI SDK tracing integration correctly
 * captures telemetry and the billing service consumes credits.
 *
 * Test Flow:
 * 1. Create credits currency, product, customer, and order
 * 2. Activate order to grant credits
 * 3. Make an AI SDK call within trace() context
 * 4. Verify credits are consumed
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

process.env.PAID_API_KEY = PAID_API_TOKEN;

interface TestResources {
    organizationId?: string;
    creditsCurrencyId?: string;
    productId?: string;
    customerId?: string;
    orderId?: string;
    externalCustomerId: string;
    externalProductId: string;
    testPrefix: string;
    initialCreditsUsed: number;
}

interface CreditBundle {
    id: string;
    total: string;
    available: string;
    used: string;
    creditsCurrencyId: string | null;
}

interface CreditBalance {
    total: number;
    available: number;
    used: number;
}

function log(message: string, data?: unknown) {
    console.log(`[${new Date().toISOString()}] ${message}`);
    if (data !== undefined) {
        console.log(JSON.stringify(data, null, 2));
    }
}

async function apiRequest(
    method: string,
    path: string,
    body?: Record<string, unknown>
): Promise<{ status: number; data: unknown }> {
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

    return { status: response.status, data: (data as Record<string, unknown>).data ?? data };
}

async function getOrganizationId(): Promise<string> {
    const { status, data } = await apiRequest("GET", "/api/organizations/organizationId");
    if (status !== 200) {
        throw new Error(`Failed to get organization ID: ${status}`);
    }
    return (data as { organizationId: string }).organizationId;
}

async function getCreditBundles(customerId: string): Promise<CreditBundle[]> {
    const { status, data } = await apiRequest("GET", `/api/v1/customers/${customerId}/credit-bundles`);
    if (status !== 200) {
        throw new Error(`Failed to get credit bundles: ${status}`);
    }
    return Array.isArray(data) ? data : (data as { data?: CreditBundle[] }).data || [];
}

function calculateCreditBalance(bundles: CreditBundle[], creditsCurrencyId: string): CreditBalance {
    const filtered = bundles.filter((b) => b.creditsCurrencyId === creditsCurrencyId);
    return {
        total: filtered.reduce((sum, b) => sum + Number(b.total || 0), 0),
        available: filtered.reduce((sum, b) => sum + Number(b.available || 0), 0),
        used: filtered.reduce((sum, b) => sum + Number(b.used || 0), 0),
    };
}

async function waitForCreditBundles(
    customerId: string,
    creditsCurrencyId: string,
    maxRetries = 30
): Promise<boolean> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const bundles = await getCreditBundles(customerId);
        const filtered = bundles.filter((b) => b.creditsCurrencyId === creditsCurrencyId);
        if (filtered.length > 0) {
            return true;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return false;
}

async function createCreditsCurrency(resources: TestResources): Promise<string> {
    const { status, data } = await apiRequest(
        "POST",
        `/api/organizations/${resources.organizationId}/credits-currencies`,
        {
            name: `${resources.testPrefix} Credits`,
            key: `${resources.testPrefix.toLowerCase().replace(/-/g, "_")}_credits`,
            description: `Test credits for AI SDK E2E tracing test`,
        }
    );

    if (status !== 201 && status !== 200) {
        throw new Error(`Failed to create credits currency: ${status}`);
    }

    return (data as { id: string }).id;
}

async function createProduct(resources: TestResources): Promise<{ id: string; attributes: unknown[] }> {
    const productData = {
        name: `${resources.testPrefix} Product`,
        externalId: resources.externalProductId,
        type: "product",
        active: true,
        description: `AI SDK E2E test product for tracing`,
        ProductAttribute: [
            {
                name: `Platform Fee`,
                pricing: {
                    chargeType: "recurring",
                    billingType: "Advance",
                    billingFrequency: "Monthly",
                    pricingModel: "PerUnit",
                    PricePoints: {
                        USD: { unitPrice: 100000, currency: "USD" },
                    },
                },
                creditBenefits: [
                    {
                        id: `${resources.testPrefix}-credit-benefit`,
                        creditsCurrencyId: resources.creditsCurrencyId,
                        recipient: "organization",
                        amount: 10000,
                        allocationCadence: "upfront",
                    },
                ],
            },
            {
                name: `LLM Usage`,
                pricing: {
                    chargeType: "usage",
                    pricingModel: "PrepaidCredits",
                    eventName: "llm",
                    creditsCurrencyId: resources.creditsCurrencyId,
                    creditCost: 1,
                    PricePoints: {
                        USD: { unitPrice: 1, currency: "USD" },
                    },
                },
            },
        ],
    };

    const { status, data } = await apiRequest("POST", "/api/v1/products", productData);

    if (status !== 200 && status !== 201) {
        throw new Error(`Failed to create product: ${status}`);
    }

    const result = data as { id: string; ProductAttribute: unknown[] };
    return { id: result.id, attributes: result.ProductAttribute };
}

async function createCustomer(resources: TestResources): Promise<string> {
    const { status, data } = await apiRequest("POST", "/api/v1/customers", {
        name: `${resources.testPrefix} Customer`,
        externalId: resources.externalCustomerId,
        email: `test-${Date.now()}@example.com`,
    });

    if (status !== 201 && status !== 200) {
        throw new Error(`Failed to create customer: ${status}`);
    }

    return (data as { id: string }).id;
}

async function createOrder(resources: TestResources, productAttributes: unknown[]): Promise<string> {
    const orderLineAttributes = (productAttributes as Array<{ id: string; name: string; pricing: Record<string, unknown>; creditBenefits?: unknown[] }>).map((attr) => {
        const usdPricePoint = (attr.pricing.PricePoints as Record<string, { unitPrice?: number }>)?.USD ||
                             attr.pricing.pricePoint as { unitPrice?: number } || {};
        return {
            productAttributeId: attr.id,
            productAttributeName: attr.name,
            quantity: 1,
            pricing: {
                ...attr.pricing,
                pricePoint: { currency: "USD", unitPrice: usdPricePoint.unitPrice || 0 },
                creditBenefits: attr.creditBenefits,
            },
        };
    });

    const orderData = {
        customerId: resources.customerId,
        currency: "USD",
        startDate: new Date().toISOString().split("T")[0],
        orderLines: [
            {
                productId: resources.productId,
                name: (productAttributes[0] as { name?: string })?.name || "Order Line",
                ProductAttribute: orderLineAttributes,
            },
        ],
    };

    const { status, data } = await apiRequest("POST", "/api/v1/orders", orderData);

    if (status !== 200 && status !== 201) {
        throw new Error(`Failed to create order: ${status}`);
    }

    return (data as { id: string }).id;
}

async function activateOrder(orderId: string): Promise<void> {
    const { status } = await apiRequest("POST", `/api/v1/orders/${orderId}/activate`, {});
    if (status !== 200) {
        throw new Error(`Failed to activate order: ${status}`);
    }
}

async function main() {
    const now = new Date();
    const testPrefix = `AISDK-${now.toISOString().slice(0, 10)}-${now.toISOString().slice(11, 16).replace(":", "")}`;

    const resources: TestResources = {
        testPrefix,
        externalCustomerId: `${testPrefix}-customer`,
        externalProductId: `${testPrefix}-product`,
        initialCreditsUsed: 0,
    };

    log("=".repeat(70));
    log("AI SDK Tracing E2E Test");
    log("=".repeat(70));
    log(`Test Prefix: ${testPrefix}`);
    log(`API Base URL: ${PAID_API_BASE_URL}`);

    // Phase 1: Setup
    log("\n" + "=".repeat(70));
    log("Phase 1: Setup Test Resources");
    log("=".repeat(70));

    try {
        resources.organizationId = await getOrganizationId();
        log(`Organization ID: ${resources.organizationId}`);

        resources.creditsCurrencyId = await createCreditsCurrency(resources);
        log(`Credits Currency ID: ${resources.creditsCurrencyId}`);

        const product = await createProduct(resources);
        resources.productId = product.id;
        log(`Product ID: ${resources.productId}`);

        resources.customerId = await createCustomer(resources);
        log(`Customer ID: ${resources.customerId}`);

        resources.orderId = await createOrder(resources, product.attributes);
        log(`Order ID: ${resources.orderId}`);

        await activateOrder(resources.orderId);
        log("Order activated");

        const hasBundles = await waitForCreditBundles(resources.customerId, resources.creditsCurrencyId);
        if (!hasBundles) {
            throw new Error("Credit bundles not created after waiting");
        }

        const bundles = await getCreditBundles(resources.customerId);
        const initialBalance = calculateCreditBalance(bundles, resources.creditsCurrencyId);
        resources.initialCreditsUsed = initialBalance.used;
        log("Initial credit balance:", initialBalance);

        if (initialBalance.available === 0) {
            throw new Error("No credits available after order activation");
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        log(`Setup failed: ${message}`);
        process.exit(1);
    }

    // Phase 2: Initialize Tracing and Make AI SDK Call
    log("\n" + "=".repeat(70));
    log("Phase 2: Initialize Tracing and Make AI SDK Call");
    log("=".repeat(70));

    initializeAISDKTracing();
    const tracerProvider = getAISDKTracerProvider();
    if (!tracerProvider) {
        log("ERROR: Tracer provider not initialized");
        process.exit(1);
    }
    log("AI SDK Tracing initialized");

    try {
        log("Making AI SDK call within trace context...");
        log("Trace context:", {
            externalCustomerId: resources.externalCustomerId,
            externalProductId: resources.externalProductId,
        });

        const result = await trace(
            {
                externalCustomerId: resources.externalCustomerId,
                externalProductId: resources.externalProductId,
            },
            async () => {
                return await generateText({
                    model: openai("gpt-4o-mini"),
                    prompt: "Say exactly: 'Hello from AI SDK E2E test'",
                    maxTokens: 20,
                    experimental_telemetry: { isEnabled: true },
                });
            }
        );

        log("AI SDK response:", {
            text: result.text,
            usage: result.usage,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        log(`AI SDK call failed: ${message}`);
        await tracerProvider.shutdown();
        process.exit(1);
    }

    await tracerProvider.forceFlush();
    log("Trace provider flushed");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Phase 3: Verify Credits Consumption
    log("\n" + "=".repeat(70));
    log("Phase 3: Verify Credits Consumption");
    log("=".repeat(70));

    const maxWaitTime = 60000;
    const pollInterval = 5000;
    const startTime = Date.now();
    let creditsConsumed = false;
    let finalBalance: CreditBalance | null = null;

    while (Date.now() - startTime < maxWaitTime) {
        const bundles = await getCreditBundles(resources.customerId!);
        finalBalance = calculateCreditBalance(bundles, resources.creditsCurrencyId!);

        log(`Balance check - Available: ${finalBalance.available}, Used: ${finalBalance.used}`);

        if (finalBalance.used > resources.initialCreditsUsed) {
            creditsConsumed = true;
            break;
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    // Phase 4: Results
    log("\n" + "=".repeat(70));
    log("Test Results");
    log("=".repeat(70));

    await tracerProvider.shutdown();

    if (creditsConsumed && finalBalance) {
        const consumed = finalBalance.used - resources.initialCreditsUsed;
        log(`SUCCESS: Credits consumed: ${consumed}`);
        log("Final balance:", finalBalance);
        process.exit(0);
    } else {
        log("FAILED: Credits were NOT consumed within expected time");
        log("Debug info:", {
            externalCustomerId: resources.externalCustomerId,
            externalProductId: resources.externalProductId,
            customerId: resources.customerId,
            productId: resources.productId,
        });
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
