/**
 * This file was auto-generated by Fern from our API Definition.
 */

import { mockServerPool } from "../mock-server/MockServerPool.js";
import { PaidClient } from "../../src/Client";

describe("Usage", () => {
    test("recordBulk", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });
        const rawRequestBody = {};
        const rawResponseBody = [];
        server
            .mockEndpoint()
            .post("/usage/signals/bulk")
            .jsonBody(rawRequestBody)
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.usage.recordBulk();
        expect(response).toEqual([]);
    });
});
