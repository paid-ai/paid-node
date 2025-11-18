import { paidApiFetch } from "../utils/api-fetch.js";
import { createHandler } from "../utils/base-handler.js";

export interface PayInvoiceConfig {
  apiUrl: string;
  apiKey: string;
  organizationId: string;
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

export interface ActivateOrderSyncConfig {
  apiUrl: string;
  apiKey: string;
  organizationId: string;
}

export interface ActivateOrderSyncRequest {
  orderId: string;
  confirmationToken: string;
  returnUrl?: string;
}

export interface ActivateOrderSyncResult {
  success: boolean;
  order: any;
  billing: any;
}

/**
 * Activate an order synchronously with payment
 *
 * This operation activates an order and immediately charges the customer
 * using the provided confirmation token (from Stripe or other payment provider).
 *
 * @param config - API configuration with organization context
 * @param request - Activation request with order ID and confirmation token
 * @returns Activation result with order and billing information
 *
 * @example
 * ```typescript
 * const result = await activateOrderSync(
 *   {
 *     apiUrl: 'https://api.agentpaid.io',
 *     apiKey: process.env.PAID_API_KEY,
 *     organizationId: 'org_123'
 *   },
 *   {
 *     orderId: 'ord_123',
 *     confirmationToken: 'pi_123_secret_456',
 *     returnUrl: 'https://example.com/return'
 *   }
 * );
 * ```
 */
export async function activateOrderSync(
  config: ActivateOrderSyncConfig,
  request: ActivateOrderSyncRequest
): Promise<ActivateOrderSyncResult> {
  const { orderId, confirmationToken, returnUrl } = request;

  if (!orderId) {
    throw new Error("orderId is required");
  }

  if (!confirmationToken) {
    throw new Error("confirmationToken is required");
  }

  const data = await paidApiFetch(
    config,
    `/api/organizations/${config.organizationId}/orders/${orderId}/activate-and-pay`,
    {
      method: "POST",
      body: {
        confirmationToken,
        ...(returnUrl && { returnUrl }),
      },
    }
  );

  return {
    success: true,
    order: data.order,
    billing: data.billing,
  };
}

/**
 * Internal request body type for the handler
 */
interface ActivateOrderSyncRequestBody {
  orderId?: string;
  confirmationToken: string;
  returnUrl?: string;
}

/**
 * Create a framework-agnostic handler for synchronous order activation
 *
 * This handler can be used with any framework adapter.
 *
 * @param defaultReturnUrl - Optional default return URL
 * @returns Handler function
 */
export function createActivateOrderSyncHandler(defaultReturnUrl?: string) {
  return createHandler<ActivateOrderSyncRequestBody, any>(
    async (client, body, params, organizationId) => {
      const apiKey = (client as any)._options?.token;
      const baseUrl = (client as any)._options?.baseUrl || 'https://api.agentpaid.io/api/v1';
      const apiUrl = baseUrl.replace('/api/v1', '');

      const orderId = params?.orderId || body.orderId;

      const result = await activateOrderSync(
        { apiUrl, apiKey, organizationId: organizationId! },
        {
          orderId: orderId!,
          confirmationToken: body.confirmationToken,
          returnUrl: body.returnUrl || defaultReturnUrl,
        }
      );

      return {
        success: true,
        data: {
          success: true,
          order: result.order,
          billing: result.billing,
          message: 'Order activated and charged successfully',
        },
      };
    },
    {
      requiredFields: ['confirmationToken'],
      requireOrganizationId: true,
    }
  );
}

export interface SetupIntentRequest {
  customerId: string;
  confirmationToken: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface SetupIntentResponse {
  setupIntent: {
    id: string;
    client_secret: string;
    status: string;
    usage: string;
    customer: string;
  };
  message: string;
}


export interface SetupIntentConfig {
  apiUrl: string;
  apiKey: string;
  organizationId: string;
}

/**
 * Create a setup intent for adding payment methods without immediate charge
 *
 * Setup intents are used to save payment methods for future use without
 * charging the customer immediately. This is useful for:
 * - Adding payment methods for subscription billing
 * - Updating payment methods
 * - Pre-authorizing payment methods
 *
 * @param config - API configuration with organization context
 * @param request - Setup intent request with customer ID and confirmation token
 * @returns Setup intent result with payment method details
 *
 * @example
 * ```typescript
 * const result = await createSetupIntent(
 *   {
 *     apiUrl: 'https://api.agentpaid.io',
 *     apiKey: process.env.PAID_API_KEY,
 *     organizationId: 'org_123'
 *   },
 *   {
 *     customerId: 'cus_123',
 *     confirmationToken: 'seti_123_secret_456',
 *     returnUrl: 'https://example.com/return',
 *     metadata: { source: 'web' }
 *   }
 * );
 * ```
 */
export async function createSetupIntent(
  config: SetupIntentConfig,
  request: SetupIntentRequest
): Promise<SetupIntentResponse> {
  const { customerId, confirmationToken, returnUrl, metadata } = request;

  if (!customerId) {
    throw new Error("customerId is required");
  }

  if (!confirmationToken) {
    throw new Error("confirmationToken is required");
  }

  const data = await paidApiFetch(
    config,
    `/api/organizations/${config.organizationId}/payments/setup-intents-external`,
    {
      method: "POST",
      body: {
        customerId,
        confirmationToken,
        ...(returnUrl && { returnUrl }),
        ...(metadata && { metadata }),
      },
    }
  );

  return {
    setupIntent: data.setupIntent || data,
    message: "Setup intent created successfully",
  };
}

/**
 * Create a framework-agnostic handler for setup intent creation
 *
 * This handler can be used with any framework adapter.
 *
 * @param defaultReturnUrl - Optional default return URL
 * @returns Handler function
 *
 * @example
 * ```typescript
 * // Next.js API route
 * import { createSetupIntentHandler } from '@paid-ai/paid-node/integrations';
 *
 * const handler = createSetupIntentHandler('https://myapp.com/billing');
 *
 * export async function POST(req: Request) {
 *   return handler(
 *     {
 *       body: await req.json(),
 *       headers: Object.fromEntries(req.headers),
 *       method: 'POST'
 *     },
 *     {
 *       json: (data, status = 200) => Response.json(data, { status }),
 *       error: (message, status) => Response.json({ error: message }, { status })
 *     }
 *   );
 * }
 * ```
 */
export function createSetupIntentHandler(defaultReturnUrl?: string) {
  return createHandler<SetupIntentRequest, SetupIntentResponse>(
    async (client, body, _params, organizationId) => {
      const apiKey = (client as any)._options?.token;
      const baseUrl = (client as any)._options?.baseUrl || 'https://api.agentpaid.io/api/v1';
      const apiUrl = baseUrl.replace('/api/v1', '');

      const result = await createSetupIntent(
        { apiUrl, apiKey, organizationId: organizationId! },
        {
          customerId: body.customerId,
          confirmationToken: body.confirmationToken,
          returnUrl: body.returnUrl || defaultReturnUrl,
          metadata: body.metadata,
        }
      );

      return {
        success: true,
        data: result,
      };
    },
    {
      requiredFields: ['customerId', 'confirmationToken'],
      requireOrganizationId: true,
    }
  );
}
