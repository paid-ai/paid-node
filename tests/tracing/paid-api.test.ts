/**
 * Paid API SDK tests.
 *
 * Tests the Paid SDK client against recorded HTTP responses using nock.back.
 * This replaces the original e2e smoke-test.ts that required a live API connection.
 *
 * Uses nock.back to record/replay HTTP interactions (similar to pytest-vcr).
 *
 * Recording cassettes:
 *   PAID_API_TOKEN=... NOCK_BACK_MODE=record pnpm test --project tracing -- paid-api
 *
 * Running with recorded cassettes (default):
 *   pnpm test --project tracing -- paid-api
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import nock from "nock";
import path from "path";
import { PaidClient } from "../../src";

// Configure nock.back for cassette recording/playback
const cassettesDir = path.join(__dirname, "cassettes");
nock.back.fixtures = cassettesDir;

// Set mode based on environment variable (default: lockdown for CI)
const nockMode = (process.env.NOCK_BACK_MODE as nock.BackMode) || "lockdown";
nock.back.setMode(nockMode);

// Helper to get cassette filename from test name
function getCassetteName(testName: string): string {
    return `${testName.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
}

describe("Paid API SDK", () => {
    let client: PaidClient;

    // Track created resources for dependent tests
    let createdProductId: string | undefined;
    let createdCustomerId: string | undefined;
    let createdContactId: string | undefined;
    let createdOrderId: string | undefined;

    beforeAll(() => {
        client = new PaidClient({
            token: process.env.PAID_API_TOKEN || "test-api-token",
        });
    });

    afterAll(() => {
        nock.restore();
        nock.cleanAll();
    });

    describe("Products", () => {
        it("should list products", async () => {
            const cassetteName = getCassetteName("paid_list_products");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const products = await client.products.listProducts({ limit: 5 });

                expect(products.data).toBeDefined();
                expect(Array.isArray(products.data)).toBe(true);
            } finally {
                nockDone();
            }
        });

        it("should create a product", async () => {
            const cassetteName = getCassetteName("paid_create_product");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const product = await client.products.createProduct({
                    name: "SDK-Test-Product",
                    description: "SDK smoke test product",
                });

                expect(product.id).toBeDefined();
                expect(product.name).toBe("SDK-Test-Product");
                expect(product.description).toBe("SDK smoke test product");

                createdProductId = product.id;
            } finally {
                nockDone();
            }
        });

        it("should get a product by ID", async () => {
            const cassetteName = getCassetteName("paid_get_product");
            const { nockDone } = await nock.back(cassetteName);

            try {
                // Use recorded ID or the one we created
                const productId = createdProductId || "prod_test";
                const product = await client.products.getProductById({
                    id: productId,
                });

                expect(product.id).toBe(productId);
                expect(product.name).toBeDefined();
            } finally {
                nockDone();
            }
        });

        it("should update a product", async () => {
            const cassetteName = getCassetteName("paid_update_product");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const productId = createdProductId || "prod_test";
                const product = await client.products.updateProductById({
                    id: productId,
                    body: {
                        description: "SDK smoke test product - updated",
                    },
                });

                expect(product.id).toBe(productId);
                expect(product.description).toBe("SDK smoke test product - updated");
            } finally {
                nockDone();
            }
        });
    });

    describe("Customers", () => {
        it("should list customers", async () => {
            const cassetteName = getCassetteName("paid_list_customers");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const customers = await client.customers.listCustomers({ limit: 5 });

                expect(customers.data).toBeDefined();
                expect(Array.isArray(customers.data)).toBe(true);
            } finally {
                nockDone();
            }
        });

        it("should create a customer", async () => {
            const cassetteName = getCassetteName("paid_create_customer");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const customer = await client.customers.createCustomer({
                    name: "SDK-Test-Customer",
                    billingAddress: {
                        line1: "123 Test Street",
                        city: "Test City",
                        country: "US",
                    },
                });

                expect(customer.id).toBeDefined();
                expect(customer.name).toBe("SDK-Test-Customer");

                createdCustomerId = customer.id;
            } finally {
                nockDone();
            }
        });

        it("should get a customer by ID", async () => {
            const cassetteName = getCassetteName("paid_get_customer");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const customerId = createdCustomerId || "cust_test";
                const customer = await client.customers.getCustomerById({
                    id: customerId,
                });

                expect(customer.id).toBe(customerId);
                expect(customer.name).toBeDefined();
            } finally {
                nockDone();
            }
        });

        it("should update a customer", async () => {
            const cassetteName = getCassetteName("paid_update_customer");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const customerId = createdCustomerId || "cust_test";
                const customer = await client.customers.updateCustomerById({
                    id: customerId,
                    body: {
                        billingAddress: {
                            line1: "456 Updated Street",
                            city: "Updated City",
                            country: "US",
                        },
                    },
                });

                expect(customer.id).toBe(customerId);
                expect(customer.billingAddress?.line1).toBe("456 Updated Street");
            } finally {
                nockDone();
            }
        });
    });

    describe("Contacts", () => {
        it("should list contacts", async () => {
            const cassetteName = getCassetteName("paid_list_contacts");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const contacts = await client.contacts.listContacts({ limit: 5 });

                expect(contacts.data).toBeDefined();
                expect(Array.isArray(contacts.data)).toBe(true);
            } finally {
                nockDone();
            }
        });

        it("should create a contact", async () => {
            const cassetteName = getCassetteName("paid_create_contact");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const customerId = createdCustomerId || "cust_test";
                const contact = await client.contacts.createContact({
                    customerId: customerId,
                    firstName: "Test",
                    lastName: "Contact",
                    email: "sdk-test@example.com",
                });

                expect(contact.id).toBeDefined();
                expect(contact.firstName).toBe("Test");
                expect(contact.lastName).toBe("Contact");
                expect(contact.email).toBe("sdk-test@example.com");

                createdContactId = contact.id;
            } finally {
                nockDone();
            }
        });

        it("should get a contact by ID", async () => {
            const cassetteName = getCassetteName("paid_get_contact");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const contactId = createdContactId || "cont_test";
                const contact = await client.contacts.getContactById({
                    id: contactId,
                });

                expect(contact.id).toBe(contactId);
                expect(contact.firstName).toBeDefined();
            } finally {
                nockDone();
            }
        });
    });

    describe("Orders", () => {
        it("should list orders", async () => {
            const cassetteName = getCassetteName("paid_list_orders");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const orders = await client.orders.listOrders({ limit: 5 });

                expect(orders.data).toBeDefined();
                expect(Array.isArray(orders.data)).toBe(true);
            } finally {
                nockDone();
            }
        });

        it("should create an order", async () => {
            const cassetteName = getCassetteName("paid_create_order");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const customerId = createdCustomerId || "cust_test";
                const order = await client.orders.createOrder({
                    customerId: customerId,
                });

                expect(order.id).toBeDefined();

                createdOrderId = order.id;
            } finally {
                nockDone();
            }
        });

        it("should get an order by ID", async () => {
            const cassetteName = getCassetteName("paid_get_order");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const orderId = createdOrderId || "ord_test";
                const order = await client.orders.getOrderById({
                    id: orderId,
                });

                expect(order.id).toBe(orderId);
            } finally {
                nockDone();
            }
        });

        it("should get order lines", async () => {
            const cassetteName = getCassetteName("paid_get_order_lines");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const orderId = createdOrderId || "ord_test";
                const lines = await client.orders.getOrderLines({
                    id: orderId,
                });

                expect(lines.data).toBeDefined();
                expect(Array.isArray(lines.data)).toBe(true);
            } finally {
                nockDone();
            }
        });
    });

    describe("Invoices", () => {
        it("should list invoices", async () => {
            const cassetteName = getCassetteName("paid_list_invoices");
            const { nockDone } = await nock.back(cassetteName);

            try {
                const invoices = await client.invoices.listInvoices({ limit: 5 });

                expect(invoices.data).toBeDefined();
                expect(Array.isArray(invoices.data)).toBe(true);
            } finally {
                nockDone();
            }
        });
    });
});
