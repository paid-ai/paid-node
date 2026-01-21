
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

## Cost Tracking via OTEL tracing

You can track usage costs by using Paid wrappers around your AI provider's SDK.
As of now, the following SDKs' APIs are wrapped:

```
openai
anthropic
mistral
langchain (as a callback)
vercel (Vercel AI SDK)
```

### Using the Paid wrappers

Example usage with OpenAI:

```typescript
import { initializeTracing, trace } from "@paid-ai/paid-node/tracing";
import { PaidOpenAI } from "@paid-ai/paid-node/openai";
import OpenAI from "openai";

async function main() {
    // Initialize cost tracking
    initializeTracing("<your_paid_api_key>");

    // Wrap OpenAI in paid wrapper
    const openaiClient = new OpenAI({ apiKey: "<your_openai_api_key>" });
    const paidOpenAI = new PaidOpenAI(openaiClient);

    // Trace the call
    await trace({
        externalCustomerId: "<your_external_customer_id>",
        externalProductId: "<optional_external_product_id>"
    }, async () => {
        const response = await paidOpenAI.images.generate({
            prompt: "A beautiful sunset over the mountains",
            n: 1,
            size: "256x256"
        });
        if (response.data) {
            console.log("Image generation:", response.data[0].url);
        }
    });
}
```

### Auto-Instrumentation (OpenTelemetry Instrumentors)

For maximum convenience, you can use OpenTelemetry auto-instrumentation to automatically track costs without modifying your AI library calls. This approach uses official OpenTelemetry instrumentors for supported AI libraries.

#### Quick start

``` typescript
// Import and call auto-instrumentation before importing instrumented libraries
import { paidAutoInstrument } from "@paid-ai/paid-node/tracing";
await paidAutoInstrument()

import openai from "openai";

// All OpenAI calls will be automatically traced
const openAIclient = new openai.OpenAI({ apiKey: "API_KEY" })
```

#### Supported libraries

Auto-instrumentation supports the following AI libraries:

```
openai
anthropic
bedrock
```

#### Vercel AI SDK Integration

If you're using Vercel's AI SDK, you can enable automatic telemetry without any wrappers by using the `experimental_telemetry` option. When enabled, it will automatically use Paid's registered tracer provider:

```typescript
import { initializeTracing, trace } from "@paid-ai/paid-node/tracing";
import { generateText } from "ai";

async function main() {
    initializeTracing("<your_paid_api_key>");

    await trace({
        externalCustomerId: "<your_external_customer_id>",
        externalProductId: "<your_external_product_id>"
    }, async () => {
        await generateText({
            model: "model-name",
            prompt: "Your prompt",
            experimental_telemetry: { isEnabled: true }, // This will use Paid's tracer automatically
        });
    });
}
```

#### Manual instrumentation

``` typescript
import { paidAutoInstrument } from "@paid-ai/paid-node/tracing";
import openai from "openai";

// If your module management is too complex and the previous approach didn't work
// you can provide libraries directly
await paidAutoInstrument({ openai })
```



## Signaling via OTEL tracing

A more reliable and user-friendly way to send signals is to send them via OTEL tracing.
This allows you to send signals with less arguments and boilerplate as the information is available in the tracing context `trace()`.
The interface is `signal()`, which takes in signal name, optional enableCostTracing flag, and optional data.
`signal()` has to be called within a trace - meaning inside of a callback to `trace()`.
In contrast to `Paid.usage.recordBulk()`, `signal()` is using OpenTelemetry to provide reliable delivery.

Here's an example of how to use it:

```typescript
import { initializeTracing, trace, signal } from "@paid-ai/paid-node/tracing";

async function main() {
    // Initialize tracing
    initializeTracing("<your_paid_api_key>");

    // Trace the call
    await trace({
        externalCustomerId: "<your_external_customer_id>",
        externalProductId: "<your_external_product_id>" // external_product_id is required for signals
    }, async () => {
        // ...do some work...
        signal("<your_signal_name>", false, { /* optional data */ });
    });
}
```

### Signal-costs - Attaching cost traces to a signal

If you want a signal to carry information about costs,
then the signal should be sent from the same tracing context
as the wrappers that recorded those costs.

This will look something like this:

