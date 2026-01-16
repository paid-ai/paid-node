import type { BaseHandlerConfig } from "../../utils/base-handler.js";
import { nextjsAdapter } from "./base-adapter.js";
import type { OrderOptions } from "../../types.js";
import { createContactsHandler } from "../../controllers/contacts.js";
import { createCustomerInvoicesHandler } from "../../controllers/invoices.js";
import { createCustomersHandler, createGetCustomerHandler } from "../../controllers/customers.js";
import { createOrdersHandler } from "../../controllers/orders.js";
import { createProvisioningHandler } from "../../controllers/provision-users.js";
import { createActivateOrderSyncHandler, createPayInvoiceHandler, createSetupIntentHandler } from "../../controllers/billing.js";
import { 
  createGetPlanGroupByIdHandler,
  createGetGroupPlansHandler,
  createSubscribeHandler,
  createUnsubscribeHandler,
  createUpgradeHandler,
  createGetCurrentHandler
} from "../../controllers/plans.js";

type NextJsHandler = (request: any, context?: any) => Promise<any>;

export interface ActivateOrderSyncRouteConfig extends BaseHandlerConfig {
  /**
   * Default return URL for payment flow
   * Can be overridden by request body
   */
  defaultReturnUrl?: string;
}

/**
 * Create a Next.js API route handler for synchronous order activation
 *
 * This creates an endpoint that activates an order and immediately charges
 * the customer using a confirmation token from a payment provider.
 *
 * Organization ID is automatically fetched from the API key.
 *
 * @example
 * ```typescript
 * // src/app/api/orders/[orderId]/activate-sync/route.ts
 * import { createActivateOrderSyncRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createActivateOrderSyncRoute({
 *   defaultReturnUrl: process.env.NEXT_PUBLIC_BASE_URL + '/orders'
 * });
 * ```
 *
 * @example Client-side usage with route params
 * ```typescript
 * await fetch('/api/orders/ord_123/activate-sync', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     confirmationToken: 'pi_123_secret_456',
 *     returnUrl: 'https://example.com/return'
 *   })
 * });
 * ```
 *
 * @example Client-side usage with body params
 * ```typescript
 * await fetch('/api/orders/activate-sync', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     orderId: 'ord_123',
 *     confirmationToken: 'pi_123_secret_456'
 *   })
 * });
 * ```
 */
