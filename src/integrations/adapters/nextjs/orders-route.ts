/**
 * Next.js API Route handler for order creation
 * Drop-in handler for Next.js App Router
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializePaidClient, type PaidClientConfig } from '../../client.js';
import { createOrderWithDefaults } from '../../helpers/order-helpers.js';
import type { OrderConfig, HelperOptions } from '../../types.js';

export interface OrdersRouteConfig extends PaidClientConfig {
  /**
   * Custom validation function
   */
  validate?: (body: any) => Promise<void> | void;

  /**
   * Transform request body before creating order
   */
  transformRequest?: (body: any) => Partial<OrderConfig>;

  /**
   * Transform response before sending
   */
  transformResponse?: (order: any) => any;

  /**
   * Default helper options for order creation
   */
  helperOptions?: HelperOptions;
}

/**
 * Create a Next.js API route handler for order creation
 *
 * @example
 * ```typescript
 * // src/app/api/orders/route.ts
 * import { createOrdersRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createOrdersRoute();
 * ```
 *
 * @example With auto-activation disabled
 * ```typescript
 * export const POST = createOrdersRoute({
 *   helperOptions: { autoActivate: false }
 * });
 * ```
 */
export function createOrdersRoute(config: OrdersRouteConfig = {}) {
  return async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const {
        customerId,
        customerExternalId,
        agentExternalId,
        billingContactId,
        name,
        description,
        startDate,
        endDate,
        currency,
        autoActivate,
      } = body;

      if (!customerId || !customerExternalId || !agentExternalId) {
        return NextResponse.json(
          { error: 'customerId, customerExternalId, and agentExternalId are required' },
          { status: 400 }
        );
      }

      if (config.validate) {
        await config.validate(body);
      }

      const client = initializePaidClient(config);

      const orderConfig: OrderConfig = config.transformRequest
        ? {
            customerId,
            customerExternalId,
            agentExternalId,
            billingContactId,
            name,
            description,
            startDate,
            endDate,
            currency,
            ...config.transformRequest(body)
          }
        : {
            customerId,
            customerExternalId,
            agentExternalId,
            billingContactId,
            name,
            description,
            startDate,
            endDate,
            currency,
          };

      const helperOptions: HelperOptions = {
        ...config.helperOptions,
        autoActivate: autoActivate ?? config.helperOptions?.autoActivate ?? true,
      };

      const order = await createOrderWithDefaults(client, orderConfig, helperOptions);

      const responseData = config.transformResponse
        ? config.transformResponse(order)
        : { success: true, order };

      return NextResponse.json(responseData);
    } catch (error) {
      console.error('Error creating order:', error);
      return NextResponse.json(
        {
          error: 'Failed to create order',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  };
}
