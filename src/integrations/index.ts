/**
 * Paid SDK Integrations
 *
 * This module provides simplified helpers for common Paid operations
 * with smart defaults and reduced boilerplate.
 *
 * @module integrations
 *
 * @example
 * ```typescript
 * import { PaidClient } from '@paid-ai/paid-node';
 * import { createCustomerWithDefaults, createOrderWithDefaults } from '@paid-ai/paid-node/integrations';
 *
 * const client = new PaidClient({ token: 'pk_xxx' });
 *
 * // Create customer with minimal data
 * const customer = await createCustomerWithDefaults(client, {
 *   externalId: 'user-123',
 *   email: 'user@example.com'
 * });
 *
 * // Create order with smart defaults
 * const order = await createOrderWithDefaults(client, {
 *   customerId: customer.id,
 *   customerExternalId: 'user-123',
 *   agentExternalId: 'agent-prod'
 * });
 * ```
 */

// Export all helpers
export * from "./helpers/index.js";

// Export client utilities
export { initializePaidClient, getOrganizationId, type PaidClientConfig } from "./client.js";

// Export types
export type {
    Address,
    CustomerData,
    CompleteCustomerData,
    ContactData,
    OrderConfig,
    CompleteOrderConfig,
    OrderLineConfig,
    HelperOptions,
    CustomerCreationResult,
    ContactCreationResult,
    OrderCreationResult,
} from "./types.js";

export type {
    ProvisioningConfig,
    ProvisioningResult,
} from "./helpers/provisioning-helpers.js";