export function createActivateOrderSyncRoute(config: ActivateOrderSyncRouteConfig = {}): NextJsHandler {
  const handler = createActivateOrderSyncHandler(config.defaultReturnUrl);
  const adaptedHandler = nextjsAdapter(handler);
  const route: NextJsHandler = (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
  return route;
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
export function createContactsRoute(config: BaseHandlerConfig = {}): NextJsHandler {
  const handler = createContactsHandler();
  const adaptedHandler = nextjsAdapter(handler);
  const route: NextJsHandler = (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
  return route;
}

/**
 * Create a Next.js API route handler for fetching customer invoices
 *
 * Organization ID is automatically fetched from the API key.
 *
 * @example
 * ```typescript
 * // src/app/api/customers/[customerExternalId]/invoices/route.ts
 * import { createCustomerInvoicesRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const GET = createCustomerInvoicesRoute();
 * ```
 */
export function createCustomerInvoicesRoute(config: BaseHandlerConfig = {}): NextJsHandler {
  const handler = createCustomerInvoicesHandler();
  const adaptedHandler = nextjsAdapter(handler);
  const route: NextJsHandler = (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
  return route;
}

/**
 * Create a Next.js API route handler for fetching a customer by external ID
 *
 * @example
 * ```typescript
 * // src/app/api/customers/[customerExternalId]/route.ts
 * import { createGetCustomerRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const GET = createGetCustomerRoute();
 * ```
 */
export function createGetCustomerRoute(config: BaseHandlerConfig = {}): NextJsHandler {
  const handler = createGetCustomerHandler();
  const adaptedHandler = nextjsAdapter(handler);
  const route: NextJsHandler = (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
  return route;
}

/**
 * Create a Next.js API route handler for customer creation
 *
 * @example
 * ```typescript
 * // src/app/api/customers/route.ts
 * import { createCustomersRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createCustomersRoute();
 * ```
 *
 * @example With custom config
 * ```typescript
 * export const POST = createCustomersRoute({
 *   validate: async (body) => {
 *     if (!body.email.includes('@company.com')) {
 *       throw new Error('Only company emails allowed');
 *     }
 *   }
 * });
 * ```
 */
export function createCustomersRoute(config: BaseHandlerConfig = {}): NextJsHandler {
  const handler = createCustomersHandler();
  const adaptedHandler = nextjsAdapter(handler);
  const route: NextJsHandler = (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
  return route;
}

export interface OrdersRouteConfig extends BaseHandlerConfig {
  /**
   * Default helper options for order creation
   */
  helperOptions?: OrderOptions;
}

/**
 * Create a Next.js API route handler for order creation
 *
 * @example
 * ```typescript
 * // src/app/api/orders/route.ts
 * import { createOrdersRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createOrdersRoute();
 * ```
 *
 * @example With auto-activation disabled
 * ```typescript
 * export const POST = createOrdersRoute({
 *   helperOptions: { autoActivate: false }
 * });
 * ```
 */
export function createOrdersRoute(config: OrdersRouteConfig = {}): NextJsHandler {
  const handler = createOrdersHandler(config.helperOptions);
  const adaptedHandler = nextjsAdapter(handler);
  const route: NextJsHandler = (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
  return route;
}

/**
 * Create a Next.js API route handler for invoice payment
 *
 * Organization ID is automatically fetched from the API key.
 *
 * @example
 * ```typescript
 * // src/app/api/invoices/[invoiceId]/pay/route.ts
 * import { createPayInvoiceRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createPayInvoiceRoute();
 * ```
 */
export function createPayInvoiceRoute(config: BaseHandlerConfig = {}): NextJsHandler {
  const handler = createPayInvoiceHandler();
  const adaptedHandler = nextjsAdapter(handler);
  const route: NextJsHandler = (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
  return route;
}

export interface ProvisioningRouteConfig extends BaseHandlerConfig {
  /**
   * Default agent external ID
   * Can be overridden by request body
   */
  defaultAgentExternalId?: string;

  /**
   * Default order options
   */
  orderOptions?: OrderOptions;
}

/**
 * Create a Next.js API route handler for user provisioning
 *
 * This creates a single endpoint that provisions a complete user
 * with customer, contact, and optional order.
 *
 * @example
 * ```typescript
 * // src/app/api/provision/route.ts
 * import { createProvisioningRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createProvisioningRoute({
 *   defaultAgentExternalId: process.env.PAID_AGENT_ID
 * });
 * ```
 *
 * @example Client-side usage
 * ```typescript
 * await fetch('/api/provision', {
 *   method: 'POST',
 *   body: JSON.stringify({ email: 'user@example.com' })
 * });
 * ```
 */
export function createProvisioningRoute(config: ProvisioningRouteConfig = {}): NextJsHandler {
  const handler = createProvisioningHandler(
    config.orderOptions,
    config.defaultAgentExternalId
  );
  const adaptedHandler = nextjsAdapter(handler);
  const route: NextJsHandler = (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
  return route;
}

export interface SetupIntentRouteConfig extends BaseHandlerConfig {
  /**
   * Default return URL for setup flow
   * Can be overridden by request body
   */
  defaultReturnUrl?: string;
}

/**
 * Create a Next.js API route handler for setup intent creation
 *
 * Setup intents are used to add payment methods without immediate charge.
 * This is useful for saving payment methods for future billing.
 *
 * Organization ID is automatically fetched from the API key.
 *
 * @example
 * ```typescript
 * // src/app/api/payment-methods/setup/route.ts
 * import { createSetupIntentRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createSetupIntentRoute({
 *   defaultReturnUrl: process.env.NEXT_PUBLIC_BASE_URL + '/billing'
 * });
 * ```
 *
 * @example Client-side usage
 * ```typescript
 * await fetch('/api/payment-methods/setup', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     customerId: 'cus_123',
 *     confirmationToken: 'seti_123_secret_456',
 *     returnUrl: 'https://example.com/billing',
 *     metadata: { source: 'settings_page' }
 *   })
 * });
 * ```
 */
export function createSetupIntentRoute(config: SetupIntentRouteConfig = {}): NextJsHandler {
  const handler = createSetupIntentHandler(config.defaultReturnUrl);
  const adaptedHandler = nextjsAdapter(handler);
  const route: NextJsHandler = (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
  return route;
}

/**
 * Create a Next.js API route handler for getting a plan group by ID
 *
 * @param config - Handler configuration options
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * // src/app/api/plans/[planGroupId]/route.ts
 * import { createGetPlanGroupByIdRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const GET = createGetPlanGroupByIdRoute();
 * ```
 */
export function createGetPlanGroupByIdRoute(config: BaseHandlerConfig = {}) {
  const handler = createGetPlanGroupByIdHandler();
  const adaptedHandler = nextjsAdapter(handler);
  return (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
}

/**
 * Create a Next.js API route handler for getting all plans in a plan group
 *
 * @param config - Handler configuration options
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * // src/app/api/plans/[planGroupId]/plans/route.ts
 * import { createGetGroupPlansRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const GET = createGetGroupPlansRoute();
 * ```
 */
export function createGetGroupPlansRoute(config: BaseHandlerConfig = {}) {
  const handler = createGetGroupPlansHandler();
  const adaptedHandler = nextjsAdapter(handler);
  return (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
}

/**
 * Create a Next.js API route handler for subscribing a customer to a plan
 *
 * @param config - Handler configuration options
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * // src/app/api/plans/[planId]/subscribe/route.ts
 * import { createSubscribeRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createSubscribeRoute();
 * ```
 */
export function createSubscribeRoute(config: BaseHandlerConfig = {}) {
  const handler = createSubscribeHandler();
  const adaptedHandler = nextjsAdapter(handler);
  return (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
}

/**
 * Create a Next.js API route handler for unsubscribing a customer from a plan
 *
 * @param config - Handler configuration options
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * // src/app/api/plans/[planId]/unsubscribe/route.ts
 * import { createUnsubscribeRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createUnsubscribeRoute();
 * ```
 */
export function createUnsubscribeRoute(config: BaseHandlerConfig = {}) {
  const handler = createUnsubscribeHandler();
  const adaptedHandler = nextjsAdapter(handler);
  return (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
}

/**
 * Create a Next.js API route handler for upgrading a customer's plan
 *
 * @param config - Handler configuration options
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * // src/app/api/plans/upgrade/route.ts
 * import { createUpgradeRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const POST = createUpgradeRoute();
 * ```
 */
export function createUpgradeRoute(config: BaseHandlerConfig = {}) {
  const handler = createUpgradeHandler();
  const adaptedHandler = nextjsAdapter(handler);
  return (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
}

/**
 * Create a Next.js API route handler for getting a customer's current plan
 *
 * @param config - Handler configuration options
 * @returns Next.js route handler function
 *
 * @example
 * ```typescript
 * // src/app/api/plans/current/[customerExternalId]/route.ts
 * // GET /api/plans/current/customer-123
 * import { createGetCurrentRoute } from '@paid-ai/paid-node/integrations/nextjs';
 *
 * export const GET = createGetCurrentRoute();
 * ```
 */
export function createGetCurrentRoute(config: BaseHandlerConfig = {}) {
  const handler = createGetCurrentHandler();
  const adaptedHandler = nextjsAdapter(handler);
  return (request: any, context?: any): Promise<any> => adaptedHandler(request, context, config);
}
