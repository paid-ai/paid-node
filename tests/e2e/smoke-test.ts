/**
 * SDK Smoke Test Script
 *
 * This script tests the Paid SDK against the production API.
 * It covers the same functionality as the Playwright E2E tests but via the SDK.
 *
 * Test data is created with identifiable prefixes (SDK-YYYY-MM-DD-HHMM-commitHash)
 * to distinguish test data from production data.
 *
 * Test sequence:
 * 1. List and create products
 * 2. List and create customers
 * 3. List and create contacts
 * 4. List and create orders
 * 5. List invoices
 * 6. Clean up created test data
 */

import { PaidClient } from "../../dist/cjs/index.js";

const API_TOKEN = process.env.PAID_API_TOKEN;

if (!API_TOKEN) {
  console.error("Error: PAID_API_TOKEN environment variable is required");
  process.exit(1);
}

const client = new PaidClient({
  token: API_TOKEN,
});

// Get commit hash and readable timestamp for test data identification
const commitHash = process.env.COMMIT_HASH || "local";
const now = new Date();
const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
const timeStr = now.toISOString().slice(11, 16).replace(":", ""); // HHMM
const testPrefix = `SDK-${dateStr}-${timeStr}-${commitHash}`;

// Track created resources for cleanup
const createdResources: {
  productId?: string;
  customerId?: string;
  contactId?: string;
  orderId?: string;
} = {};

async function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

async function testListProducts() {
  log("Testing: List Products");
  const products = await client.products.listProducts({ limit: 5 });
  log(`  Found ${products.data?.length ?? 0} products`);
  return true;
}

async function testCreateProduct() {
  log("Testing: Create Product");
  const product = await client.products.createProduct({
    name: `${testPrefix}-Product`,
    description: "SDK smoke test product",
  });
  createdResources.productId = product.id;
  log(`  Created product: ${product.id} (${product.name})`);
  return true;
}

async function testGetProduct() {
  log("Testing: Get Product by ID");
  if (!createdResources.productId) {
    log("  Skipped: No product created");
    return false;
  }
  const product = await client.products.getProductById({
    id: createdResources.productId,
  });
  log(`  Retrieved product: ${product.id} (${product.name})`);
  return true;
}

async function testUpdateProduct() {
  log("Testing: Update Product");
  if (!createdResources.productId) {
    log("  Skipped: No product created");
    return false;
  }
  const product = await client.products.updateProductById({
    id: createdResources.productId,
    body: {
      description: "SDK smoke test product - updated",
    },
  });
  log(`  Updated product: ${product.id}`);
  return true;
}

async function testListCustomers() {
  log("Testing: List Customers");
  const customers = await client.customers.listCustomers({ limit: 5 });
  log(`  Found ${customers.data?.length ?? 0} customers`);
  return true;
}

async function testCreateCustomer() {
  log("Testing: Create Customer");
  const customer = await client.customers.createCustomer({
    name: `${testPrefix}-Customer`,
    billingAddress: {
      line1: "123 Test Street",
      city: "Test City",
      country: "US",
    },
  });
  createdResources.customerId = customer.id;
  log(`  Created customer: ${customer.id} (${customer.name})`);
  return true;
}

async function testGetCustomer() {
  log("Testing: Get Customer by ID");
  if (!createdResources.customerId) {
    log("  Skipped: No customer created");
    return false;
  }
  const customer = await client.customers.getCustomerById({
    id: createdResources.customerId,
  });
  log(`  Retrieved customer: ${customer.id} (${customer.name})`);
  return true;
}

async function testUpdateCustomer() {
  log("Testing: Update Customer");
  if (!createdResources.customerId) {
    log("  Skipped: No customer created");
    return false;
  }
  const customer = await client.customers.updateCustomerById({
    id: createdResources.customerId,
    body: {
      billingAddress: {
        line1: "456 Updated Street",
        city: "Updated City",
        country: "US",
      },
    },
  });
  log(`  Updated customer: ${customer.id}`);
  return true;
}

async function testListContacts() {
  log("Testing: List Contacts");
  const contacts = await client.contacts.listContacts({ limit: 5 });
  log(`  Found ${contacts.data?.length ?? 0} contacts`);
  return true;
}

async function testCreateContact() {
  log("Testing: Create Contact");
  if (!createdResources.customerId) {
    log("  Skipped: No customer created");
    return false;
  }
  const contact = await client.contacts.createContact({
    customerId: createdResources.customerId,
    firstName: "Test",
    lastName: "Contact",
    email: `${testPrefix}@example.com`,
  });
  createdResources.contactId = contact.id;
  log(`  Created contact: ${contact.id} (${contact.firstName} ${contact.lastName})`);
  return true;
}

