# Testing the Vercel AI SDK Wrapper

This document explains how to test the Vercel AI SDK wrapper functionality within the Paid SDK.

## Quick Test Scripts

### Simple Test (No API Key Required)

The fastest way to test the basic functionality is using the simple test script:

```bash
# Make sure you have the required dependencies
npm install

# Build the project first
npm run build

# Run the simple test script (no API key required)
node test-vercel-ai-wrapper-simple.mjs
```

This script will test:
- ✅ Wrapper initialization
- ✅ Method availability (all 7 methods)
- ✅ Error handling when used outside trace context
- ✅ Client tracing initialization
- ✅ Model ID extraction logic
- ✅ Trace method availability

### Full Test (Requires OpenAI API Key)

For testing with real API calls:

```bash
# Set your OpenAI API key
export OPENAI_API_KEY="your-openai-api-key"

# Run the full test script
node test-vercel-ai-wrapper.mjs
```

This script will test all the wrapper methods with real API calls:
- `generateText` - Text generation with tracing
- `streamText` - Streaming text with tracing  
- `generateObject` - Structured object generation with tracing
- `streamObject` - Streaming structured objects with tracing
- `embed` - Embedding generation with tracing
- `embedMany` - Multiple embeddings with tracing
- `generateImage` - Image generation with tracing (if API key available)
- Error handling when used outside trace context

## Jest Tests

For more comprehensive testing, run the Jest test suite:

```bash
# Run all tests
npm test

# Run only the Vercel AI wrapper tests
npm test -- --testPathPattern=custom.test.ts
```

**Note**: The Jest tests focus on structure and error handling due to module resolution issues with the AI SDK.

## Manual Testing

You can also test the wrapper manually in your own code:

```typescript
import { PaidAISDKOpenAI } from "@paid-ai/paid-node";
import { PaidClient } from "@paid-ai/paid-node";
import { openai } from "@ai-sdk/openai";

// Initialize the client and wrapper
const client = new PaidClient({
  token: "your-api-key",
});

const wrapper = new PaidAISDKOpenAI();

// Initialize tracing
await client.initializeTracing();

// Test text generation
const result = await client.trace(
  "your-customer-id",
  async () => {
    return wrapper.generateText({
      model: openai("gpt-3.5-turbo"),
      prompt: "Hello, how are you?",
      maxTokens: 50,
    });
  },
  "your-agent-id"
);

console.log(result.text);
```

## What the Tests Verify

The tests verify that:

1. **Wrapper Structure**: All methods are properly defined and accessible
2. **Tracing Integration**: All AI operations are properly traced with OpenTelemetry
3. **Error Handling**: Proper error handling when used outside trace context
4. **Model ID Extraction**: Correct extraction of model IDs from various model formats
5. **Client Integration**: Proper integration with the PaidClient tracing system
6. **Method Availability**: All 7 wrapper methods are available:
   - `generateText`
   - `streamText`
   - `generateObject`
   - `streamObject`
   - `embed`
   - `embedMany`
   - `generateImage`

## Environment Setup

To run the tests with real API calls, you'll need:

1. **OpenAI API Key**: Set `OPENAI_API_KEY` environment variable
2. **Paid API Key**: Use a valid token in the client initialization
3. **Network Access**: Internet access for API calls

For testing without real API calls, the simple test script will still verify the wrapper structure and error handling.

## Troubleshooting

### Common Issues

1. **"No token or externalCustomerId" error**: Make sure to call `client.initializeTracing()` before using the wrapper
2. **Import errors**: Ensure all dependencies are installed (`@ai-sdk/openai`, `ai`)
3. **TypeScript errors**: Make sure you're using the correct import paths with `.js` extensions
4. **Jest module resolution**: The AI SDK may cause Jest issues - use the simple test script instead

### Debug Mode

To see detailed tracing information, set the log level:

```bash
export PAID_LOG_LEVEL=debug
node test-vercel-ai-wrapper-simple.mjs
```

## Integration with Your Project

To use this wrapper in your own project:

1. Install the dependencies:
   ```bash
   npm install @paid-ai/paid-node @ai-sdk/openai ai
   ```

2. Import and use the wrapper as shown in the manual testing example above

3. Make sure to initialize tracing before using any wrapper methods

The wrapper provides a drop-in replacement for the Vercel AI SDK functions with automatic OpenTelemetry tracing integration.

## Test Results

When you run the simple test, you should see output like:

```
🧪 Testing Vercel AI SDK Wrapper (Simple)...

✅ Wrapper initialized successfully
✅ Client initialized successfully

📋 Testing method availability...
✅ generateText method exists
✅ streamText method exists
✅ generateObject method exists
✅ streamObject method exists
✅ embed method exists
✅ embedMany method exists
✅ generateImage method exists

❌ Testing error handling...
✅ generateText correctly throws error when used outside trace context
✅ streamText correctly throws error when used outside trace context
✅ generateObject correctly throws error when used outside trace context
✅ streamObject correctly throws error when used outside trace context
✅ embed correctly throws error when used outside trace context
✅ embedMany correctly throws error when used outside trace context
✅ generateImage correctly throws error when used outside trace context

🔧 Testing client tracing...
✅ Tracing initialized successfully

🔍 Testing model ID extraction...
✅ Model ID extraction for "gpt-4": gpt-4
✅ Model ID extraction for "text-embedding-ada-002": text-embedding-ada-002
✅ Model ID extraction for "dall-e-3": dall-e-3
✅ Model ID extraction for {"modelId":"gpt-3.5-turbo"}: gpt-3.5-turbo
✅ Model ID extraction for {"model":"gpt-4"}: gpt-4
✅ Model ID extraction for {"id":"text-embedding-ada-002"}: text-embedding-ada-002
✅ Model ID extraction for {"name":"dall-e-3"}: dall-e-3
✅ Model ID extraction for {}: unknown-model
✅ Model ID extraction for null: unknown-model
✅ Model ID extraction for undefined: unknown-model

🔗 Testing trace method...
✅ trace method exists

🎉 All basic tests completed successfully!
``` 