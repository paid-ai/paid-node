import type { PaidClient } from "../../Client.js";
import type { Plan } from "../../api/types/Plan.js";
import type {
  OrderConfig,
  CompleteOrderConfig,
  OrderCreationResult,
  OrderOptions,
  OrderLineConfig
} from "../types.js";
import { createHandler } from "../utils/base-handler.js";
import { getPlanById } from "./plans.js";

type PlanProductWithExternalId = Plan.PlanProducts.Item & {
  product: { externalId: string; name: string; description?: string };
};

function hasProductWithExternalId(
  pp: Plan.PlanProducts.Item
): pp is PlanProductWithExternalId {
  if (!pp.product) {
    throw new Error(`Plan product ${pp.id} is missing nested product data`);
  }
  return !!pp.product.externalId;
}

/**
 * Generate default values for missing order fields
 */
function generateOrderDefaults(
  config: OrderConfig,
  options: OrderOptions = {}
): CompleteOrderConfig {
  const { defaultDurationDays = 365 } = options;

  const startDate = config.startDate || new Date().toISOString().split("T")[0];
  const endDate = config.endDate ||
    new Date(Date.now() + defaultDurationDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

  const name = config.name || "Subscription Order";
  const description = config.description || "Annual subscription";
  const currency = config.currency || "USD";

  // defensive guard
  if (!config.orderLines && !config.planId && !config.agentExternalId) {
    throw new Error("Either orderLines, planId, or agentExternalId must be provided");
  }

  const orderLines: OrderLineConfig[] = config.orderLines 
    ? config.orderLines.map(line => ({
        agentExternalId: line.agentExternalId,
        name: line.name || name,
        description: line.description || description,
        planProductId: line.planProductId ?? undefined,
      }))
    : [{
        agentExternalId: config.agentExternalId!,
        name,
        description,
      }];

  return {
    customerId: config.customerId,
    customerExternalId: config.customerExternalId,
    billingContactId: config.billingContactId,
    agentExternalId: config.agentExternalId,
    planId: config.planId,
    name,
    description,
    startDate,
    endDate,
    currency,
    orderLines,
  };
}

/**
 * Internal helper to create and optionally activate an order
 */
async function createAndActivateOrder(
  client: PaidClient,
  config: CompleteOrderConfig,
  autoActivate: boolean
): Promise<OrderCreationResult> {
  const order = await client.orders.create({
    customerId: config.customerId,
    customerExternalId: config.customerExternalId,
    billingContactId: config.billingContactId,
    name: config.name,
    description: config.description,
    startDate: config.startDate,
    endDate: config.endDate,
    currency: config.currency,
    orderLines: config.orderLines.map(line => {
      const orderLine: any = { agentExternalId: line.agentExternalId };
      if (line.name) orderLine.name = line.name;
      if (line.description) orderLine.description = line.description;
      if ((line as any).planProductId) orderLine.planProductId = (line as any).planProductId;
      return orderLine;
    }),
    planId: config.planId,
  });

  if (!order.id) {
    throw new Error("Order created but missing ID");
  }

  if (autoActivate && order.creationState === "draft") {
    try {
      await client.orders.activate(order.id);
      return {
        id: order.id,
        creationState: "active",
      };
    } catch (activationError) {
      console.error(
        `Error activating order ${order.id}:`,
        activationError instanceof Error
          ? activationError.message
          : "Unknown error"
      );
      return {
        id: order.id,
        creationState: order.creationState,
      };
    }
  }

  return {
    id: order.id,
    creationState: order.creationState,
  };
}

/**
 * Create an order with defaults for missing fields
 *
 * This helper generates reasonable defaults for dates, names, and other fields,
 * making it easy to create orders for prototyping and development.
 *
 * @param client - PaidClient instance
 * @param config - Order configuration (customerId, customerExternalId, agentExternalId required)
 * @param options - Additional options for order creation
 * @returns Created order with ID
 *
 * @example
 * ```typescript
 * const order = await createOrderWithDefaults(client, {
 *   customerId: 'cus_123',
 *   customerExternalId: 'user-123',
 *   agentExternalId: 'agent-prod'
 * });
 * // Generates: startDate, endDate (1 year), name, description, currency (USD)
 * ```
 */
export async function createOrderWithDefaults(
  client: PaidClient,
  config: OrderConfig,
  options: OrderOptions = {}
): Promise<OrderCreationResult> {
  const { autoActivate = true } = options;
  const completeConfig = generateOrderDefaults(config, options);
  return createAndActivateOrder(client, completeConfig, autoActivate);
}

/**
 * Create an order with explicit configuration (NO defaults applied)
 *
 * Required fields: customerId, customerExternalId, agentExternalId, name, description,
 * startDate, endDate, currency, orderLines
 *
 * Use createOrderWithDefaults() if you want automatic default values for missing fields.
 *
 * @param client - PaidClient instance
 * @param config - Complete order configuration with ALL required fields
 * @param options - Additional options for order creation
 * @returns Created order with ID
 * @throws Error if any required fields are missing
 *
 * @example
 * ```typescript
 * const order = await createOrder(client, {
 *   customerId: 'cus_123',
 *   customerExternalId: 'user-123',
 *   billingContactId: 'contact_123',
 *   agentExternalId: 'agent-prod',
 *   name: 'Pro Plan Subscription',
 *   description: 'Monthly subscription to Pro plan',
 *   startDate: '2024-01-01',
 *   endDate: '2025-01-01',
 *   currency: 'USD',
 *   orderLines: [{
 *     agentExternalId: 'agent-prod',
 *     name: 'Pro Plan',
 *     description: 'Pro plan features'
 *   }]
 * }, { autoActivate: true });
 * ```
 */
export async function createOrder(
  client: PaidClient,
  config: Required<OrderConfig>,
  options: OrderOptions = {}
): Promise<OrderCreationResult> {
  const { autoActivate = true } = options;
  return createAndActivateOrder(client, config as CompleteOrderConfig, autoActivate);
}

interface OrderRequest extends OrderConfig {
  autoActivate?: boolean;
}

/**
 * Create a framework-agnostic handler for order creation
 *
 * This handler can be used with any framework adapter.
 *
 * @param helperOptions - Default options for order creation
 * @returns Handler function
 */
export function createOrdersHandler(helperOptions?: OrderOptions): (request: any, response: any, config?: any) => Promise<any> {
  return createHandler<OrderRequest, OrderCreationResult>(
    async (client, body): Promise<any> => {
      if (!body.customerExternalId) {
        throw new Error("customerExternalId is required");
      }
      if (!body.agentExternalId && !body.planId) {
        throw new Error("agentExternalId or planId are required");
      }

      const orderOptions: OrderOptions = {
        ...helperOptions,
        autoActivate: body.autoActivate ?? helperOptions?.autoActivate ?? true,
      };

      if (body.planId) {
        const plan = await getPlanById(client, body.planId);
        if (!plan.planProducts?.length) {
          throw new Error(`Plan ${body.planId} has no products`);
        }
        
        body.orderLines = plan.planProducts
          .filter(hasProductWithExternalId)
          .map((pp) => ({
            agentExternalId: pp.product.externalId,
            name: pp.product.name,
            description: pp.product.description,
            planProductId: pp.id,
          }));
      }

      const order = await createOrderWithDefaults(client, body, orderOptions);
      return { success: true, data: order };
    },
    { requiredFields: ['customerExternalId'] }
  );
}
