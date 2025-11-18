/**
 * Next.js API Route handlers for Paid integration
 * Drop-in handlers for Next.js App Router
 */

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
} from './routes.js';