```typescript
import { initializeTracing, trace, signal } from "@paid-ai/paid-node/tracing";
import { PaidOpenAI } from "@paid-ai/paid-node/openai";
import OpenAI from "openai";

async function main() {
    initializeTracing("<your_paid_api_key>");

    const openaiClient = new OpenAI({ apiKey: "<your_openai_api_key>" });
    const paidOpenAI = new PaidOpenAI(openaiClient);

    await trace({
        externalCustomerId: "<your_external_customer_id>",
        externalProductId: "<your_external_product_id>"
    }, async () => {
        // ... your workflow logic
        // ... your AI calls made through Paid wrappers
        const response = await paidOpenAI.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: "Hello!" }]
        });

        // Send signal with cost tracing enabled
        signal(
            "<your_signal_name>",
            true, // enableCostTracing - set this flag to associate it with costs
            { /* optional data */ }
        );

        // ... your workflow logic
        // ... your AI calls made through Paid wrappers (can be sent after the signal too)
    });
}
```

Then, all of the costs traced in `trace()` context are related to that signal.

## Manual Cost Tracking

If you would prefer to not use Paid to track your costs automatically but you want to send us the costs yourself,
then you can use manual cost tracking mechanism. Just attach the cost information in the following format to a signal payload:

```typescript
import { PaidClient, Paid } from "@paid-ai/paid-node";

const client = new PaidClient({ token: "<your_paid_api_key>" });

const signal: Paid.Signal = {
    event_name: "<your_signal_name>",
    agent_id: "<your_agent_id>",
    customer_id: "<your_external_customer_id>",
    data: {
        costData: {
            vendor: "<any_vendor_name>", // can be anything, traces are grouped by vendors in the UI
            cost: {
                amount: 0.002,
                currency: "USD"
            },
            "gen_ai.response.model": "<ai_model_name>",
        }
    }
};

await client.usage.recordBulk({ signals: [signal] });
await client.usage.flush(); // need to flush to send usage immediately
```

Alternatively the same `costData` payload can be passed to OTLP signaling mechanism:

```typescript
import { initializeTracing, trace, signal } from "@paid-ai/paid-node/tracing";

async function main() {
    initializeTracing("<your_paid_api_key>");

    await trace({
        externalCustomerId: "<your_external_customer_id>",
        externalProductId: "<your_external_product_id>"
    }, async () => {
        // ...do some work...
        signal("<your_signal_name>", false, {
            costData: {
                vendor: "<any_vendor_name>", // can be anything, traces are grouped by vendors in the UI
                cost: {
                    amount: 0.002,
                    currency: "USD"
                },
                "gen_ai.response.model": "<ai_model_name>",
            }
        });
    });
}
```

### Manual Usage Tracking

If you would prefer to send us raw usage manually (without wrappers) and have us compute the cost, you can attach usage data in the following format:

```typescript
import { PaidClient, Paid } from "@paid-ai/paid-node";

const client = new PaidClient({ token: "<your_paid_api_key>" });

const signal: Paid.Signal = {
    event_name: "<your_signal_name>",
    agent_id: "<your_agent_id>",
    customer_id: "<your_external_customer_id>",
    data: {
        costData: {
            vendor: "<any_vendor_name>", // can be anything, traces are grouped by vendors in the UI
            attributes: {
                "gen_ai.response.model": "gpt-4-turbo",
                "gen_ai.usage.input_tokens": 100,
                "gen_ai.usage.output_tokens": 300,
                "gen_ai.usage.cached_input_tokens": 600,
            },
        }
    }
};

await client.usage.recordBulk({ signals: [signal] });
await client.usage.flush();
```

Same but via OTEL signaling:

```typescript
import { initializeTracing, trace, signal } from "@paid-ai/paid-node/tracing";

async function main() {
    initializeTracing("<your_paid_api_key>");

    await trace({
        externalCustomerId: "<your_external_customer_id>",
        externalProductId: "<your_external_product_id>"
    }, async () => {
        // ...do some work...
        signal("<your_signal_name>", false, {
            costData: {
                vendor: "<any_vendor_name>", // can be anything, traces are grouped by vendors in the UI
                attributes: {
                    "gen_ai.response.model": "gpt-4-turbo",
                    "gen_ai.usage.input_tokens": 100,
                    "gen_ai.usage.output_tokens": 300,
                    "gen_ai.usage.cached_input_tokens": 600,
                },
            }
        });
    });
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

### Paid OTEL Tracer Provider

If you would like to use the Paid OTEL tracer provider, you can access it via the `getPaidTracerProvider` function.

```typescript
import { initializeTracing, getPaidTracerProvider } from "@paid-ai/paid-node/tracing";
initializeTracing("<your_paid_api_key>");
const tracerProvider = getPaidTracerProvider();
```

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!
