/**
 * Provisioning helpers for Paid SDK
 * Orchestrates customer + contact + order creation in one operation
 */

import type { PaidClient } from "../../Client.js";
import { createCustomerWithDefaults } from "./customer-helpers.js";
import { createContactWithDefaults } from "./contact-helpers.js";
import { createOrderWithDefaults } from "./order-helpers.js";
import type {
    CustomerData,
    ContactData,
    CustomerCreationResult,
    ContactCreationResult,
    OrderCreationResult,
    HelperOptions
} from "../types.js";

/**
 * Configuration for user provisioning
 */
export interface ProvisioningConfig {
    /**
     * Customer data (externalId required)
     */
    customer: CustomerData;

    /**
     * Contact data (optional, will use customer email if not provided)
     */
    contact?: Partial<ContactData>;

    /**
     * Agent external ID for order creation (optional)
     * If not provided, no order will be created
     */
    agentExternalId?: string;

    /**
     * Options for order creation
     */
    orderOptions?: HelperOptions;
}

/**
 * Result from user provisioning
 */
export interface ProvisioningResult {
    customer: CustomerCreationResult;
    contact: ContactCreationResult;
    order?: OrderCreationResult;
}

/**
 * Provision a new user with customer, contact, and optionally order
 *
 * This is a high-level helper that orchestrates the creation of all
 * necessary Paid entities for a new user in one operation.
 *
 * @param client - PaidClient instance
 * @param config - Provisioning configuration
 * @returns Result with created customer, contact, and optional order
 *
 * @example
 * ```typescript
 * const result = await provisionNewUser(client, {
 *   customer: {
 *     externalId: 'user-123',
 *     email: 'user@example.com'
 *   },
 *   agentExternalId: 'agent-prod'
 * });
 * // Creates customer, contact, and order with smart defaults
 * ```
 */
export async function provisionNewUser(
    client: PaidClient,
    config: ProvisioningConfig
): Promise<ProvisioningResult> {
    // 1. Create customer
    const customer = await createCustomerWithDefaults(client, config.customer);

    // 2. Create contact (use customer email if not provided)
    const contactData: ContactData = {
        customerExternalId: config.customer.externalId,
        email: config.contact?.email || config.customer.email,
        firstName: config.contact?.firstName,
        lastName: config.contact?.lastName,
        phone: config.contact?.phone,
        billingAddress: config.contact?.billingAddress,
        salutation: config.contact?.salutation,
    };

    const contact = await createContactWithDefaults(client, contactData);

    // 3. Create order if agent ID provided
    let order: OrderCreationResult | undefined;
    if (config.agentExternalId) {
        order = await createOrderWithDefaults(
            client,
            {
                customerId: customer.id,
                customerExternalId: config.customer.externalId,
                agentExternalId: config.agentExternalId,
                billingContactId: contact.id,
            },
            config.orderOptions
        );
    }

    return {
        customer,
        contact,
        order,
    };
}

/**
 * Simplified provisioning using just email
 *
 * This is the most minimal provisioning method, taking only an email
 * and optional agent ID.
 *
 * @param client - PaidClient instance
 * @param email - User email (used as externalId)
 * @param agentExternalId - Optional agent external ID for order creation
 * @param orderOptions - Optional order creation options
 * @returns Result with created customer, contact, and optional order
 *
 * @example
 * ```typescript
 * const result = await provisionUserByEmail(client, 'user@example.com', 'agent-prod');
 * // Creates everything with minimal input
 * ```
 */
export async function provisionUserByEmail(
    client: PaidClient,
    email: string,
    agentExternalId?: string,
    orderOptions?: HelperOptions
): Promise<ProvisioningResult> {
    return provisionNewUser(client, {
        customer: {
            externalId: email,
            email,
        },
        agentExternalId,
        orderOptions,
    });
}
