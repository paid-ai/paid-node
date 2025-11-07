/**
 * Shared Paid client initialization utility
 * Framework-agnostic
 */

import { PaidClient } from '../Client.js';

export interface PaidClientConfig {
  /**
   * Paid API key - defaults to process.env.PAID_API_KEY
   */
  apiKey?: string;

  /**
   * Paid API URL - defaults to production
   */
  apiUrl?: string;
}

/**
 * Initialize a Paid client with environment variable fallbacks
 *
 * @param config - Optional configuration overrides
 * @returns Configured PaidClient instance
 * @throws Error if API key is not provided or found in environment
 *
 * @example
 * ```typescript
 * const client = initializePaidClient();
 * // Uses process.env.PAID_API_KEY
 *
 * const client = initializePaidClient({ apiKey: 'pk_xxx' });
 * // Uses provided key
 * ```
 */
export function initializePaidClient(config: PaidClientConfig = {}): PaidClient {
  const apiKey = config.apiKey || process.env.PAID_API_KEY;

  if (!apiKey) {
    throw new Error('PAID_API_KEY not configured. Set process.env.PAID_API_KEY or pass apiKey in config.');
  }

  return new PaidClient({
    token: apiKey,
    baseUrl: config.apiUrl
      ? `${config.apiUrl}/api/v1`
      : process.env.PAID_API_URL
      ? `${process.env.PAID_API_URL}/api/v1`
      : undefined,
  });
}

/**
 * Get organization ID from API key
 *
 * Calls the Paid API to resolve the organization ID associated with the API key.
 *
 * @param config - API configuration
 * @returns Organization ID or null if not found
 *
 * @example
 * ```typescript
 * const orgId = await getOrganizationId({
 *   apiKey: process.env.PAID_API_KEY,
 *   apiUrl: 'https://api.agentpaid.io'
 * });
 * ```
 */
export async function getOrganizationId(config: PaidClientConfig = {}): Promise<string | null> {
  const apiKey = config.apiKey || process.env.PAID_API_KEY;
  const apiUrl = config.apiUrl || process.env.PAID_API_URL || 'https://api.agentpaid.io';

  if (!apiKey) {
    throw new Error('PAID_API_KEY not configured');
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/organizations/organizationId`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to get organization ID:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.data?.organizationId || null;
  } catch (error) {
    console.error('Error fetching organization ID:', error);
    return null;
  }
}
