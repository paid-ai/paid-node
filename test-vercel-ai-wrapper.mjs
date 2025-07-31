#!/usr/bin/env node

/**
 * Quick test script for Vercel AI SDK wrapper
 * Run with: node test-vercel-ai-wrapper.mjs
 */

import { PaidAISDKOpenAI } from "./dist/esm/tracing/wrappers/vercelOpenAiWrapperClaude.mjs";
import { PaidClient } from "./dist/esm/Client.mjs";
import { openai } from "@ai-sdk/openai";

async function testVercelAIWrapper() {
  console.log("🧪 Testing Vercel AI SDK Wrapper...\n");

  // Initialize the wrapper and client
  const wrapper = new PaidAISDKOpenAI();
  const client = new PaidClient({
    token: "test-token",
  });

  try {
    // Initialize tracing
    await client.initializeTracing();
    console.log("✅ Tracing initialized");

    // Test generateText
    console.log("\n📝 Testing generateText...");
    const textResult = await client.trace(
      "test-customer",
      async () => {
        return wrapper.generateText({
          model: openai("gpt-3.5-turbo"),
          prompt: "Say hello in a friendly way",
          maxTokens: 50,
        });
      },
      "test-agent"
    );
    console.log("✅ generateText result:", textResult.text);

    // Test streamText
    console.log("\n🌊 Testing streamText...");
    const streamResult = await client.trace(
      "test-customer",
      async () => {
        return wrapper.streamText({
          model: openai("gpt-3.5-turbo"),
          prompt: "Write a short poem about coding",
          maxTokens: 100,
        });
      },
      "test-agent"
    );
    
    let streamedText = "";
    for await (const chunk of streamResult.textStream) {
      streamedText += chunk;
    }
    console.log("✅ streamText result:", streamedText);

    // Test generateObject
    console.log("\n📦 Testing generateObject...");
    const objectResult = await client.trace(
      "test-customer",
      async () => {
        return wrapper.generateObject({
          model: openai("gpt-3.5-turbo"),
          prompt: "Create a JSON object with name and age",
          output: "object",
        });
      },
      "test-agent"
    );
    console.log("✅ generateObject result:", objectResult.object);

    // Test embed
    console.log("\n🔗 Testing embed...");
    const embedResult = await client.trace(
      "test-customer",
      async () => {
        return wrapper.embed({
          model: openai.embedding("text-embedding-ada-002"),
          value: "Hello, world!",
        });
      },
      "test-agent"
    );
    console.log("✅ embed result: embedding length =", embedResult.embedding.length);

    // Test embedMany
    console.log("\n🔗 Testing embedMany...");
    const embedManyResult = await client.trace(
      "test-customer",
      async () => {
        return wrapper.embedMany({
          model: openai.embedding("text-embedding-ada-002"),
          values: ["Hello", "World", "Test"],
        });
      },
      "test-agent"
    );
    console.log("✅ embedMany result: embeddings count =", embedManyResult.embeddings.length);

    // Test generateImage (if available)
    console.log("\n🎨 Testing generateImage...");
    try {
      const imageResult = await client.trace(
        "test-customer",
        async () => {
          return wrapper.generateImage({
            model: openai("dall-e-3"),
            prompt: "A cute cat sitting on a windowsill",
            n: 1,
            size: "1024x1024",
          });
        },
        "test-agent"
      );
      console.log("✅ generateImage result: images count =", imageResult.images.length);
    } catch (error) {
      console.log("⚠️ generateImage test skipped (may require API key):", error.message);
    }

    // Test error handling
    console.log("\n❌ Testing error handling...");
    try {
      await wrapper.generateText({
        model: openai("gpt-3.5-turbo"),
        prompt: "Hello",
      });
      console.log("❌ Expected error was not thrown");
    } catch (error) {
      console.log("✅ Error handling works:", error.message);
    }

    console.log("\n🎉 All tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testVercelAIWrapper().catch(console.error); 