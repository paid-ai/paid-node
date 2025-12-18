/**
 * Framework-agnostic base handler for Paid SDK integrations
 * Provides consistent request handling, validation, and error handling
 */

import type { PaidClient } from "../../Client.js";
import { initializePaidClient, getOrganizationId, type PaidClientConfig } from "../client.js";

export interface BaseRequestContext<TBody = any, TParams = Record<string, string>> {
  body: TBody;
  headers: Record<string, string>;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: TParams;
  query?: Record<string, string>;
}

export interface BaseResponseContext {
  json: (data: any, status?: number) => any;
  error: (message: string, status: number) => any;
}

export interface BaseHandlerConfig extends PaidClientConfig {
  validate?: (body: any) => Promise<void> | void;
  transformRequest?: (body: any) => any;
  transformResponse?: (data: any) => any;
}

export type HandlerFunction<TRequest, TResponse> = (
  client: PaidClient,
  request: TRequest,
  params?: Record<string, string>,
  organizationId?: string
) => Promise<{ success: boolean; data?: TResponse; error?: string; status?: number }>;

/**
 * Creates a framework-agnostic handler with automatic client initialization,
 * validation, and error handling
 *
 * @param handler - Business logic handler function
 * @param options - Handler configuration options
 * @returns Framework-agnostic handler function
 *
 * @example
 * ```typescript
 * const customersHandler = createHandler(
 *   async (client, body) => {
 *     const customer = await createCustomerWithDefaults(client, body);
 *     return { success: true, data: customer };
 *   },
 *   { requiredFields: ['externalId'] }
 * );
 * ```
 */
export function createHandler<TRequest = any, TResponse = any>(
  handler: HandlerFunction<TRequest, TResponse>,
  options: {
    requiredFields?: (keyof TRequest)[];
    allowedMethods?: Array<"GET" | "POST" | "PUT" | "DELETE" | "PATCH">;
    requireOrganizationId?: boolean;
  } = {}
) {
  const { requiredFields = [], allowedMethods = ["POST"], requireOrganizationId = false } = options;

  return async function (
    request: BaseRequestContext<TRequest>,
    response: BaseResponseContext,
    config: BaseHandlerConfig = {}
  ): Promise<any> {
    if (!allowedMethods.includes(request.method)) {
      return response.error("Method not allowed", 405);
    }

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return response.error(`${String(field)} is required`, 400);
      }
    }

    if (config.validate) {
      try {
        await config.validate(request.body);
      } catch (error) {
        return response.error(
          error instanceof Error ? error.message : "Validation failed",
          400
        );
      }
    }

    try {
      const client = initializePaidClient(config);

      let organizationId: string | undefined;
      if (requireOrganizationId) {
        const orgId = await getOrganizationId(config);
        if (!orgId) {
          return response.error("Organization not found", 500);
        }
        organizationId = orgId;
      }

      const requestData = config.transformRequest
        ? config.transformRequest(request.body)
        : request.body;

      const result = await handler(client, requestData, request.params, organizationId);

      if (!result.success) {
        return response.error(
          result.error || "Operation failed",
          result.status || 500
        );
      }

      const responseData = config.transformResponse
        ? config.transformResponse(result.data)
        : { data: result.data };

      return response.json(responseData, 200);
    } catch (error) {
      console.error("Handler error:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        return response.error("Network error: Unable to reach Paid API", 503);
      }

      return response.error(
        error instanceof Error ? error.message : "Internal server error",
        500
      );
    }
  };
}

/**
 * Helper to create a fetch-based handler for simple API calls
 *
 * @param endpoint - Function that generates the endpoint URL from org ID and request body
 * @param options - Optional method, request/response transformations
 * @returns Handler function that makes the API call
 *
 * @example
 * ```typescript
 * const activateHandler = createHandler(
 *   createFetchHandler(
 *     (orgId, req) => `/api/organizations/${orgId}/orders/${req.orderId}/activate-sync`,
 *     {
 *       method: "POST",
 *       transformRequest: (req) => ({ confirmationToken: req.confirmationToken }),
 *       transformResponse: (data) => ({ order: data.order, billing: data.billing })
 *     }
 *   ),
 *   { requireOrganizationId: true }
 * );
 * ```
 */
export function createFetchHandler<TRequest, TResponse>(
  endpoint: (orgId: string, body: TRequest, params?: Record<string, string>) => string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    transformRequest?: (body: TRequest) => any;
    transformResponse?: (data: any) => TResponse;
  }
): HandlerFunction<TRequest, TResponse> {
  return async (client, requestBody, params, organizationId) => {
    if (!organizationId) {
      return {
        success: false,
        error: "Organization ID is required for this operation",
        status: 500,
      };
    }

    try {
      const url = endpoint(organizationId, requestBody, params);
      const body = options?.transformRequest
        ? options.transformRequest(requestBody)
        : requestBody;

      const baseUrl = (client as any)._options?.baseUrl || "https://api.agentpaid.io/api/v1";
      const apiKey = (client as any)._options?.token;

      if (!apiKey) {
        return {
          success: false,
          error: "API key not found in client",
          status: 500,
        };
      }

      const fetchResponse = await fetch(`${baseUrl}${url}`, {
        method: options?.method || "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: options?.method !== "GET" ? JSON.stringify(body) : undefined,
      });

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        console.error("API error:", errorText);
        return {
          success: false,
          error: `API request failed: ${errorText}`,
          status: fetchResponse.status,
        };
      }

      const data = await fetchResponse.json();
      const transformedData = options?.transformResponse
        ? options.transformResponse(data)
        : data;

      return { success: true, data: transformedData };
    } catch (error) {
      console.error("Fetch error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      };
    }
  };
}
