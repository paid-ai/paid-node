/**
 * Next.js API Route handler for fetching customer invoices
 * Drop-in handler for Next.js App Router
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationId as fetchOrgId, type PaidClientConfig } from '../../client.js';
import { getCustomerInvoices } from '../../helpers/invoice-helpers.js';

export interface CustomerInvoicesRouteConfig extends PaidClientConfig {
  /**
   * Custom validation function
   */
  validate?: (params: any) => Promise<void> | void;

  /**
   * Transform response before sending
   */
  transformResponse?: (result: any) => any;
}

/**
 * Create a Next.js API route handler for fetching customer invoices
 *
 * Organization ID is automatically fetched from the API key.
 *
 * @example
 * ```typescript
 * // src/app/api/customers/[customerExternalId]/invoices/route.ts
 * import { createCustomerInvoicesRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const GET = createCustomerInvoicesRoute();
 * ```
 */
export function createCustomerInvoicesRoute(config: CustomerInvoicesRouteConfig = {}) {
  return async function GET(
    request: NextRequest,
    context: { params: Promise<{ customerExternalId: string }> | { customerExternalId: string } }
  ) {
    try {
      // Handle both Next.js 13 (Promise) and Next.js 14+ (direct object) params
      const params = context.params instanceof Promise ? await context.params : context.params;
      const customerExternalId = params.customerExternalId;

      if (!customerExternalId) {
        return NextResponse.json(
          { error: 'customerExternalId is required' },
          { status: 400 }
        );
      }

      if (config.validate) {
        await config.validate(params);
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

      const result = await getCustomerInvoices(
        { apiUrl, apiKey, organizationId },
        customerExternalId
      );

      const responseData = config.transformResponse
        ? config.transformResponse(result)
        : {
            success: true,
            invoices: result.data,
          };

      return NextResponse.json(responseData);
    } catch (error) {
      console.error('Error fetching customer invoices:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch customer invoices',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  };
}
