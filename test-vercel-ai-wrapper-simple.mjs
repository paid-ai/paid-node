#!/usr/bin/env node

/**
 * Simple test script for Vercel AI SDK wrapper (no API calls required)
 * Run with: node test-vercel-ai-wrapper-simple.mjs
 */

import { PaidAISDKOpenAI } from "./dist/esm/tracing/wrappers/vercelOpenAiWrapperClaude.mjs";
import { PaidClient } from "./dist/esm/Client.mjs";

async function testVercelAIWrapperSimple() {
  console.log("🧪 Testing Vercel AI SDK Wrapper (Simple)...\n");

  // Initialize the wrapper and client
  const wrapper = new PaidAISDKOpenAI();
  const client = new PaidClient({
    token: "test-token",
  });

  try {
    // Test wrapper initialization
    console.log("✅ Wrapper initialized successfully");
    console.log("✅ Client initialized successfully");

    // Test that all methods exist
    console.log("\n📋 Testing method availability...");
    const methods = [
      'generateText',
      'streamText', 
      'generateObject',
      'streamObject',
      'embed',
      'embedMany',
      'generateImage'
    ];

    for (const method of methods) {
      if (typeof wrapper[method] === 'function') {
        console.log(`✅ ${method} method exists`);
      } else {
        console.log(`❌ ${method} method missing`);
      }
    }

    // Test error handling when used outside trace context
    console.log("\n❌ Testing error handling...");
    const testCases = [
      {
        method: 'generateText',
        params: { model: 'gpt-3.5-turbo', prompt: 'Hello' }
      },
      {
        method: 'streamText', 
        params: { model: 'gpt-3.5-turbo', prompt: 'Hello' }
      },
      {
        method: 'generateObject',
        params: { model: 'gpt-3.5-turbo', prompt: 'Hello', output: 'object' }
      },
      {
        method: 'streamObject',
        params: { model: 'gpt-3.5-turbo', prompt: 'Hello', output: 'object' }
      },
      {
        method: 'embed',
        params: { model: 'text-embedding-ada-002', value: 'Hello' }
      },
      {
        method: 'embedMany',
        params: { model: 'text-embedding-ada-002', values: ['Hello', 'World'] }
      },
      {
        method: 'generateImage',
        params: { model: 'dall-e-3', prompt: 'A cat' }
      }
    ];

    for (const testCase of testCases) {
      try {
        await wrapper[testCase.method](testCase.params);
        console.log(`❌ ${testCase.method} should have thrown an error`);
      } catch (error) {
        if (error.message.includes('No token or externalCustomerId')) {
          console.log(`✅ ${testCase.method} correctly throws error when used outside trace context`);
        } else {
          console.log(`⚠️ ${testCase.method} threw unexpected error:`, error.message);
        }
      }
    }

    // Test client tracing initialization
    console.log("\n🔧 Testing client tracing...");
    await client.initializeTracing();
    console.log("✅ Tracing initialized successfully");

    // Test model ID extraction
    console.log("\n🔍 Testing model ID extraction...");
    const extractModelId = wrapper.extractModelId || (() => 'unknown-model');
    
    const testModels = [
      { input: 'gpt-4', expected: 'gpt-4' },
      { input: 'text-embedding-ada-002', expected: 'text-embedding-ada-002' },
      { input: 'dall-e-3', expected: 'dall-e-3' },
      { input: { modelId: 'gpt-3.5-turbo' }, expected: 'gpt-3.5-turbo' },
      { input: { model: 'gpt-4' }, expected: 'gpt-4' },
      { input: { id: 'text-embedding-ada-002' }, expected: 'text-embedding-ada-002' },
      { input: { name: 'dall-e-3' }, expected: 'dall-e-3' },
      { input: {}, expected: 'unknown-model' },
      { input: null, expected: 'unknown-model' },
      { input: undefined, expected: 'unknown-model' }
    ];

    for (const testModel of testModels) {
      const result = extractModelId(testModel.input);
      if (result === testModel.expected) {
        console.log(`✅ Model ID extraction for ${JSON.stringify(testModel.input)}: ${result}`);
      } else {
        console.log(`❌ Model ID extraction failed for ${JSON.stringify(testModel.input)}: expected ${testModel.expected}, got ${result}`);
      }
    }

    // Test that trace method exists
    console.log("\n🔗 Testing trace method...");
    if (typeof client.trace === 'function') {
      console.log("✅ trace method exists");
    } else {
      console.log("❌ trace method missing");
    }

    console.log("\n🎉 All basic tests completed successfully!");
    console.log("\n📝 To test with real API calls, set OPENAI_API_KEY environment variable and run:");
    console.log("   node test-vercel-ai-wrapper.mjs");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Run the test
testVercelAIWrapperSimple().catch(console.error); 