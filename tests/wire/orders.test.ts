/**
 * This file was auto-generated by Fern from our API Definition.
 */

import { mockServerPool } from "../mock-server/MockServerPool.js";
import { PaidClient } from "../../src/Client";

describe("Orders", () => {
    test("list", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });

        const rawResponseBody = [
            {
                id: "id",
                name: "name",
                description: "description",
                customerId: "customerId",
                organizationId: "organizationId",
                startDate: "startDate",
                endDate: "endDate",
                totalAmount: 1.1,
                estimatedTax: 1.1,
                billedAmountNoTax: 1.1,
                billedTax: 1.1,
                totalBilledAmount: 1.1,
                pendingBillingAmount: 1.1,
                creationState: "active",
                orderLines: [{}],
                customer: {
                    id: "id",
                    organizationId: "organizationId",
                    name: "name",
                    externalId: "externalId",
                    phone: "phone",
                    employeeCount: 1.1,
                    annualRevenue: 1.1,
                    taxExemptStatus: "none",
                    creationSource: "manual",
                    creationState: "active",
                    website: "website",
                    billingAddress: {
                        line1: "line1",
                        city: "city",
                        state: "state",
                        zipCode: "zipCode",
                        country: "country",
                    },
                },
            },
        ];
        server.mockEndpoint().get("/orders").respondWith().statusCode(200).jsonBody(rawResponseBody).build();

        const response = await client.orders.list();
        expect(response).toEqual([
            {
                id: "id",
                name: "name",
                description: "description",
                customerId: "customerId",
                organizationId: "organizationId",
                startDate: "startDate",
                endDate: "endDate",
                totalAmount: 1.1,
                estimatedTax: 1.1,
                billedAmountNoTax: 1.1,
                billedTax: 1.1,
                totalBilledAmount: 1.1,
                pendingBillingAmount: 1.1,
                creationState: "active",
                orderLines: [{}],
                customer: {
                    id: "id",
                    organizationId: "organizationId",
                    name: "name",
                    externalId: "externalId",
                    phone: "phone",
                    employeeCount: 1.1,
                    annualRevenue: 1.1,
                    taxExemptStatus: "none",
                    creationSource: "manual",
                    creationState: "active",
                    website: "website",
                    billingAddress: {
                        line1: "line1",
                        city: "city",
                        state: "state",
                        zipCode: "zipCode",
                        country: "country",
                    },
                },
            },
        ]);
    });

    test("create", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });
        const rawRequestBody = {
            customerId: "customerId",
            billingContactId: "billingContactId",
            name: "name",
            startDate: "startDate",
            currency: "currency",
        };
        const rawResponseBody = {
            id: "id",
            name: "name",
            description: "description",
            customerId: "customerId",
            organizationId: "organizationId",
            startDate: "startDate",
            endDate: "endDate",
            totalAmount: 1.1,
            estimatedTax: 1.1,
            billedAmountNoTax: 1.1,
            billedTax: 1.1,
            totalBilledAmount: 1.1,
            pendingBillingAmount: 1.1,
            creationState: "active",
            orderLines: [
                {
                    id: "id",
                    orderId: "orderId",
                    agentId: "agentId",
                    name: "name",
                    description: "description",
                    startDate: "startDate",
                    endDate: "endDate",
                    totalAmount: 1.1,
                    billedAmountWithoutTax: 1.1,
                    billedTax: 1.1,
                    totalBilledAmount: 1.1,
                    creationState: "active",
                    agent: { id: "id", organizationId: "organizationId", name: "name", active: true },
                    orderLineAttributes: [{}],
                },
            ],
            customer: {
                id: "id",
                organizationId: "organizationId",
                name: "name",
                externalId: "externalId",
                phone: "phone",
                employeeCount: 1.1,
                annualRevenue: 1.1,
                taxExemptStatus: "none",
                creationSource: "manual",
                creationState: "active",
                website: "website",
                billingAddress: {
                    line1: "line1",
                    line2: "line2",
                    city: "city",
                    state: "state",
                    zipCode: "zipCode",
                    country: "country",
                },
            },
        };
        server
            .mockEndpoint()
            .post("/orders")
            .jsonBody(rawRequestBody)
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.orders.create({
            customerId: "customerId",
            billingContactId: "billingContactId",
            name: "name",
            startDate: "startDate",
            currency: "currency",
        });
        expect(response).toEqual({
            id: "id",
            name: "name",
            description: "description",
            customerId: "customerId",
            organizationId: "organizationId",
            startDate: "startDate",
            endDate: "endDate",
            totalAmount: 1.1,
            estimatedTax: 1.1,
            billedAmountNoTax: 1.1,
            billedTax: 1.1,
            totalBilledAmount: 1.1,
            pendingBillingAmount: 1.1,
            creationState: "active",
            orderLines: [
                {
                    id: "id",
                    orderId: "orderId",
                    agentId: "agentId",
                    name: "name",
                    description: "description",
                    startDate: "startDate",
                    endDate: "endDate",
                    totalAmount: 1.1,
                    billedAmountWithoutTax: 1.1,
                    billedTax: 1.1,
                    totalBilledAmount: 1.1,
                    creationState: "active",
                    agent: {
                        id: "id",
                        organizationId: "organizationId",
                        name: "name",
                        active: true,
                    },
                    orderLineAttributes: [{}],
                },
            ],
            customer: {
                id: "id",
                organizationId: "organizationId",
                name: "name",
                externalId: "externalId",
                phone: "phone",
                employeeCount: 1.1,
                annualRevenue: 1.1,
                taxExemptStatus: "none",
                creationSource: "manual",
                creationState: "active",
                website: "website",
                billingAddress: {
                    line1: "line1",
                    line2: "line2",
                    city: "city",
                    state: "state",
                    zipCode: "zipCode",
                    country: "country",
                },
            },
        });
    });

    test("get", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });

        const rawResponseBody = {
            id: "id",
            name: "name",
            description: "description",
            customerId: "customerId",
            organizationId: "organizationId",
            startDate: "startDate",
            endDate: "endDate",
            totalAmount: 1.1,
            estimatedTax: 1.1,
            billedAmountNoTax: 1.1,
            billedTax: 1.1,
            totalBilledAmount: 1.1,
            pendingBillingAmount: 1.1,
            creationState: "active",
            orderLines: [
                {
                    id: "id",
                    orderId: "orderId",
                    agentId: "agentId",
                    name: "name",
                    description: "description",
                    startDate: "startDate",
                    endDate: "endDate",
                    totalAmount: 1.1,
                    billedAmountWithoutTax: 1.1,
                    billedTax: 1.1,
                    totalBilledAmount: 1.1,
                    creationState: "active",
                    agent: { id: "id", organizationId: "organizationId", name: "name", active: true },
                    orderLineAttributes: [{}],
                },
            ],
            customer: {
                id: "id",
                organizationId: "organizationId",
                name: "name",
                externalId: "externalId",
                phone: "phone",
                employeeCount: 1.1,
                annualRevenue: 1.1,
                taxExemptStatus: "none",
                creationSource: "manual",
                creationState: "active",
                website: "website",
                billingAddress: {
                    line1: "line1",
                    line2: "line2",
                    city: "city",
                    state: "state",
                    zipCode: "zipCode",
                    country: "country",
                },
            },
        };
        server.mockEndpoint().get("/orders/orderId").respondWith().statusCode(200).jsonBody(rawResponseBody).build();

        const response = await client.orders.get("orderId");
        expect(response).toEqual({
            id: "id",
            name: "name",
            description: "description",
            customerId: "customerId",
            organizationId: "organizationId",
            startDate: "startDate",
            endDate: "endDate",
            totalAmount: 1.1,
            estimatedTax: 1.1,
            billedAmountNoTax: 1.1,
            billedTax: 1.1,
            totalBilledAmount: 1.1,
            pendingBillingAmount: 1.1,
            creationState: "active",
            orderLines: [
                {
                    id: "id",
                    orderId: "orderId",
                    agentId: "agentId",
                    name: "name",
                    description: "description",
                    startDate: "startDate",
                    endDate: "endDate",
                    totalAmount: 1.1,
                    billedAmountWithoutTax: 1.1,
                    billedTax: 1.1,
                    totalBilledAmount: 1.1,
                    creationState: "active",
                    agent: {
                        id: "id",
                        organizationId: "organizationId",
                        name: "name",
                        active: true,
                    },
                    orderLineAttributes: [{}],
                },
            ],
            customer: {
                id: "id",
                organizationId: "organizationId",
                name: "name",
                externalId: "externalId",
                phone: "phone",
                employeeCount: 1.1,
                annualRevenue: 1.1,
                taxExemptStatus: "none",
                creationSource: "manual",
                creationState: "active",
                website: "website",
                billingAddress: {
                    line1: "line1",
                    line2: "line2",
                    city: "city",
                    state: "state",
                    zipCode: "zipCode",
                    country: "country",
                },
            },
        });
    });

    test("delete", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });

        server.mockEndpoint().delete("/orders/orderId").respondWith().statusCode(200).build();

        const response = await client.orders.delete("orderId");
        expect(response).toEqual(undefined);
    });

    test("activate", async () => {
        const server = mockServerPool.createServer();
        const client = new PaidClient({ token: "test", environment: server.baseUrl });

        const rawResponseBody = {
            id: "id",
            name: "name",
            description: "description",
            customerId: "customerId",
            organizationId: "organizationId",
            startDate: "startDate",
            endDate: "endDate",
            totalAmount: 1.1,
            estimatedTax: 1.1,
            billedAmountNoTax: 1.1,
            billedTax: 1.1,
            totalBilledAmount: 1.1,
            pendingBillingAmount: 1.1,
            creationState: "active",
            orderLines: [
                {
                    id: "id",
                    orderId: "orderId",
                    agentId: "agentId",
                    name: "name",
                    description: "description",
                    startDate: "startDate",
                    endDate: "endDate",
                    totalAmount: 1.1,
                    billedAmountWithoutTax: 1.1,
                    billedTax: 1.1,
                    totalBilledAmount: 1.1,
                    creationState: "active",
                    agent: { id: "id", organizationId: "organizationId", name: "name", active: true },
                    orderLineAttributes: [{}],
                },
            ],
            customer: {
                id: "id",
                organizationId: "organizationId",
                name: "name",
                externalId: "externalId",
                phone: "phone",
                employeeCount: 1.1,
                annualRevenue: 1.1,
                taxExemptStatus: "none",
                creationSource: "manual",
                creationState: "active",
                website: "website",
                billingAddress: {
                    line1: "line1",
                    line2: "line2",
                    city: "city",
                    state: "state",
                    zipCode: "zipCode",
                    country: "country",
                },
            },
        };
        server
            .mockEndpoint()
            .post("/orders/orderId/activate")
            .respondWith()
            .statusCode(200)
            .jsonBody(rawResponseBody)
            .build();

        const response = await client.orders.activate("orderId");
        expect(response).toEqual({
            id: "id",
            name: "name",
            description: "description",
            customerId: "customerId",
            organizationId: "organizationId",
            startDate: "startDate",
            endDate: "endDate",
            totalAmount: 1.1,
            estimatedTax: 1.1,
            billedAmountNoTax: 1.1,
            billedTax: 1.1,
            totalBilledAmount: 1.1,
            pendingBillingAmount: 1.1,
            creationState: "active",
            orderLines: [
                {
                    id: "id",
                    orderId: "orderId",
                    agentId: "agentId",
                    name: "name",
                    description: "description",
                    startDate: "startDate",
                    endDate: "endDate",
                    totalAmount: 1.1,
                    billedAmountWithoutTax: 1.1,
                    billedTax: 1.1,
                    totalBilledAmount: 1.1,
                    creationState: "active",
                    agent: {
                        id: "id",
                        organizationId: "organizationId",
                        name: "name",
                        active: true,
                    },
                    orderLineAttributes: [{}],
                },
            ],
            customer: {
                id: "id",
                organizationId: "organizationId",
                name: "name",
                externalId: "externalId",
                phone: "phone",
                employeeCount: 1.1,
                annualRevenue: 1.1,
                taxExemptStatus: "none",
                creationSource: "manual",
                creationState: "active",
                website: "website",
                billingAddress: {
                    line1: "line1",
                    line2: "line2",
                    city: "city",
                    state: "state",
                    zipCode: "zipCode",
                    country: "country",
                },
            },
        });
    });
});
