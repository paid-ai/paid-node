
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

See the full API docs [here](https://paid.docs.buildwithfern.com/api-reference/api-reference/customers/list)

## Installation

```sh
npm install -s @paid-ai/paid-node
```

## Usage

The client needs to be configured with your account's API key, which is available in the [Paid dashboard](https://app.paid.ai/agent-integration/api-keys).

```typescript
import { PaidClient } from "@paid-ai/paid-node";

const client = new PaidClient({ token: "API_KEY" });

await client.customers.create({
    name: "name",
});
```

## Request And Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { Paid } from "@paid-ai/paid-node";

const request: Paid.CustomerCreate = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { PaidError } from "@paid-ai/paid-node";

try {
    await client.customers.create(...);
} catch (err) {
    if (err instanceof PaidError) {
        console.log(err.statusCode);
        console.log(err.message);
        console.log(err.body);
        console.log(err.rawResponse);
    }
}
```

## Logging
Logs are silent by default.

To enable logs, set the `PAID_LOG_LEVEL` environment variable. Available levels include:
`error`, `warn`, `info`, `http`, `verbose`, `debug`, and `silly`.

Example: `PAID_LOG_LEVEL=debug node your-app.js`

## Cost Tracking

It's possible to track usage costs by using Paid wrappers around you AI provider API.
As of now, the following AI providers are supported: `OpenAI`, `Anthropic`, `Mistral` (OCR), and `Langchain`.

Example usage:

```typescript
import { PaidClient, PaidOpenAI } from "@paid-ai/paid-node";
import OpenAI from "openai";

async function main() {
    const client = new PaidClient({ token: "<your_paid_api_key>" });

    // initialize cost tracking
    await client.initializeTracing()

    // wrap openai in paid wrapper
    const openaiClient = new OpenAI({ apiKey: "<your_openai_api_key" });
    const paidOpenAiWrapper = new PaidOpenAI(openaiClient);

    // trace the call
    await client.trace("<your_external_customer_id>", async () => {
        const response = await paidOpenAiWrapper.images.generate({
            prompt: "A beautiful sunset over the mountains",
            n: 1,
            size: "256x256"
        });
        if (response.data) {
            console.log("Image generation:", response.data[0].url);
        }
    }, "<optional_external_agent_id>");
}
```

## Manual Cost Tracking

When using `client.usage.recordUsage()` API, it's possible to create cost traces manually
just by passing in the cost data.

```typescript
const additionalData = {
    costData: {
        vendor: "<vendor_name>", // can be anything
        cost : {
            amount: 0.0001,
            currency: "USD"
        }
    }
};
await client.usage.recordUsage({
    agent_id: "<your_agent_id>",
    event_name: "<your_signal_name>",
    customer_id: "<your_customer_id>",
    data: additionalData,
})

await client.usage.flush(); // need to flush to send usage immediately
```

## Send signals over OTLP

Besides sending signals over REST, it's also possible to send signals as part or tracing
context, just like with cost tracking.

Example usage:

```typescript
import { PaidClient } from "@paid-ai/paid-node";

async function main() {
    const client = new PaidClient({ token: "<your_paid_api_key>" });

    // initialize cost tracking
    await client.initializeTracing()

    // trace the call
    await client.trace("<your_external_customer_id>", async () => {
        // ... your app logic, cost tracking LLM wrapper calls
        paid.signal("signal_name", { "optional": "data" });
    }, "<optional_external_agent_id>");
}
```

## Advanced

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option.

```typescript
const response = await client.customers.create(..., {
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
const response = await client.customers.create(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.customers.create(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.customers.create(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Access Raw Response Data

The SDK provides access to raw response data, including headers, through the `.withRawResponse()` method.
The `.withRawResponse()` method returns a promise that results to an object with a `data` and a `rawResponse` property.

```typescript
const { data, rawResponse } = await client.customers.create(...).withRawResponse();

console.log(data);
console.log(rawResponse.headers['X-My-Header']);
```

### Runtime Compatibility

The SDK defaults to `node-fetch` but will use the global fetch client if present. The SDK works in the following
runtimes:

- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

### Customizing Fetch Client

The SDK provides a way for you to customize the underlying HTTP client / Fetch function. If you're running in an
unsupported environment, this provides a way for you to break glass and ensure the SDK works.

```typescript
import { PaidClient } from "@paid-ai/paid-node";

const client = new PaidClient({
    ...
    fetcher: // provide your implementation here
});
```

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
