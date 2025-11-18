/**
 * ExpressJS integration for Paid SDK
 * Drop-in handlers for ExpressJS controllers using Express Request/Response
 */

export { expressjsAdapter, createExpressJSResponseContext } from "./base-adapter.js";

export {
  createActivateOrderSyncRoute,
  createContactsRoute,
  createCustomerInvoicesRoute,
  createCustomersRoute,
  createGetCustomerRoute,
  createOrdersRoute,
  createPayInvoiceRoute,
  createProvisioningRoute,
  createSetupIntentRoute,
  type ActivateOrderSyncRouteConfig,
  type OrdersRouteConfig,
  type ProvisioningRouteConfig,
  type SetupIntentRouteConfig,
} from "./routes.js";
