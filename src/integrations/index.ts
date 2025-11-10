/**
 * Paid SDK Integrations
 *
 * This module provides simplified helpers for common Paid operations
 * with defaults and reduced boilerplate.
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
 * const customer = await createCustomerWithDefaults(client, {
 *   externalId: 'user-123',
 *   email: 'user@example.com'
 * });
 *
 * const order = await createOrderWithDefaults(client, {
 *   customerId: customer.id,
 *   customerExternalId: 'user-123',
 *   agentExternalId: 'agent-prod'
 * });
 * ```
 */

export * from "./controllers/index.js";

export { initializePaidClient, getOrganizationId, type PaidClientConfig } from "./client.js";

export type {
  Address,
  CustomerData,
  CompleteCustomerData,
  ContactData,
  OrderConfig,
  CompleteOrderConfig,
  OrderLineConfig,
  OrderOptions as HelperOptions,
  CustomerCreationResult,
  ContactCreationResult,
  OrderCreationResult,
} from "./types.js";

export type {
  ProvisioningConfig,
  ProvisioningResult,
} from "./controllers/provision-users.js";
