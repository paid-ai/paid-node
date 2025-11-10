import type { PaidClient } from "../../Client.js";
import type {
  ContactData,
  ContactCreationResult,
  Address
} from "../types.js";
import * as Paid from "../../api/index.js";
import { createHandler } from "../utils/base-handler.js";

function generateContactDefaults(data: ContactData): Required<Omit<ContactData, 'billingAddress'>> & {
  billingAddress: Required<Address>;
} {
  const timestamp = Date.now();

  const email = data.email || `contact_${timestamp}@example.com`;
  const firstName = data.firstName || "Joe";
  const lastName = data.lastName || "Bloggs";
  const phone = data.phone || "";
  const salutation = data.salutation || "Mr";

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
 * Internal helper to create a contact
 */
async function createContactInternal(
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

/**
 * Create a contact with defaults for missing fields
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
  if (!data.customerExternalId) {
    throw new Error("customerExternalId is required");
  }

  const completeData = generateContactDefaults(data);
  return createContactInternal(client, completeData);
}

/**
 * Create a contact with explicit data (NO defaults applied)
 *
 * Required fields: customerExternalId, email, firstName, lastName, phone, salutation,
 * and complete billingAddress (line1, line2, city, state, zipCode, country)
 *
 * Use createContactWithDefaults() if you want automatic default values for missing fields.
 *
 * @param client - PaidClient instance
 * @param data - Complete contact data with ALL required fields
 * @returns Created contact with ID
 * @throws Error if any required fields are missing
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
  return createContactInternal(client, data);
}

/**
 * Create a framework-agnostic handler for contact creation
 *
 * This handler can be used with any framework adapter.
 *
 * @returns Handler function
 */
export function createContactsHandler() {
  return createHandler<ContactData, ContactCreationResult>(
    async (client, body) => {
      const contact = await createContactWithDefaults(client, body);
      return { success: true, data: contact };
    },
    { requiredFields: ['customerExternalId'] }
  );
}
