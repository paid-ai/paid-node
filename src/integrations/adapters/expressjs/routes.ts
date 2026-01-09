/**
 * ExpressJS route helpers for Paid SDK
 * These functions create handlers compatible with ExpressJS controllers
 */

import type { Request, Response } from "express";
import type { BaseHandlerConfig } from "../../utils/base-handler.js";
import { createExpressJSResponseContext } from "./base-adapter.js";
import type { OrderOptions } from "../../types.js";
import { createContactsHandler } from "../../controllers/contacts.js";
import { createCustomerInvoicesHandler } from "../../controllers/invoices.js";
import { createCustomersHandler, createGetCustomerHandler } from "../../controllers/customers.js";
import { createOrdersHandler } from "../../controllers/orders.js";
import { createProvisioningHandler } from "../../controllers/provision-users.js";
import {
  createActivateOrderSyncHandler,
  createPayInvoiceHandler,
  createSetupIntentHandler,
} from "../../controllers/billing.js";

type ExpressHandler = (req: Request, res: Response) => Promise<any>;

/**
 * Helper to extract headers from Express Request
 */
function extractHeaders(req: Request): Record<string, string> {
  const headers: Record<string, string> = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (typeof value === "string") {
      headers[key] = value;
    } else if (Array.isArray(value)) {
      headers[key] = value.join(", ");
    }
  });
  return headers;
}

export interface ActivateOrderSyncRouteConfig extends BaseHandlerConfig {
  defaultReturnUrl?: string;
}

/**
 * Create an Express handler for synchronous order activation
 *
 * Use this in your Express app to handle order activation with payment.
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createActivateOrderSyncRoute } from '@paid-ai/paid-node/integrations/express';
 *
 * const app = express();
 * const activateOrderSyncHandler = createActivateOrderSyncRoute();
 *
 * app.post('/paid/payments/activate-order-sync', activateOrderSyncHandler);
 * ```
 *
 * @example With NestJS
 * ```typescript
 * import { Controller, Post, Req, Res } from '@nestjs/common';
 * import { Request, Response } from 'express';
 * import { createActivateOrderSyncRoute } from '@paid-ai/paid-node/integrations/nestjs';
 *
 * @Controller('paid/payments')
 * export class PaymentsController {
 *   private activateOrderSyncHandler = createActivateOrderSyncRoute();
 *
 *   @Post('activate-order-sync')
 *   async activateOrderSync(@Req() req: Request, @Res() res: Response) {
 *     return this.activateOrderSyncHandler(req, res);
 *   }
 * }
 * ```
 */
export function createActivateOrderSyncRoute(config: ActivateOrderSyncRouteConfig = {}): ExpressHandler {
  const handler = createActivateOrderSyncHandler(config.defaultReturnUrl);

  const route: ExpressHandler = (req: Request, res: Response): Promise<any> => {
    return handler(
      {
        body: req.body,
        headers: extractHeaders(req),
        method: "POST" as const,
        params: req.params,
      },
      createExpressJSResponseContext(res),
      config
    );
  };
  return route;
}

/**
 * Create an Express handler for contact creation
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createContactsRoute } from '@paid-ai/paid-node/integrations/express';
 *
 * const app = express();
 * app.post('/paid/contacts', createContactsRoute());
 * ```
 */
export function createContactsRoute(config: BaseHandlerConfig = {}): ExpressHandler {
  const handler = createContactsHandler();

  const route: ExpressHandler = (req: Request, res: Response): Promise<any> => {
    return handler(
      {
        body: req.body,
        headers: extractHeaders(req),
        method: "POST" as const,
        params: req.params,
      },
      createExpressJSResponseContext(res),
      config
    );
  };
  return route;
}

/**
 * Create an Express handler for fetching customer invoices
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createCustomerInvoicesRoute } from '@paid-ai/paid-node/integrations/express';
 *
 * const app = express();
 * app.get('/paid/customers/:customerExternalId/invoices', createCustomerInvoicesRoute());
 * ```
 */
export function createCustomerInvoicesRoute(config: BaseHandlerConfig = {}): ExpressHandler {
  const handler = createCustomerInvoicesHandler();

  const route: ExpressHandler = (req: Request, res: Response): Promise<any> => {
    return handler(
      {
        body: req.body,
        headers: extractHeaders(req),
        method: "GET" as const,
        params: req.params,
      },
      createExpressJSResponseContext(res),
      config
    );
  };
  return route;
}

/**
 * Create an Express handler for fetching a customer by external ID
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createGetCustomerRoute } from '@paid-ai/paid-node/integrations/express';
 *
 * const app = express();
 * app.get('/paid/customers/:customerExternalId', createGetCustomerRoute());
 * ```
 */
