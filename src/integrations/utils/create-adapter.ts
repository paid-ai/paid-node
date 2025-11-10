/**
 * Generic adapter factory - eliminates repetitive adapter code
 * Works with any framework (Express, Fastify, Hono, Next.js, etc.)
 */

import type { BaseRequestContext, BaseResponseContext } from "./base-handler.js";

/**
 * Creates a framework adapter for any HTTP framework
 * Automatically extracts headers and converts request/response
 *
 * @param extractors - Framework-specific extraction functions
 * @returns Adapter function that wraps core handlers
 *
 * @example
 * ```typescript
 * const nextjsAdapter = createFrameworkAdapter({
 *   getBody: async (req) => await req.json(),
 *   getHeaders: (req) => Object.fromEntries(req.headers),
 *   getMethod: (req) => req.method || "GET",
 *   sendJson: (data, status) => NextResponse.json(data, { status })
 * });
 * ```
 */
export function createFrameworkAdapter<TFrameworkReq = any, TFrameworkRes = any>(
  extractors: {
    getBody: (req: TFrameworkReq) => any | Promise<any>;
    getHeaders: (req: TFrameworkReq) => Record<string, string>;
    getMethod: (req: TFrameworkReq) => string;
    getParams?: (req: TFrameworkReq, context?: any) => Record<string, string> | Promise<Record<string, string>>;
    getQuery?: (req: TFrameworkReq) => Record<string, string>;
    sendJson: (data: any, status: number) => TFrameworkRes;
  }
) {
  return function adaptHandler(innerHandler: Function) {
    return async (req: TFrameworkReq, context?: any, config?: any) => {
      const body = await extractors.getBody(req);
      const params = extractors.getParams
        ? await extractors.getParams(req, context)
        : undefined;

      const requestContext: BaseRequestContext = {
        body,
        headers: extractors.getHeaders(req),
        method: extractors.getMethod(req) as any,
        params,
        query: extractors.getQuery?.(req),
      };

      const responseContext: BaseResponseContext = {
        json: (data, status = 200) => extractors.sendJson(data, status),
        error: (message, status) =>
          extractors.sendJson({ error: message }, status),
      };

      return innerHandler(requestContext, responseContext, config);
    };
  };
}
