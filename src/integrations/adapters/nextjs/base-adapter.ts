/**
 * Next.js adapter for Paid SDK
 * Converts Next.js App Router requests to framework-agnostic format
 */

import { NextRequest, NextResponse } from "next/server";
import { createFrameworkAdapter } from "../../utils/create-adapter.js";
import type { FrameworkAdapter } from "../../utils/create-adapter.js";

/**
 * Next.js adapter for App Router
 * Handles NextRequest/NextResponse conversion to base handler format
 */
export const nextjsAdapter: FrameworkAdapter<NextRequest, NextResponse> = createFrameworkAdapter<
  NextRequest,
  NextResponse
>({
  getBody: async (req) => {
    if (req.method === "GET" || req.method === "HEAD") {
      return {};
    }
    try {
      return await req.json();
    } catch (error) {
      return {};
    }
  },
  getHeaders: (req) => {
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  },
  getMethod: (req) => req.method || "GET",
  getParams: async (_req, context) => {
    if (!context?.params) {
      return {};
    }
    const params = context.params instanceof Promise ? await context.params : context.params;
    return params || {};
  },
  getQuery: (req) => {
    const query: Record<string, string> = {};
    req.nextUrl.searchParams.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  },
  sendJson: (data, status) => NextResponse.json(data, { status }),
});
