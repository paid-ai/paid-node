import { paidApiFetch } from "../utils/api-fetch.js";
import { createHandler } from "../utils/base-handler.js";

export interface PayInvoiceConfig {
  apiUrl: string;
  apiKey: string;
  organizationId: string;
}

export interface BillingStatus {
  customerId: string;
  hasUnpaidInvoices: boolean;
  daysPastDue: number;
  totalOutstanding: number;
  unpaidInvoicesCount: number;
  totalInvoices: number;
  hasActiveOrders: boolean;
}

export interface PayInvoiceRequest {
  invoiceId: string;
  confirmationToken: string;
  returnUrl?: string;
}

export interface PayInvoiceResult {
  success: boolean;
  data?: any;
}

export interface CustomerInvoicesResult {
  data: any[];
}

/**
 * Pay an invoice with a payment confirmation token
 * This helper processes payment for an existing invoice using a Stripe confirmation token.
 *
 * @param config - API configuration with organization context
 * @param request - Payment request details
 * @returns Payment result
 *
 * @example
 * ```typescript
 * const result = await payInvoice(
 *   {
 *     apiUrl: 'https://api.agentpaid.io',
 *     apiKey: process.env.PAID_API_KEY,
 *     organizationId: 'org_123'
 *   },
 *   {
 *     invoiceId: 'inv_123',
 *     confirmationToken: 'pm_tok_xxx',
 *     returnUrl: 'https://example.com/thanks'
 *   }
 * );
 * ```
 */
export async function payInvoice(
  config: PayInvoiceConfig,
  request: PayInvoiceRequest
): Promise<PayInvoiceResult> {
  const { invoiceId, confirmationToken, returnUrl } = request;

  if (!invoiceId || !confirmationToken) {
    throw new Error("invoiceId and confirmationToken are required");
  }

  const data = await paidApiFetch(
    config,
    `/api/organizations/${config.organizationId}/invoices/${invoiceId}/pay`,
    {
      method: "PUT",
      body: {
        confirmationToken,
        ...(returnUrl && { returnUrl }),
      },
    }
  );

  return { success: true, data };
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
export function createCustomerInvoicesHandler() {
  return createHandler<CustomerInvoicesRequest, any>(
    async (_client, _body, params, organizationId) => {
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

interface PayInvoiceRequestWithBody {
  invoiceId?: string;
  confirmationToken: string;
  returnUrl?: string;
}

/**
 * Create a framework-agnostic handler for invoice payment
 *
 * This handler can be used with any framework adapter.
 * Organization ID is automatically fetched from the API key.
 *
 * @returns Handler function
 */
export function createPayInvoiceHandler() {
  return createHandler<PayInvoiceRequestWithBody, any>(
    async (_client, body, params, organizationId) => {
      if (!organizationId) {
        return { success: false, error: 'Organization ID not found', status: 500 };
      }

      const invoiceId = params?.invoiceId || body.invoiceId;
      const { confirmationToken, returnUrl } = body;

      if (!invoiceId) {
        return { success: false, error: 'invoiceId is required', status: 400 };
      }

      if (!confirmationToken) {
        return { success: false, error: 'confirmationToken is required', status: 400 };
      }

      const apiKey = process.env.PAID_API_KEY || '';
      const apiUrl = process.env.PAID_API_URL || 'https://api.agentpaid.io';

      const result = await payInvoice(
        { apiUrl, apiKey, organizationId },
        { invoiceId, confirmationToken, returnUrl }
      );

      return {
        success: true,
        data: result.data,
      };
    },
    { requiredFields: ['confirmationToken'], requireOrganizationId: true }
  );
}
