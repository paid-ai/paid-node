/**
 * Next.js API Route handler for user provisioning
 * Creates customer + contact + order in one operation
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializePaidClient, type PaidClientConfig } from '../../client.js';
import { provisionUserByEmail } from '../../helpers/provisioning-helpers.js';
import type { HelperOptions } from '../../types.js';

export interface ProvisioningRouteConfig extends PaidClientConfig {
    /**
     * Custom validation function
     */
    validate?: (body: any) => Promise<void> | void;

    /**
     * Transform response before sending
     */
    transformResponse?: (result: any) => any;

    /**
     * Default agent external ID
     * Can be overridden by request body
     */
    defaultAgentExternalId?: string;

    /**
     * Default order options
     */
    orderOptions?: HelperOptions;
}

/**
 * Create a Next.js API route handler for user provisioning
 *
 * This creates a single endpoint that provisions a complete user
 * with customer, contact, and optional order.
 *
 * @example
 * ```typescript
 * // src/app/api/provision/route.ts
 * import { createProvisioningRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createProvisioningRoute({
 *   defaultAgentExternalId: process.env.PAID_AGENT_ID
 * });
 * ```
 *
 * @example Client-side usage
 * ```typescript
 * await fetch('/api/provision', {
 *   method: 'POST',
 *   body: JSON.stringify({ email: 'user@example.com' })
 * });
 * ```
 */
export function createProvisioningRoute(config: ProvisioningRouteConfig = {}) {
    return async function POST(request: NextRequest) {
        try {
            const body = await request.json();
            const { email, agentExternalId } = body;

            if (!email) {
                return NextResponse.json(
                    { error: 'email is required' },
                    { status: 400 }
                );
            }

            if (config.validate) {
                await config.validate(body);
            }

            const client = initializePaidClient(config);

            // Use agent ID from body, config, or env var
            const effectiveAgentId =
                agentExternalId ||
                config.defaultAgentExternalId ||
                process.env.NEXT_PUBLIC_PAID_AGENT_ID ||
                process.env.PAID_AGENT_ID;

            const result = await provisionUserByEmail(
                client,
                email,
                effectiveAgentId,
                config.orderOptions
            );

            const responseData = config.transformResponse
                ? config.transformResponse(result)
                : {
                    success: true,
                    customer: result.customer,
                    contact: result.contact,
                    order: result.order,
                };

            return NextResponse.json(responseData);
        } catch (error) {
            console.error('Error provisioning user:', error);
            return NextResponse.json(
                {
                    error: 'Failed to provision user',
                    details: error instanceof Error ? error.message : 'Unknown error',
                },
                { status: 500 }
            );
        }
    };
}
