/**
 * Next.js API Route handler for invoice payment
 * Drop-in handler for Next.js App Router
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationId as fetchOrgId, type PaidClientConfig } from '../../client.js';
import { payInvoice, type PayInvoiceRequest } from '../../helpers/invoice-helpers.js';

export interface PayInvoiceRouteConfig extends PaidClientConfig {
  /**
   * Custom validation function
   */
  validate?: (body: any) => Promise<void> | void;

  /**
   * Transform request body before payment
   */
  transformRequest?: (body: any) => Partial<PayInvoiceRequest>;

  /**
   * Transform response before sending
   */
  transformResponse?: (result: any) => any;
}

/**
 * Create a Next.js API route handler for invoice payment
 *
 * Organization ID is automatically fetched from the API key.
 *
 * @example
 * ```typescript
 * // src/app/api/invoices/[invoiceId]/pay/route.ts
 * import { createPayInvoiceRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createPayInvoiceRoute();
 * ```
 */
export function createPayInvoiceRoute(config: PayInvoiceRouteConfig = {}) {
  return async function POST(
    request: NextRequest,
    context?: { params: Promise<{ invoiceId: string }> | { invoiceId: string } }
  ) {
    try {
      const body = await request.json();
      const { confirmationToken, returnUrl } = body;

      let invoiceId: string | undefined;
      if (context?.params) {
        const params = context.params instanceof Promise ? await context.params : context.params;
        invoiceId = params.invoiceId;
      }

      if (!invoiceId) {
        invoiceId = body.invoiceId;
      }

      if (!invoiceId || !confirmationToken) {
        return NextResponse.json(
          { error: 'invoiceId and confirmationToken are required' },
          { status: 400 }
        );
      }

      if (config.validate) {
        await config.validate(body);
      }

      // Get API configuration
      const apiKey = config.apiKey || process.env.PAID_API_KEY;
      if (!apiKey) {
        return NextResponse.json(
          { error: 'PAID_API_KEY not configured' },
          { status: 500 }
        );
      }

      const apiUrl = config.apiUrl || process.env.PAID_API_URL || 'https://api.agentpaid.io';

      // Automatically get organization ID from API key
      const organizationId = await fetchOrgId({ apiKey, apiUrl });
      if (!organizationId) {
        return NextResponse.json(
          { error: 'Could not determine organization ID from API key' },
          { status: 500 }
        );
      }

      const paymentRequest: PayInvoiceRequest = config.transformRequest
        ? { invoiceId, confirmationToken, returnUrl, ...config.transformRequest(body) }
        : { invoiceId, confirmationToken, returnUrl };

      const result = await payInvoice(
        { apiUrl, apiKey, organizationId },
        paymentRequest
      );

      const responseData = config.transformResponse
        ? config.transformResponse(result)
        : {
            success: true,
            data: result.data,
            message: 'Invoice payment processed successfully',
          };

      return NextResponse.json(responseData);
    } catch (error) {
      console.error('Error paying invoice:', error);
      return NextResponse.json(
        {
          error: 'Failed to pay invoice',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  };
}
