/**
 * Customer creation helpers for Paid SDK
 * Simplifies customer creation with smart defaults
 */

import type { PaidClient } from "../../Client.js";
import type {
    CustomerData,
    CompleteCustomerData,
    CustomerCreationResult,
    Address
} from "../types.js";

/**
 * Generate placeholder values for missing customer fields
 * Creates valid but fake data for rapid prototyping
 */
function generateCustomerDefaults(data: CustomerData): CompleteCustomerData {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    // Generate name components
    const email = data.email || `user_${timestamp}@example.com`;
    const name = data.name || `User ${randomId}`;
    const nameParts = name.split(" ");
    const firstName = data.firstName || nameParts[0] || "Joe";
    const lastName = data.lastName || nameParts.slice(1).join(" ") || "Bloggs";

    // Generate address defaults
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
 * Create a customer with smart defaults for missing fields
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

    const customer = await client.customers.create({
        externalId: completeData.externalId,
        name: completeData.name,
        billingAddress: {
            line1: completeData.billingAddress.line1,
            line2: completeData.billingAddress.line2,
            city: completeData.billingAddress.city,
            state: completeData.billingAddress.state,
            zipCode: completeData.billingAddress.zipCode,
            country: completeData.billingAddress.country,
        },
    });

    if (!customer.id) {
        throw new Error("Customer created but missing ID");
    }

    return {
        id: customer.id,
        externalId: completeData.externalId,
    };
}

/**
 * Create a customer with explicit data (no defaults)
 *
 * This helper requires all customer data to be provided explicitly.
 * Use this when you have complete customer information.
 *
 * @param client - PaidClient instance
 * @param data - Complete customer data
 * @returns Created customer with ID
 *
 * @example
 * ```typescript
 * const customer = await createCustomer(client, {
 *   externalId: 'user-123',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   billingAddress: {
 *     line1: '123 Main St',
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
