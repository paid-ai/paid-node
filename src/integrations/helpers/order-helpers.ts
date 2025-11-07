/**
 * Order creation helpers for Paid SDK
 * Simplifies order creation with smart defaults
 */

import type { PaidClient } from "../../Client.js";
import type {
    OrderConfig,
    CompleteOrderConfig,
    OrderCreationResult,
    HelperOptions,
    OrderLineConfig
} from "../types.js";

/**
 * Generate default values for missing order fields
 */
function generateOrderDefaults(
    config: OrderConfig,
    options: HelperOptions = {}
): CompleteOrderConfig {
    const { defaultDurationDays = 365 } = options;

    // Generate dates
    const startDate = config.startDate || new Date().toISOString().split("T")[0];
    const endDate = config.endDate ||
        new Date(Date.now() + defaultDurationDays * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

    // Generate order metadata
    const name = config.name || "Subscription Order";
    const description = config.description || "Annual subscription";
    const currency = config.currency || "USD";

    // Generate order lines with defaults
    const orderLines: Required<OrderLineConfig>[] = config.orderLines?.map(line => ({
        agentExternalId: line.agentExternalId,
        name: line.name || name,
        description: line.description || description,
    })) || [{
        agentExternalId: config.agentExternalId,
        name,
        description,
    }];

    return {
        customerId: config.customerId,
        customerExternalId: config.customerExternalId,
        billingContactId: config.billingContactId,
        agentExternalId: config.agentExternalId,
        name,
        description,
        startDate,
        endDate,
        currency,
        orderLines,
    };
}

/**
 * Create an order with smart defaults for missing fields
 *
 * This helper generates reasonable defaults for dates, names, and other fields,
 * making it easy to create orders for prototyping and development.
 *
 * @param client - PaidClient instance
 * @param config - Order configuration (customerId, customerExternalId, agentExternalId required)
 * @param options - Additional options for order creation
 * @returns Created order with ID
 *
 * @example
 * ```typescript
 * const order = await createOrderWithDefaults(client, {
 *   customerId: 'cus_123',
 *   customerExternalId: 'user-123',
 *   agentExternalId: 'agent-prod'
 * });
 * // Generates: startDate, endDate (1 year), name, description, currency (USD)
 * ```
 */
export async function createOrderWithDefaults(
    client: PaidClient,
    config: OrderConfig,
    options: HelperOptions = {}
): Promise<OrderCreationResult> {
    const { autoActivate = true } = options;
    const completeConfig = generateOrderDefaults(config, options);

    const order = await client.orders.create({
        customerId: completeConfig.customerId,
        customerExternalId: completeConfig.customerExternalId,
        billingContactId: completeConfig.billingContactId,
        name: completeConfig.name,
        description: completeConfig.description,
        startDate: completeConfig.startDate,
        endDate: completeConfig.endDate,
        currency: completeConfig.currency,
        orderLines: completeConfig.orderLines.map(line => ({
            agentExternalId: line.agentExternalId,
            name: line.name,
            description: line.description,
        })),
    });

    if (!order.id) {
        throw new Error("Order created but missing ID");
    }

    // Auto-activate if requested
    if (autoActivate && order.creationState === "draft") {
        try {
            await client.orders.activate(order.id);
            return {
                id: order.id,
                creationState: "active",
            };
        } catch (activationError) {
            console.error(
                `Error activating order ${order.id}:`,
                activationError instanceof Error
                    ? activationError.message
                    : "Unknown error"
            );
            // Return order even if activation fails
            return {
                id: order.id,
                creationState: order.creationState,
            };
        }
    }

    return {
        id: order.id,
        creationState: order.creationState,
    };
}

/**
 * Create an order with explicit configuration (no defaults)
 *
 * This helper requires all order data to be provided explicitly.
 * Use this when you have complete order information.
 *
 * @param client - PaidClient instance
 * @param config - Complete order configuration
 * @param options - Additional options for order creation
 * @returns Created order with ID
 *
 * @example
 * ```typescript
 * const order = await createOrder(client, {
 *   customerId: 'cus_123',
 *   customerExternalId: 'user-123',
 *   billingContactId: 'contact_123',
 *   agentExternalId: 'agent-prod',
 *   name: 'Pro Plan Subscription',
 *   description: 'Monthly subscription to Pro plan',
 *   startDate: '2024-01-01',
 *   endDate: '2025-01-01',
 *   currency: 'USD',
 *   orderLines: [{
 *     agentExternalId: 'agent-prod',
 *     name: 'Pro Plan',
 *     description: 'Pro plan features'
 *   }]
 * }, { autoActivate: true });
 * ```
 */
export async function createOrder(
    client: PaidClient,
    config: Required<OrderConfig>,
    options: HelperOptions = {}
): Promise<OrderCreationResult> {
    const { autoActivate = true } = options;

    const order = await client.orders.create({
        customerId: config.customerId,
        customerExternalId: config.customerExternalId,
        billingContactId: config.billingContactId,
        name: config.name,
        description: config.description,
        startDate: config.startDate,
        endDate: config.endDate,
        currency: config.currency,
        orderLines: config.orderLines.map(line => ({
            agentExternalId: line.agentExternalId,
            name: line.name,
            description: line.description,
        })),
    });

    if (!order.id) {
        throw new Error("Order created but missing ID");
    }

    // Auto-activate if requested
    if (autoActivate && order.creationState === "draft") {
        try {
            await client.orders.activate(order.id);
            return {
                id: order.id,
                creationState: "active",
            };
        } catch (activationError) {
            console.error(
                `Error activating order ${order.id}:`,
                activationError instanceof Error
                    ? activationError.message
                    : "Unknown error"
            );
            return {
                id: order.id,
                creationState: order.creationState,
            };
        }
    }

    return {
        id: order.id,
        creationState: order.creationState,
    };
}
