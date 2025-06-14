/**
 * This file was auto-generated by Fern from our API Definition.
 */

import { mockServerPool } from "../mock-server/MockServerPool.js";
import { PaidClient } from "../../src/Client";
import * as Paid from "../../src/api/index";

describe("Agents", () => {
    test("list", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });

        const rawResponseBody = [
            {
                id: "id",
                externalId: "externalId",
                organizationId: "organizationId",
                name: "name",
                description: "description",
                active: true,
                agentCode: "agentCode",
                agentAttributes: [
                    {
                        name: "name",
                        active: true,
                        pricing: {
                            taxable: true,
                            chargeType: "oneTime",
                            pricingModel: "PerUnit",
                            billingFrequency: "Monthly",
                            pricePoints: { key: {} },
                        },
                    },
                ],
            },
        ];
        server.mockEndpoint().get("/agents").respondWith().statusCode(200).jsonBody(rawResponseBody).build();

        const response = await client.agents.list();
        expect(response).toEqual([
            {
                id: "id",
                externalId: "externalId",
                organizationId: "organizationId",
                name: "name",
                description: "description",
                active: true,
                agentCode: "agentCode",
                agentAttributes: [
                    {
                        name: "name",
                        active: true,
                        pricing: {
                            taxable: true,
                            chargeType: "oneTime",
                            pricingModel: "PerUnit",
                            billingFrequency: "Monthly",
                            pricePoints: {
                                key: {},
                            },
                        },
                    },
                ],
            },
        ]);
    });

    test("create", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });
        const rawRequestBody = { name: "name", description: "description" };
        const rawResponseBody = {
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: { key: {} },
                    },
                },
            ],
        };
        server
            .mockEndpoint()
            .post("/agents")
            .jsonBody(rawRequestBody)
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.agents.create({
            name: "name",
            description: "description",
        });
        expect(response).toEqual({
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: {
                            key: {},
                        },
                    },
                },
            ],
        });
    });

    test("get", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });

        const rawResponseBody = {
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: { key: {} },
                    },
                },
            ],
        };
        server.mockEndpoint().get("/agents/agentId").respondWith().statusCode(200).jsonBody(rawResponseBody).build();

        const response = await client.agents.get("agentId");
        expect(response).toEqual({
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: {
                            key: {},
                        },
                    },
                },
            ],
        });
    });

    test("update", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });
        const rawRequestBody = {};
        const rawResponseBody = {
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: { key: {} },
                    },
                },
            ],
        };
        server
            .mockEndpoint()
            .put("/agents/agentId")
            .jsonBody(rawRequestBody)
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.agents.update("agentId", {});
        expect(response).toEqual({
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: {
                            key: {},
                        },
                    },
                },
            ],
        });
    });

    test("delete", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });

        server.mockEndpoint().delete("/agents/agentId").respondWith().statusCode(200).build();

        const response = await client.agents.delete("agentId");
        expect(response).toEqual(undefined);
    });

    test("getByExternalId", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });

        const rawResponseBody = {
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: { key: {} },
                    },
                },
            ],
        };
        server
            .mockEndpoint()
            .get("/agents/external/externalId")
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.agents.getByExternalId("externalId");
        expect(response).toEqual({
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: {
                            key: {},
                        },
                    },
                },
            ],
        });
    });

    test("updateByExternalId", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });
        const rawRequestBody = {};
        const rawResponseBody = {
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: { key: {} },
                    },
                },
            ],
        };
        server
            .mockEndpoint()
            .put("/agents/external/externalId")
            .jsonBody(rawRequestBody)
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.agents.updateByExternalId("externalId", {});
        expect(response).toEqual({
            id: "id",
            externalId: "externalId",
            organizationId: "organizationId",
            name: "name",
            description: "description",
            active: true,
            agentCode: "agentCode",
            agentAttributes: [
                {
                    name: "name",
                    active: true,
                    pricing: {
                        taxable: true,
                        chargeType: "oneTime",
                        pricingModel: "PerUnit",
                        billingFrequency: "Monthly",
                        pricePoints: {
                            key: {},
                        },
                    },
                },
            ],
        });
    });

    test("deleteByExternalId", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });

        server.mockEndpoint().delete("/agents/external/externalId").respondWith().statusCode(200).build();

        const response = await client.agents.deleteByExternalId("externalId");
        expect(response).toEqual(undefined);
    });
});
