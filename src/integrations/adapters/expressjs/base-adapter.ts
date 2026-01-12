/**
 * ExpressJS adapter for Paid SDK
 * Converts Express Request/Response to framework-agnostic format
 */

import type { Request, Response } from "express";
import { createFrameworkAdapter } from "../../utils/create-adapter.js";
import type { FrameworkAdapter } from "../../utils/create-adapter.js";

/**
 * Handles Express Request/Response conversion to base handler format
 */
export const expressjsAdapter: FrameworkAdapter<Request, Response> = createFrameworkAdapter<Request, Response>({
  getBody: async (req) => {
    return req.body || {};
  },
  getHeaders: (req) => {
    const headers: Record<string, string> = {};
    Object.entries(req.headers).forEach(([key, value]) => {
      if (typeof value === "string") {
        headers[key] = value;
      } else if (Array.isArray(value)) {
        headers[key] = value.join(", ");
      }
    });
    return headers;
  },
  getMethod: (req) => req.method || "GET",
  getParams: async (req) => {
    return req.params || {};
  },
  getQuery: (req) => {
    const query: Record<string, string> = {};
    Object.entries(req.query).forEach(([key, value]) => {
      if (typeof value === "string") {
        query[key] = value;
      } else if (Array.isArray(value)) {
        query[key] = value.join(", ");
      }
    });
    return query;
  },
  sendJson: (data, status) => {
    throw new Error("ExpressJS adapter requires using response context from handler");
  },
});

/**
 * Create response context for ExpressJS
 * This converts the base handler response methods to ExpressJS/Express format
 */
type ExpressResponseContext = {
  json: (data: any, status?: number) => Response;
  error: (message: string, status: number) => Response;
};

export function createExpressJSResponseContext(res: Response): ExpressResponseContext {
  const json = (data: any, status = 200): Response => {
    return res.status(status).json(data);
  };
  const error = (message: string, status: number): Response => {
    return res.status(status).json({ error: message });
  };
  return { json, error };
}
