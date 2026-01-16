import { PaidClient } from "../../Client.js";
import type { PlanGroup } from "../../api/types/PlanGroup.js";
import type { Plan } from "../../api/types/Plan.js";
import type { PlanWithFeatures } from "../../api/types/PlanWithFeatures.js";
import type { Order } from "../../api/types/Order.js";
import type { CancelRenewalResponse } from "../../api/types/CancelRenewalResponse.js";
import type { ProrationUpgradeResponse } from "../../api/types/ProrationUpgradeResponse.js";
import type { PlansSubscribeRequest } from "../../api/resources/plans/client/requests/PlansSubscribeRequest.js";
import type { PlansUnsubscribeRequest } from "../../api/resources/plans/client/requests/PlansUnsubscribeRequest.js";
import type { PlansUpgradeRequest } from "../../api/resources/plans/client/requests/PlansUpgradeRequest.js";
import type { PlansGetCurrentRequest } from "../../api/resources/plans/client/requests/PlansGetCurrentRequest.js";
import type { PlansGetCurrentResponse } from "../../api/resources/plans/types/PlansGetCurrentResponse.js";
import { createHandler } from "../utils/base-handler.js";

/**
 * Get a plan by ID
 *
 * @param client - PaidClient instance
 * @param planId - Plan's ID
 * @returns Plan data
 *
 * @example
 * ```typescript
 * const plan = await getPlanById(client, 'plan-123');
 * console.log(plan.name, plan.id);
 * ```
 */
export async function getPlanById(
  client: PaidClient,
  planId: string,
): Promise<Plan> {
  const plan = await client.plans.getById(planId);
  return plan;
}

/**
 * Get a plan group by ID
 *
 * @param client - PaidClient instance
 * @param planGroupId - Plan group's ID
 * @returns Plan group data
 *
 * @example
 * ```typescript
 * const planGroup = await getPlanGroupById(client, 'plan-group-123');
 * console.log(planGroup.name, planGroup.id);
 * ```
 */
export async function getPlanGroupById(
  client: PaidClient,
  planGroupId: string,
): Promise<PlanGroup> {
  const planGroup = await client.plans.getGroupById(planGroupId);
  return planGroup;
}

/**
 * Create a framework-agnostic handler for fetching a plan group by ID
 *
 * This handler can be used with any framework adapter.
 * The plan group ID should be provided either in params or query string.
 *
 * @returns Handler function
 *
 * @example
 * ```typescript
 * // In Next.js route: /api/plans/[planGroupId]/route.ts
 * import { createGetPlanGroupByIdHandler } from '@paid-ai/paid-node/integrations';
 * import { nextjsAdapter } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * const handler = createGetPlanGroupByIdHandler();
 * export const GET = nextjsAdapter(handler);
 * ```
 */
export function createGetPlanGroupByIdHandler(): (request: any, response: any, config?: any) => Promise<any> {
  return createHandler<any, any>(
    async (client, _body, params) => {
      const planGroupId = params?.planGroupId;

      if (!planGroupId) {
        return {
          success: false,
          error: "planGroupId is required",
          status: 400,
        };
      }

      const planGroup = await getPlanGroupById(client, planGroupId);
      return { success: true, data: planGroup };
    },
    {
      allowedMethods: ['GET'],
      requireOrganizationId: false,
    }
  );
}

/**
 * Get all plans in a plan group
 *
 * @param client - PaidClient instance
 * @param planGroupId - Plan group's ID
 * @returns Array of plans with features
 *
 * @example
 * ```typescript
 * const plans = await getGroupPlans(client, 'plan-group-123');
 * console.log(plans.length);
 * ```
 */
export async function getGroupPlans(
  client: PaidClient,
  planGroupId: string,
): Promise<PlanWithFeatures[]> {
  const plans = await client.plans.getGroupPlans(planGroupId);
  return plans;
}

/**
 * Create a framework-agnostic handler for fetching plans in a plan group
 *
 * This handler can be used with any framework adapter.
 * The plan group ID should be provided either in params or query string.
 *
 * @returns Handler function
 *
 * @example
 * ```typescript
 * // In Next.js route: /api/plans/[planGroupId]/plans/route.ts
 * import { createGetGroupPlansHandler } from '@paid-ai/paid-node/integrations';
 * import { nextjsAdapter } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * const handler = createGetGroupPlansHandler();
 * export const GET = nextjsAdapter(handler);
 * ```
 */
