import { paidApiFetch } from "../utils/api-fetch.js";
import { createHandler } from "../utils/base-handler.js";
import type { PayInvoiceConfig } from "./billing.js";

export interface CustomerInvoicesResult {
  data: any[];
}

/**
 * Get customer invoices
 * Fetches all invoices for a customer by their external ID.
 *
 * @param config - API configuration with organization context
 * @param customerExternalId - Customer's external ID
 * @returns Customer invoices
 *
 * @example
 * ```typescript
 * const result = await getCustomerInvoices(
 *   {
 *     apiUrl: 'https://api.agentpaid.io',
 *     apiKey: process.env.PAID_API_KEY,
 *     organizationId: 'org_123'
 *   },
 *   'user-123'
 * );
 *
 * console.log(`Found ${result.data.length} invoices`);
 * ```
 */
export async function getCustomerInvoices(
  config: PayInvoiceConfig,
  customerExternalId: string
): Promise<CustomerInvoicesResult> {
  if (!customerExternalId) {
    throw new Error("customerExternalId is required");
  }

  const data = await paidApiFetch(
    config,
    `/api/organizations/${config.organizationId}/customer/external/${customerExternalId}/invoices`,
    { method: "GET" }
  );

  return { data: data.data || data || [] };
}

interface CustomerInvoicesRequest {
  customerExternalId: string;
}

/**
 * Create a framework-agnostic handler for fetching customer invoices
 *
 * This handler can be used with any framework adapter.
 * Organization ID is automatically fetched from the API key.
 *
 * @returns Handler function
 */
export function createCustomerInvoicesHandler(): (request: any, response: any, config?: any) => Promise<any> {
  return createHandler<CustomerInvoicesRequest, any>(
    async (_client, _body, params, organizationId): Promise<any> => {
      if (!organizationId) {
        return { success: false, error: 'Organization ID not found', status: 500 };
      }

      const customerExternalId = params?.customerExternalId;
      if (!customerExternalId) {
        return { success: false, error: 'customerExternalId is required', status: 400 };
      }

      const apiKey = process.env.PAID_API_KEY || '';
      const apiUrl = process.env.PAID_API_URL || 'https://api.agentpaid.io';

      const result = await getCustomerInvoices(
        { apiUrl, apiKey, organizationId },
        customerExternalId
      );

      return {
        success: true,
        data: result.data,
      };
    },
    { allowedMethods: ['GET'], requireOrganizationId: true }
  );
}

