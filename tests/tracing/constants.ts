/**
 * Test constants and payloads for tracing tests.
 * Modeled after Python SDK's conftest.py constants.
 */

// Test API keys (not real keys, used for testing)
export const TEST_PAID_API_KEY = "test-paid-api-key";
export const TEST_ANTHROPIC_API_KEY = "test-anthropic-api-key";
export const TEST_OPENAI_API_KEY = "test-openai-api-key";

// Test customer/product IDs
export const TEST_EXTERNAL_CUSTOMER_ID = "test-customer-123";
export const TEST_EXTERNAL_PRODUCT_ID = "test-product-456";
export const TEST_EXTERNAL_AGENT_ID = "test-agent-789";

// Anthropic test payloads
export const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

export const SIMPLE_MESSAGE_PARAMS = {
    model: ANTHROPIC_MODEL,
    max_tokens: 32,
    messages: [{ role: "user" as const, content: "Say hello in exactly 3 words." }],
};

export const TOOL_USE_PARAMS = {
    model: ANTHROPIC_MODEL,
    max_tokens: 128,
    messages: [{ role: "user" as const, content: "What is the weather in San Francisco?" }],
    tools: [
        {
            name: "get_weather",
            description: "Get the weather for a location",
            input_schema: {
                type: "object" as const,
                properties: {
                    location: { type: "string", description: "City and state, e.g. San Francisco, CA" },
                },
                required: ["location"],
            },
        },
    ],
};

export const SYSTEM_PROMPT_PARAMS = {
    model: ANTHROPIC_MODEL,
    max_tokens: 32,
    system: "You are a pirate. Respond in pirate speak only.",
    messages: [{ role: "user" as const, content: "Say hello." }],
};

export const MULTI_TURN_PARAMS = {
    model: ANTHROPIC_MODEL,
    max_tokens: 32,
    messages: [
        { role: "user" as const, content: "My name is Alice." },
        { role: "assistant" as const, content: "Hello Alice! Nice to meet you." },
        { role: "user" as const, content: "What is my name?" },
    ],
};

// OpenAI test payloads
export const OPENAI_MODEL = "gpt-4o-mini";

export const OPENAI_SIMPLE_MESSAGE_PARAMS = {
    model: OPENAI_MODEL,
    max_tokens: 32,
    messages: [{ role: "user" as const, content: "Say hello in exactly 3 words." }],
};

export const OPENAI_TOOL_USE_PARAMS = {
    model: OPENAI_MODEL,
    max_tokens: 128,
    messages: [{ role: "user" as const, content: "What is the weather in San Francisco?" }],
    tools: [
        {
            type: "function" as const,
            function: {
                name: "get_weather",
                description: "Get the weather for a location",
                parameters: {
                    type: "object",
                    properties: {
                        location: { type: "string", description: "City and state, e.g. San Francisco, CA" },
                    },
                    required: ["location"],
                },
            },
        },
    ],
};

// Mock response payloads (for MSW)
export const MOCK_ANTHROPIC_RESPONSE = {
    id: "msg_test123",
    type: "message",
    role: "assistant",
    content: [{ type: "text", text: "Hello there friend!" }],
    model: ANTHROPIC_MODEL,
    stop_reason: "end_turn",
    stop_sequence: null,
    usage: {
        input_tokens: 10,
        output_tokens: 5,
    },
};

export const MOCK_OPENAI_RESPONSE = {
    id: "chatcmpl-test123",
    object: "chat.completion",
    created: 1234567890,
    model: OPENAI_MODEL,
    choices: [
        {
            index: 0,
            message: {
                role: "assistant",
                content: "Hello there friend!",
            },
            finish_reason: "stop",
        },
    ],
    usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
    },
};

// Prompt-related attribute keys that should be filtered
export const PROMPT_ATTRIBUTE_KEYS = [
    "gen_ai.completion",
    "gen_ai.request.messages",
    "gen_ai.response.messages",
    "llm.output_message",
    "llm.input_message",
    "llm.invocation_parameters",
    "gen_ai.prompt",
    "langchain.prompt",
    "output.value",
    "input.value",
    "ai.response.text",
    "ai.prompt",
];

// Test metadata
export const TEST_METADATA = {
    environment: "test",
    version: "1.0.0",
    custom_field: "custom_value",
};