export function createGetCustomerRoute(config: BaseHandlerConfig = {}): ExpressHandler {
  const handler = createGetCustomerHandler();

  const route: ExpressHandler = (req: Request, res: Response): Promise<any> => {
    return handler(
      {
        body: req.body,
        headers: extractHeaders(req),
        method: "GET" as const,
        params: req.params,
      },
      createExpressJSResponseContext(res),
      config
    );
  };
  return route;
}

/**
 * Create an Express handler for customer creation
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createCustomersRoute } from '@paid-ai/paid-node/integrations/express';
 *
 * const app = express();
 * app.post('/paid/customers', createCustomersRoute());
 * ```
 */
export function createCustomersRoute(config: BaseHandlerConfig = {}): ExpressHandler {
  const handler = createCustomersHandler();

  const route: ExpressHandler = (req: Request, res: Response): Promise<any> => {
    return handler(
      {
        body: req.body,
        headers: extractHeaders(req),
        method: "POST" as const,
        params: req.params,
      },
      createExpressJSResponseContext(res),
      config
    );
  };
  return route;
}

export interface OrdersRouteConfig extends BaseHandlerConfig {
  helperOptions?: OrderOptions;
}

/**
 * Create an Express handler for order creation
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createOrdersRoute } from '@paid-ai/paid-node/integrations/express';
 *
 * const app = express();
 * app.post('/paid/orders', createOrdersRoute({ helperOptions: { autoActivate: true } }));
 * ```
 */
export function createOrdersRoute(config: OrdersRouteConfig = {}): ExpressHandler {
  const handler = createOrdersHandler(config.helperOptions);

  const route: ExpressHandler = (req: Request, res: Response): Promise<any> => {
    return handler(
      {
        body: req.body,
        headers: extractHeaders(req),
        method: "POST" as const,
        params: req.params,
      },
      createExpressJSResponseContext(res),
      config
    );
  };
  return route;
}

/**
 * Create an Express handler for invoice payment
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createPayInvoiceRoute } from '@paid-ai/paid-node/integrations/express';
 *
 * const app = express();
 * app.post('/paid/invoices/:invoiceId/pay', createPayInvoiceRoute());
 * ```
 */
export function createPayInvoiceRoute(config: BaseHandlerConfig = {}): ExpressHandler {
  const handler = createPayInvoiceHandler();

  const route: ExpressHandler = (req: Request, res: Response): Promise<any> => {
    return handler(
      {
        body: req.body,
        headers: extractHeaders(req),
        method: "POST" as const,
        params: req.params,
      },
      createExpressJSResponseContext(res),
      config
    );
  };
  return route;
}

export interface ProvisioningRouteConfig extends BaseHandlerConfig {
  defaultAgentExternalId?: string;
  orderOptions?: OrderOptions;
}

/**
 * Create an Express handler for user provisioning
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createProvisioningRoute } from '@paid-ai/paid-node/integrations/express';
 *
 * const app = express();
 * app.post('/paid/provision', createProvisioningRoute({
 *   defaultAgentExternalId: process.env.PAID_AGENT_ID
 * }));
 * ```
 */
export function createProvisioningRoute(config: ProvisioningRouteConfig = {}): ExpressHandler {
  const handler = createProvisioningHandler(
    config.orderOptions,
    config.defaultAgentExternalId
  );

  const route: ExpressHandler = (req: Request, res: Response): Promise<any> => {
    return handler(
      {
        body: req.body,
        headers: extractHeaders(req),
        method: "POST" as const,
        params: req.params,
      },
      createExpressJSResponseContext(res),
      config
    );
  };
  return route;
}

export interface SetupIntentRouteConfig extends BaseHandlerConfig {
  defaultReturnUrl?: string;
}

/**
 * Create an Express handler for setup intent creation
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createSetupIntentRoute } from '@paid-ai/paid-node/integrations/express';
 *
 * const app = express();
 * app.post('/paid/payments/setup-intent', createSetupIntentRoute({
 *   defaultReturnUrl: process.env.APP_URL + '/billing'
 * }));
 * ```
 */
export function createSetupIntentRoute(config: SetupIntentRouteConfig = {}): ExpressHandler {
  const handler = createSetupIntentHandler(config.defaultReturnUrl);

  const route: ExpressHandler = (req: Request, res: Response): Promise<any> => {
    return handler(
      {
        body: req.body,
        headers: extractHeaders(req),
        method: "POST" as const,
        params: req.params,
      },
      createExpressJSResponseContext(res),
      config
    );
  };
  return route;
}
