import { PaidClient } from "../../Client.js";
import type {
  CustomerData,
  CompleteCustomerData,
  CustomerCreationResult,
  Address
} from "../types.js";
import { createHandler } from "../utils/base-handler.js";

/**
 * Generate placeholder values for missing customer fields
 * Creates valid but fake data for rapid prototyping
 */
function generateCustomerDefaults(data: CustomerData): CompleteCustomerData {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);

  const email = data.email || `user_${timestamp}@example.com`;
  const name = data.name || `User ${randomId}`;
  const nameParts = name.split(" ");
  const firstName = data.firstName || nameParts[0] || "Joe";
  const lastName = data.lastName || nameParts.slice(1).join(" ") || "Bloggs";

  const billingAddress: Required<Address> = {
    line1: data.billingAddress?.line1 || "123 Placeholder Street",
    line2: data.billingAddress?.line2 || "",
    city: data.billingAddress?.city || "London",
    state: data.billingAddress?.state || "London",
    zipCode: data.billingAddress?.zipCode || "SW1A 1AA",
    country: data.billingAddress?.country || "UK",
  };

  return {
    externalId: data.externalId,
    email,
    name,
    firstName,
    lastName,
    company: data.company || "",
    phone: data.phone || "",
    billingAddress,
    metadata: data.metadata || {},
  };
}

/**
 * Internal helper to create a customer
 */
async function createCustomerInternal(
  client: PaidClient,
  data: Required<Omit<CustomerData, 'firstName' | 'lastName' | 'company' | 'phone' | 'metadata' | 'billingAddress'>> & {
    billingAddress: Required<Address>;
  }
): Promise<CustomerCreationResult> {
  const customer = await client.customers.create({
    externalId: data.externalId,
    name: data.name,
    billingAddress: {
      line1: data.billingAddress.line1,
      line2: data.billingAddress.line2,
      city: data.billingAddress.city,
      state: data.billingAddress.state,
      zipCode: data.billingAddress.zipCode,
      country: data.billingAddress.country,
    },
  });

  if (!customer.id) {
    throw new Error("Customer created but missing ID");
  }

  return {
    id: customer.id,
    externalId: data.externalId,
  };
}

/**
 * Create a customer with defaults for missing fields
 *
 * This helper generates reasonable placeholder values for any missing data,
 * making it easy to create customers for prototyping and development.
 *
 * @param client - PaidClient instance
 * @param data - Customer data (only externalId is required)
 * @returns Created customer with ID
 *
 * @example
 * ```typescript
 * const customer = await createCustomerWithDefaults(client, {
 *   externalId: 'user-123',
 *   email: 'user@example.com'
 * });
 * // Generates: name, address, etc.
 * ```
 */
export async function createCustomerWithDefaults(
  client: PaidClient,
  data: CustomerData
): Promise<CustomerCreationResult> {
  const completeData = generateCustomerDefaults(data);
  return createCustomerInternal(client, completeData);
}

/**
 * Create a customer with explicit data (NO defaults applied)
 *
 * Required fields: externalId, name, email, and complete billingAddress
 * (line1, line2, city, state, zipCode, country)
 *
 * Use createCustomerWithDefaults() if you want automatic default values for missing fields.
 *
 * @param client - PaidClient instance
 * @param data - Complete customer data with ALL required fields
 * @returns Created customer with ID
 * @throws Error if any required fields are missing
 *
 * @example
 * ```typescript
 * const customer = await createCustomer(client, {
 *   externalId: 'user-123',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   billingAddress: {
 *     line1: '123 Main St',
 *     line2: '',
 *     city: 'San Francisco',
 *     state: 'CA',
 *     zipCode: '94105',
 *     country: 'US'
 *   }
 * });
 * ```
 */
export async function createCustomer(
  client: PaidClient,
  data: Required<Omit<CustomerData, 'firstName' | 'lastName' | 'company' | 'phone' | 'metadata' | 'billingAddress'>> & {
    billingAddress: Required<Address>;
  }
): Promise<CustomerCreationResult> {
  return createCustomerInternal(client, data);
}

/**
 * Create a framework-agnostic handler for customer creation
 *
 * This handler can be used with any framework adapter.
 *
 * @returns Handler function
 */
export function createCustomersHandler() {
  return createHandler<CustomerData, CustomerCreationResult>(
    async (client, body) => {
      if (!body.externalId) {
        throw new Error("externalId is required");
      }

      const customer = await createCustomerWithDefaults(client, body);
      return { success: true, data: customer };
    },
    { requiredFields: ['externalId'] }
  );
}
