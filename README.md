<div align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./assets/paid_light.svg" width=600>
        <source media="(prefers-color-scheme: light)" srcset="./assets/paid_dark.svg" width=600>
        <img alt="Fallback image description" src="./assets/paid_light.svg" width=600>
    </picture>
</div>

#

<div align="center">
    <a href="https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2FAgentPaid%2Fpaid-node">
        <img src="https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen" alt="fern shield">
    </a>
    <a href="https://www.npmjs.com/package/@paid-ai/paid-node">
        <img src="https://img.shields.io/npm/v/@paid-ai/paid-node" alt="npm shield">
    </a>
</div>

Paid is the all-in-one, drop-in Business Engine for AI Agents that handles your pricing, subscriptions, margins, billing, and renewals with just 5 lines of code.
The Paid TypeScript library provides convenient access to the Paid API from TypeScript.

## Documentation

See the full documentation at [docs.paid.ai](https://docs.paid.ai), and the [API reference](https://docs.paid.ai/api-reference).
Every method this SDK exposes is listed in [reference.md](./reference.md).

## Installation

```sh
npm install -s @paid-ai/paid-node
```

## Usage

The client needs to be configured with your account's API key, which is available in the [Paid dashboard](https://app.paid.ai/settings/api-keys).

```typescript
import { PaidClient } from "@paid-ai/paid-node";

const client = new PaidClient({ token: "API_KEY" });

await client.customers.createCustomer({
    name: "name",
});
```

## Request And Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { Paid } from "@paid-ai/paid-node";

const request: Paid.CreateCustomerRequest = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { PaidError } from "@paid-ai/paid-node";

try {
    await client.customers.createCustomer(...);
} catch (err) {
    if (err instanceof PaidError) {
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.body);
        console.log(err.rawResponse);
    }
}
```

## Sending Signals

A signal is one usage event: something your agent did for a customer, such as sending an email or
running a workflow. Meters and usage prices select signals by `eventName`. Send them in batches with
`client.signals.createSignals()`.

Each signal names its customer with `customer` (by Paid ID or by your external ID), its customer unit
with `customerUnit`, or both; at least one is required. `attribution` names the product the usage is for,
`timestamp` is the true event time (it defaults to the time Paid receives the signal), `data` is your own
event payload, and `idempotencyKey` lets you retry a batch safely: a signal whose key was already sent is
skipped and counted in `duplicates` instead of `ingested`.

```typescript
import { PaidClient } from "@paid-ai/paid-node";

const client = new PaidClient({ token: "<your_paid_api_key>" });

const response = await client.signals.createSignals({
    signals: [
        {
            eventName: "email_sent",
            customer: { externalCustomerId: "<your_external_customer_id>" },
            attribution: { externalProductId: "<your_external_product_id>" },
            timestamp: "2026-01-31T23:00:00Z",
            data: { recipients: 3 },
            idempotencyKey: "email_sent_msg_8f3a2c",
        },
    ],
});

console.log(response.ingested, response.duplicates, response.failed);
```

The top-level `data` keys `_derived`, `_dims` and `_billing` are reserved for Paid; a batch that uses one
is refused with `400 RESERVED_SIGNAL_DATA_FIELD`.

## Manual Cost Tracking

To see your margins, tell Paid what your agent's work cost you. Send costs in batches with
`client.costs.createCosts()`. Each record is attributed to a `customer` (by Paid ID or by your external
ID) and, optionally, to a `product`. `timestamp` defaults to the time Paid receives the record, and
`metadata` is free-form, for filtering and analytics.

There are two kinds of record, chosen by `type`:

- `cost`: you already know the amount. Send `amount` (in major units of `currency`, so dollars for `USD`)
  and `currency`. `vendor` and `model` are optional tags for analytics.
- `usage`: you send the raw token usage and Paid computes the cost from the vendor's and model's price.
  See [Manual Usage Tracking](#manual-usage-tracking) below.

The batch is all-or-nothing: if any record fails validation, the whole request is rejected with a 400 and
nothing is persisted. The response reports how many records were `ingested`.

```typescript
import { PaidClient } from "@paid-ai/paid-node";

const client = new PaidClient({ token: "<your_paid_api_key>" });

await client.costs.createCosts({
    costs: [
        {
            type: "cost",
            customer: { externalCustomerId: "<your_external_customer_id>" },
            product: { externalProductId: "<your_external_product_id>" }, // optional
            amount: 0.002,
            currency: "USD",
            vendor: "<any_vendor_name>", // optional, costs are grouped by vendor in the UI
            model: "<ai_model_name>", // optional, displayed in the UI
            timestamp: "2026-01-31T23:00:00Z", // optional, defaults to now
            metadata: { workflow: "<your_workflow_name>" }, // optional
        },
    ],
});
```

### Manual Usage Tracking

If you would rather send raw usage and have Paid compute the cost, send a `usage` record with the
provider name, the exact provider model ID and the token counts. `vendor` and `model` together select the
price. `inputTokens` is the non-cached input, matching Anthropic's `input_tokens` semantic; cached and
cache-creation input go in their own fields. Every token field is optional.

```typescript
import { PaidClient } from "@paid-ai/paid-node";

const client = new PaidClient({ token: "<your_paid_api_key>" });

await client.costs.createCosts({
    costs: [
        {
            type: "usage",
            customer: { externalCustomerId: "<your_external_customer_id>" },
            product: { externalProductId: "<your_external_product_id>" }, // optional
            vendor: "openai",
            model: "gpt-4o-2024-08-06",
            usage: {
                inputTokens: 100,
                outputTokens: 300,
                cacheReadInputTokens: 600,
                cacheCreationInputTokens: 250,
                reasoningOutputTokens: 50,
            },
        },
    ],
});
```

If you know what a call cost but still want the token breakdown recorded for analytics, add a
`costOverride`. It replaces Paid's price for that record:

```typescript
{
    type: "usage",
    customer: { externalCustomerId: "<your_external_customer_id>" },
    vendor: "anthropic",
    model: "claude-sonnet-4-5",
    usage: { inputTokens: 1200, outputTokens: 350 },
    costOverride: { amount: 0.0125, currency: "USD" },
}
```

## Advanced

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option.

```typescript
const response = await client.customers.createCustomer(..., {
    headers: {
        'X-Custom-Header': 'custom value'
    }
});
```

### Retries

The SDK is instrumented with automatic retries with exponential backoff. A request will be retried as long
as the request is deemed retryable and the number of retry attempts has not grown larger than the configured
retry limit (default: 2).

A request is deemed retryable when any of the following HTTP status codes is returned:

- [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
- [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
- [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) (Internal Server Errors)

Use the `maxRetries` request option to configure this behavior.

```typescript
const response = await client.customers.createCustomer(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.customers.createCustomer(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.customers.createCustomer(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Access Raw Response Data

The SDK provides access to raw response data, including headers, through the `.withRawResponse()` method.
The `.withRawResponse()` method returns a promise that results to an object with a `data` and a `rawResponse` property.

```typescript
const { data, rawResponse } = await client.customers.createCustomer(...).withRawResponse();

console.log(data);
console.log(rawResponse.headers['X-My-Header']);
```

### Runtime Compatibility

The SDK uses the global `fetch` client and works in the following runtimes:

- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
