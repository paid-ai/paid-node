/**
 * Next.js API Route handlers for Paid integration
 * Drop-in handlers for Next.js App Router
 */

export { createCustomersRoute, type CustomersRouteConfig } from './customers-route.js';
export { createContactsRoute, type ContactsRouteConfig } from './contacts-route.js';
export { createOrdersRoute, type OrdersRouteConfig } from './orders-route.js';
export { createPayInvoiceRoute, type PayInvoiceRouteConfig } from './pay-invoice-route.js';
export { createCustomerInvoicesRoute, type CustomerInvoicesRouteConfig } from './customer-invoices-route.js';
export { createProvisioningRoute, type ProvisioningRouteConfig } from './provisioning-route.js';
