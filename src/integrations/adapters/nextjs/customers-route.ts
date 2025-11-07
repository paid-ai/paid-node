/**
 * Next.js API Route handler for customer creation
 * Drop-in handler for Next.js App Router
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializePaidClient, type PaidClientConfig } from '../../client.js';
import { createCustomerWithDefaults } from '../../helpers/customer-helpers.js';
import type { CustomerData } from '../../types.js';

export interface CustomersRouteConfig extends PaidClientConfig {
  /**
   * Custom validation function
   */
  validate?: (body: any) => Promise<void> | void;

  /**
   * Transform request body before creating customer
   */
  transformRequest?: (body: any) => Partial<CustomerData>;

  /**
   * Transform response before sending
   */
  transformResponse?: (customer: any) => any;
}

/**
 * Create a Next.js API route handler for customer creation
 *
 * @example
 * ```typescript
 * // src/app/api/customers/route.ts
 * import { createCustomersRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createCustomersRoute();
 * ```
 *
 * @example With custom config
 * ```typescript
 * export const POST = createCustomersRoute({
 *   validate: async (body) => {
 *     if (!body.email.includes('@company.com')) {
 *       throw new Error('Only company emails allowed');
 *     }
 *   }
 * });
 * ```
 */
export function createCustomersRoute(config: CustomersRouteConfig = {}) {
  return async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { externalId, email, name, billingAddress } = body;

      if (!externalId) {
        return NextResponse.json(
          { error: 'externalId is required' },
          { status: 400 }
        );
      }

      if (config.validate) {
        await config.validate(body);
      }

      const client = initializePaidClient(config);

      const customerData: CustomerData = config.transformRequest
        ? { externalId, email, name, billingAddress, ...config.transformRequest(body) }
        : { externalId, email, name, billingAddress };

      const customer = await createCustomerWithDefaults(client, customerData);

      const responseData = config.transformResponse
        ? config.transformResponse(customer)
        : { success: true, customer };

      return NextResponse.json(responseData);
    } catch (error) {
      console.error('Error creating customer:', error);
      return NextResponse.json(
        {
          error: 'Failed to create customer',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  };
}
