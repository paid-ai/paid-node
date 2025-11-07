/**
 * Contact creation helpers for Paid SDK
 * Simplifies contact creation with smart defaults
 */

import type { PaidClient } from "../../Client.js";
import type {
    ContactData,
    ContactCreationResult,
    Address
} from "../types.js";
import * as Paid from "../../api/index.js";

/**
 * Generate default values for missing contact fields
 */
function generateContactDefaults(data: ContactData): Required<Omit<ContactData, 'billingAddress'>> & {
    billingAddress: Required<Address>;
} {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    // Generate email if not provided
    const email = data.email || `contact_${timestamp}@example.com`;

    // Generate name components if not provided
    const firstName = data.firstName || "Joe";
    const lastName = data.lastName || "Bloggs";

    // Generate phone if not provided
    const phone = data.phone || "";

    // Generate salutation if not provided
    const salutation = data.salutation || "Mr";

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
        customerExternalId: data.customerExternalId,
        email,
        firstName,
        lastName,
        phone,
        salutation,
        billingAddress,
    };
}

/**
 * Create a contact with smart defaults for missing fields
 *
 * This helper generates reasonable placeholder values for any missing data,
 * making it easy to create contacts for prototyping and development.
 *
 * @param client - PaidClient instance
 * @param data - Contact data (only customerExternalId is required)
 * @returns Created contact with ID
 *
 * @example
 * ```typescript
 * const contact = await createContactWithDefaults(client, {
 *   customerExternalId: 'user-123',
 *   email: 'user@example.com'
 * });
 * // Generates: firstName, lastName, address, etc.
 * ```
 */
export async function createContactWithDefaults(
    client: PaidClient,
    data: ContactData
): Promise<ContactCreationResult> {
    const completeData = generateContactDefaults(data);

    const contact = await client.contacts.create({
        customerExternalId: completeData.customerExternalId,
        salutation: completeData.salutation as Paid.Salutation,
        firstName: completeData.firstName,
        lastName: completeData.lastName,
        email: completeData.email,
        phone: completeData.phone,
        billingStreet: completeData.billingAddress.line1,
        billingCity: completeData.billingAddress.city,
        billingCountry: completeData.billingAddress.country,
        billingPostalCode: completeData.billingAddress.zipCode,
    });

    if (!contact.id) {
        throw new Error("Contact created but missing ID");
    }

    return {
        id: contact.id,
    };
}

/**
 * Create a contact with explicit data (no defaults)
 *
 * This helper requires all contact data to be provided explicitly.
 * Use this when you have complete contact information.
 *
 * @param client - PaidClient instance
 * @param data - Complete contact data
 * @returns Created contact with ID
 *
 * @example
 * ```typescript
 * const contact = await createContact(client, {
 *   customerExternalId: 'user-123',
 *   email: 'john@example.com',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   phone: '+1234567890',
 *   salutation: 'Mr',
 *   billingAddress: {
 *     line1: '123 Main St',
 *     line2: 'Suite 100',
 *     city: 'San Francisco',
 *     state: 'CA',
 *     zipCode: '94105',
 *     country: 'US'
 *   }
 * });
 * ```
 */
export async function createContact(
    client: PaidClient,
    data: Required<Omit<ContactData, 'billingAddress'>> & {
        billingAddress: Required<Address>;
    }
): Promise<ContactCreationResult> {
    const contact = await client.contacts.create({
        customerExternalId: data.customerExternalId,
        salutation: data.salutation as Paid.Salutation,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        billingStreet: data.billingAddress.line1,
        billingCity: data.billingAddress.city,
        billingCountry: data.billingAddress.country,
        billingPostalCode: data.billingAddress.zipCode,
    });

    if (!contact.id) {
        throw new Error("Contact created but missing ID");
    }

    return {
        id: contact.id,
    };
}