async function testGetContact() {
  log("Testing: Get Contact by ID");
  if (!createdResources.contactId) {
    log("  Skipped: No contact created");
    return false;
  }
  const contact = await client.contacts.getContactById({
    id: createdResources.contactId,
  });
  log(`  Retrieved contact: ${contact.id}`);
  return true;
}

async function testListOrders() {
  log("Testing: List Orders");
  const orders = await client.orders.listOrders({ limit: 5 });
  log(`  Found ${orders.data?.length ?? 0} orders`);
  return true;
}

async function testCreateOrder() {
  log("Testing: Create Order");
  if (!createdResources.customerId) {
    log("  Skipped: No customer created");
    return false;
  }
  const order = await client.orders.createOrder({
    customerId: createdResources.customerId,
  });
  createdResources.orderId = order.id;
  log(`  Created order: ${order.id}`);
  return true;
}

async function testGetOrder() {
  log("Testing: Get Order by ID");
  if (!createdResources.orderId) {
    log("  Skipped: No order created");
    return false;
  }
  const order = await client.orders.getOrderById({
    id: createdResources.orderId,
  });
  log(`  Retrieved order: ${order.id}`);
  return true;
}

async function testGetOrderLines() {
  log("Testing: Get Order Lines");
  if (!createdResources.orderId) {
    log("  Skipped: No order created");
    return false;
  }
  const lines = await client.orders.getOrderLines({
    id: createdResources.orderId,
  });
  log(`  Found ${lines.data?.length ?? 0} order lines`);
  return true;
}

async function testListInvoices() {
  log("Testing: List Invoices");
  const invoices = await client.invoices.listInvoices({ limit: 5 });
  log(`  Found ${invoices.data?.length ?? 0} invoices`);
  return true;
}

// Cleanup functions
async function cleanupOrder() {
  if (createdResources.orderId) {
    log("Cleanup: Deleting Order");
    try {
      await client.orders.deleteOrderById({ id: createdResources.orderId });
      log(`  Deleted order: ${createdResources.orderId}`);
    } catch (error: any) {
      log(`  Failed to delete order: ${error.message}`);
    }
  }
}

async function cleanupContact() {
  if (createdResources.contactId) {
    log("Cleanup: Deleting Contact");
    try {
      await client.contacts.deleteContactById({ id: createdResources.contactId });
      log(`  Deleted contact: ${createdResources.contactId}`);
    } catch (error: any) {
      log(`  Failed to delete contact: ${error.message}`);
    }
  }
}

async function cleanupCustomer() {
  if (createdResources.customerId) {
    log("Cleanup: Deleting Customer");
    try {
      await client.customers.deleteCustomerById({ id: createdResources.customerId });
      log(`  Deleted customer: ${createdResources.customerId}`);
    } catch (error: any) {
      log(`  Failed to delete customer: ${error.message}`);
    }
  }
}

// Note: Products don't have a delete endpoint in the SDK

async function main() {
  log("=".repeat(60));
  log("Starting Paid SDK Smoke Tests");
  log("=".repeat(60));

  const results: { test: string; passed: boolean; error?: string }[] = [];

  const tests = [
    { name: "List Products", fn: testListProducts },
    { name: "Create Product", fn: testCreateProduct },
    { name: "Get Product", fn: testGetProduct },
    { name: "Update Product", fn: testUpdateProduct },
    { name: "List Customers", fn: testListCustomers },
    { name: "Create Customer", fn: testCreateCustomer },
    { name: "Get Customer", fn: testGetCustomer },
    { name: "Update Customer", fn: testUpdateCustomer },
    { name: "List Contacts", fn: testListContacts },
    { name: "Create Contact", fn: testCreateContact },
    { name: "Get Contact", fn: testGetContact },
    { name: "List Orders", fn: testListOrders },
    { name: "Create Order", fn: testCreateOrder },
    { name: "Get Order", fn: testGetOrder },
    { name: "Get Order Lines", fn: testGetOrderLines },
    { name: "List Invoices", fn: testListInvoices },
  ];

  for (const test of tests) {
    try {
      const passed = await test.fn();
      results.push({ test: test.name, passed });
    } catch (error: any) {
      log(`  ERROR: ${error.message}`);
      results.push({ test: test.name, passed: false, error: error.message });
    }
  }

  // Cleanup
  log("");
  log("=".repeat(60));
  log("Cleaning up test data");
  log("=".repeat(60));

  await cleanupOrder();
  await cleanupContact();
  await cleanupCustomer();
  // Note: Products cannot be deleted via SDK

  // Summary
  log("");
  log("=".repeat(60));
  log("Test Results Summary");
  log("=".repeat(60));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";
    const error = result.error ? ` (${result.error})` : "";
    log(`  [${status}] ${result.test}${error}`);
  }

  log("");
  log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  log("=".repeat(60));

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