export function createGetGroupPlansHandler(): (request: any, response: any, config?: any) => Promise<any> {
  return createHandler<any, any>(
    async (client, _body, params) => {
      const planGroupId = params?.planGroupId;

      if (!planGroupId) {
        return {
          success: false,
          error: "planGroupId is required",
          status: 400,
        };
      }

      const plans = await getGroupPlans(client, planGroupId);
      return { success: true, data: plans };
    },
    {
      allowedMethods: ['GET'],
      requireOrganizationId: false,
    }
  );
}

/**
 * Subscribe a customer to a plan
 *
 * Creates a new order for a customer based on the specified plan, automatically converting plan products to order lines.
 *
 * @param client - PaidClient instance
 * @param planId - Plan's ID
 * @param request - Subscribe request with customer external ID and currency
 * @returns Created order
 *
 * @example
 * ```typescript
 * const order = await subscribe(client, 'plan-123', {
 *   customerExternalId: 'customer-123',
 *   currency: 'USD'
 * });
 * console.log(order.id);
 * ```
 */
export async function subscribe(
  client: PaidClient,
  planId: string,
  request: PlansSubscribeRequest,
): Promise<Order> {
  const order = await client.plans.subscribe(planId, request);
  return order;
}

/**
 * Create a framework-agnostic handler for subscribing a customer to a plan
 *
 * This handler can be used with any framework adapter.
 * The plan ID should be provided either in params or query string.
 * The request body should contain customerExternalId and currency.
 *
 * @returns Handler function
 *
 * @example
 * ```typescript
 * // In Next.js route: /api/plans/[planId]/subscribe/route.ts
 * import { createSubscribeHandler } from '@paid-ai/paid-node/integrations';
 * import { nextjsAdapter } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * const handler = createSubscribeHandler();
 * export const POST = nextjsAdapter(handler);
 * ```
 */
export function createSubscribeHandler(): (request: any, response: any, config?: any) => Promise<any> {
  return createHandler<PlansSubscribeRequest, Order>(
    async (client, body, params) => {
      const planId = params?.planId;

      if (!planId) {
        return {
          success: false,
          error: "planId is required",
          status: 400,
        };
      }

      if (!body.customerExternalId) {
        return {
          success: false,
          error: "customerExternalId is required",
          status: 400,
        };
      }

      if (!body.currency) {
        return {
          success: false,
          error: "currency is required",
          status: 400,
        };
      }

      const order = await subscribe(client, planId, body);
      return { success: true, data: order };
    },
    {
      allowedMethods: ['POST'],
      requireOrganizationId: false,
    }
  );
}

/**
 * Unsubscribe a customer from a plan
 *
 * Cancels the renewal of an order associated with the specified plan. The order will remain active until the cancellation date.
 *
 * @param client - PaidClient instance
 * @param planId - Plan's ID
 * @param request - Unsubscribe request with customer external ID
 * @returns Cancel renewal response
 *
 * @example
 * ```typescript
 * const response = await unsubscribe(client, 'plan-123', {
 *   customerExternalId: 'customer-123'
 * });
 * console.log(response.message);
 * ```
 */
export async function unsubscribe(
  client: PaidClient,
  planId: string,
  request: PlansUnsubscribeRequest,
): Promise<CancelRenewalResponse> {
  const response = await client.plans.unsubscribe(planId, request);
  return response;
}

/**
 * Create a framework-agnostic handler for unsubscribing a customer from a plan
 *
 * This handler can be used with any framework adapter.
 * The plan ID should be provided either in params or query string.
 * The request body should contain customerExternalId.
 *
 * @returns Handler function
 *
 * @example
 * ```typescript
 * // In Next.js route: /api/plans/[planId]/unsubscribe/route.ts
 * import { createUnsubscribeHandler } from '@paid-ai/paid-node/integrations';
 * import { nextjsAdapter } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * const handler = createUnsubscribeHandler();
 * export const POST = nextjsAdapter(handler);
 * ```
 */
export function createUnsubscribeHandler(): (request: any, response: any, config?: any) => Promise<any> {
  return createHandler<PlansUnsubscribeRequest, CancelRenewalResponse>(
    async (client, body, params) => {
      const planId = params?.planId;

      if (!planId) {
        return {
          success: false,
          error: "planId is required",
          status: 400,
        };
      }

      if (!body.customerExternalId) {
        return {
          success: false,
          error: "customerExternalId is required",
          status: 400,
        };
      }

      const response = await unsubscribe(client, planId, body);
      return { success: true, data: response };
    },
    {
      allowedMethods: ['POST'],
      requireOrganizationId: false,
    }
  );
}

