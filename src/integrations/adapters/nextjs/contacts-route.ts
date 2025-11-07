/**
 * Next.js API Route handler for contact creation
 * Drop-in handler for Next.js App Router
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializePaidClient, type PaidClientConfig } from '../../client.js';
import { createContactWithDefaults } from '../../helpers/contact-helpers.js';
import type { ContactData } from '../../types.js';

export interface ContactsRouteConfig extends PaidClientConfig {
  /**
   * Custom validation function
   */
  validate?: (body: any) => Promise<void> | void;

  /**
   * Transform request body before creating contact
   */
  transformRequest?: (body: any) => Partial<ContactData>;

  /**
   * Transform response before sending
   */
  transformResponse?: (contact: any) => any;
}

/**
 * Create a Next.js API route handler for contact creation
 *
 * @example
 * ```typescript
 * // src/app/api/contacts/route.ts
 * import { createContactsRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createContactsRoute();
 * ```
 */
export function createContactsRoute(config: ContactsRouteConfig = {}) {
  return async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { customerExternalId, email, firstName, lastName, phone, billingAddress, salutation } = body;

      if (!customerExternalId) {
        return NextResponse.json(
          { error: 'customerExternalId is required' },
          { status: 400 }
        );
      }

      if (config.validate) {
        await config.validate(body);
      }

      const client = initializePaidClient(config);

      const contactData: ContactData = config.transformRequest
        ? { customerExternalId, email, firstName, lastName, phone, billingAddress, salutation, ...config.transformRequest(body) }
        : { customerExternalId, email, firstName, lastName, phone, billingAddress, salutation };

      const contact = await createContactWithDefaults(client, contactData);

      const responseData = config.transformResponse
        ? config.transformResponse(contact)
        : { success: true, contact };

      return NextResponse.json(responseData);
    } catch (error) {
      console.error('Error creating contact:', error);
      return NextResponse.json(
        {
          error: 'Failed to create contact',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  };
}
