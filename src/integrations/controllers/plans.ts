import { PaidClient } from "../../Client.js";
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
): Promise<any> {
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
): Promise<any> {
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
export function createGetPlanGroupByIdHandler() {
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