/**
 * Upgrade a customer from their current plan to a new plan
 *
 * Upgrades a customer from their current plan to a new plan with automatic proration calculation. This schedules a plan change and applies credits for the unused portion of the current billing period.
 *
 * @param client - PaidClient instance
 * @param request - Upgrade request with customer external ID, old plan ID, and new plan ID
 * @returns Proration upgrade response
 *
 * @example
 * ```typescript
 * const response = await upgrade(client, {
 *   customerExternalId: 'customer-123',
 *   oldPlanId: 'plan-123',
 *   newPlanId: 'plan-456'
 * });
 * console.log(response.order.id);
 * ```
 */
export async function upgrade(
  client: PaidClient,
  request: PlansUpgradeRequest,
): Promise<ProrationUpgradeResponse> {
  const response = await client.plans.upgrade(request);
  return response;
}

/**
 * Create a framework-agnostic handler for upgrading a customer's plan
 *
 * This handler can be used with any framework adapter.
 * The request body should contain customerExternalId, oldPlanId, and newPlanId.
 *
 * @returns Handler function
 *
 * @example
 * ```typescript
 * // In Next.js route: /api/plans/upgrade/route.ts
 * import { createUpgradeHandler } from '@paid-ai/paid-node/integrations';
 * import { nextjsAdapter } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * const handler = createUpgradeHandler();
 * export const POST = nextjsAdapter(handler);
 * ```
 */
export function createUpgradeHandler(): (request: any, response: any, config?: any) => Promise<any> {
  return createHandler<PlansUpgradeRequest, ProrationUpgradeResponse>(
    async (client, body) => {
      if (!body.customerExternalId) {
        return {
          success: false,
          error: "customerExternalId is required",
          status: 400,
        };
      }

      if (!body.oldPlanId) {
        return {
          success: false,
          error: "oldPlanId is required",
          status: 400,
        };
      }

      if (!body.newPlanId) {
        return {
          success: false,
          error: "newPlanId is required",
          status: 400,
        };
      }

      const response = await upgrade(client, body);
      return { success: true, data: response };
    },
    {
      allowedMethods: ['POST'],
      requireOrganizationId: false,
    }
  );
}

/**
 * Get the currently active plan subscription for a customer
 *
 * Retrieves the currently active plan subscription for a customer by their external ID. Returns the plan details and subscription information.
 *
 * @param client - PaidClient instance
 * @param request - Get current request with customer external ID
 * @returns Current plan response
 *
 * @example
 * ```typescript
 * const response = await getCurrent(client, {
 *   customerExternalId: 'customer-123'
 * });
 * console.log(response.plan.id);
 * ```
 */
export async function getCurrent(
  client: PaidClient,
  request: PlansGetCurrentRequest,
): Promise<PlansGetCurrentResponse> {
  const response = await client.plans.getCurrent(request);
  return response;
}

/**
 * Create a framework-agnostic handler for getting a customer's current plan
 *
 * This handler can be used with any framework adapter.
 * The request should contain customerExternalId (can be in query string or body).
 *
 * @returns Handler function
 *
 * @example
 * ```typescript
 * // In Next.js route: /api/plans/current/route.ts
 * import { createGetCurrentHandler } from '@paid-ai/paid-node/integrations';
 * import { nextjsAdapter } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * const handler = createGetCurrentHandler();
 * export const GET = nextjsAdapter(handler);
 * ```
 */
export function createGetCurrentHandler(): (request: any, response: any, config?: any) => Promise<any> {
  return createHandler<PlansGetCurrentRequest, PlansGetCurrentResponse>(
    async (client, body, params) => {
      // Support customerExternalId from params (URL/query) or body
      const customerExternalId = params?.customerExternalId || body?.customerExternalId;

      if (!customerExternalId) {
        return {
          success: false,
          error: "customerExternalId is required",
          status: 400,
        };
      }

      const response = await getCurrent(client, { customerExternalId });
      return { success: true, data: response };
    },
    {
      allowedMethods: ['GET'],
      requireOrganizationId: false,
    }
  );
}
