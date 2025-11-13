export interface PaidApiConfig {
  apiUrl: string;
  apiKey: string;
  organizationId: string;
}

/**
 * Make a direct API call to ap-signals
 *
 * @param config - API configuration with organization context
 * @param endpoint - API endpoint path (will be appended to apiUrl)
 * @param options - Fetch options (method, body)
 * @returns Parsed JSON response
 * @throws Error if request fails
 */
export async function paidApiFetch<T = any>(
  config: PaidApiConfig,
  endpoint: string,
  options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
  }
): Promise<T> {
  if (!config.organizationId) {
    throw new Error("organizationId is required");
  }

  if (!config.apiKey) {
    throw new Error("apiKey is required");
  }

  if (!config.apiUrl) {
    throw new Error("apiUrl is required");
  }

  try {
    const response = await fetch(`${config.apiUrl}${endpoint}`, {
      method: options?.method || "GET",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error making Paid API request:", error);
    throw error;
  }
}
