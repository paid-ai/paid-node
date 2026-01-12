/**
 * Provisioning helpers for Paid SDK
 * Orchestrates customer + contact + order creation in one operation
 */

import type { PaidClient } from "../../Client.js";
import { createCustomerWithDefaults } from "./customers.js";
import { createContactWithDefaults } from "./contacts.js";
import { createOrderWithDefaults } from "./orders.js";
import { createHandler } from "../utils/base-handler.js";
import type {
  ContactData,
  CustomerData,
  OrderCreationResult,
  OrderOptions,
  ProvisioningConfig,
  ProvisioningResult
} from "../types.js";

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
 * // Creates customer, contact, and order with defaults
 * ```
 */
export async function provisionNewUser(
  client: PaidClient,
  config: ProvisioningConfig
): Promise<ProvisioningResult> {
  const customer = await createCustomerWithDefaults(client, config.customer);

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
 * Create a framework-agnostic handler for user provisioning
 *
 * This handler can be used with any framework adapter.
 * Accepts partial provisioning configuration and fills in defaults for missing fields.
 *
 * @param orderOptions - Optional default order creation options
 * @param defaultAgentExternalId - Optional default agent external ID
 * @returns Handler function
 *
 * @example
 * ```typescript
 * // Minimal - just externalId and email
 * {
 *   customer: { externalId: 'org-123', email: 'user@example.com' }
 * }
 *
 * // With full customer data
 * {
 *   customer: {
 *     externalId: 'org-123',
 *     email: 'user@example.com',
 *     name: 'Acme Corp',
 *     billingAddress: { line1: '123 Main St', city: 'NYC', ... }
 *   },
 *   contact: {
 *     firstName: 'John',
 *     lastName: 'Doe'
 *   }
 * }
 * ```
 */
export function createProvisioningHandler(
  orderOptions?: OrderOptions,
  defaultAgentExternalId?: string
): (request: any, response: any, config?: any) => Promise<any> {
  return createHandler<Partial<ProvisioningConfig>, ProvisioningResult>(
    async (client, body): Promise<any> => {
      if (!body.customer) {
        return {
          success: false,
          error: "'customer' is required",
          status: 400,
        };
      }

      const effectiveAgentId =
        body.agentExternalId ||
        defaultAgentExternalId ||
        process.env.NEXT_PUBLIC_PAID_AGENT_ID ||
        process.env.PAID_AGENT_ID;

      const result = await provisionNewUser(client, {
        customer: body.customer,
        contact: body.contact,
        agentExternalId: effectiveAgentId,
        orderOptions: body.orderOptions || orderOptions,
      });

      return {
        success: true,
        data: result,
      };
    },
    { requiredFields: [] }
  );
}
