# Reference
## Customers
<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">list</a>() -> Paid.Customer[]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.list();

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">create</a>({ ...params }) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.create({
    name: "Acme, Inc.",
    externalId: "acme-inc",
    contacts: [{
            salutation: "Mr.",
            firstName: "John",
            lastName: "Doe",
            accountName: "Acme, Inc.",
            email: "john.doe@acme.com",
            phone: "+1-555-0100",
            billingStreet: "123 Main Street",
            billingCity: "San Francisco",
            billingStateProvince: "CA",
            billingCountry: "USA",
            billingPostalCode: "94102"
        }]
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Paid.CustomerCreate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">get</a>(customerId) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.get("customerId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">update</a>(customerId, { ...params }) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.update("customerId", {
    name: "Acme, Inc. (Updated)",
    phone: "123-456-7890",
    employeeCount: 101,
    annualRevenue: 1000001
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.CustomerUpdate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">delete</a>(customerId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.delete("customerId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">checkEntitlement</a>(customerId, { ...params }) -> Paid.CustomersCheckEntitlementResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.checkEntitlement("customerId", {
    event_name: "event_name",
    view: "all"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `string` — The customer ID
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.CustomersCheckEntitlementRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getEntitlements</a>(customerId) -> Paid.EntitlementUsage[]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.getEntitlements("customerId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**customerId:** `string` — The customer ID
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getByExternalId</a>(externalId) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.getByExternalId("externalId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">updateByExternalId</a>(externalId, { ...params }) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.updateByExternalId("externalId", {});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.CustomerUpdate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteByExternalId</a>(externalId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.deleteByExternalId("externalId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCostsByExternalId</a>(externalId, { ...params }) -> Paid.CostTracesResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.getCostsByExternalId("externalId", {
    limit: 1,
    offset: 1,
    startTime: "2024-01-15T09:30:00Z",
    endTime: "2024-01-15T09:30:00Z"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` — The external ID of the customer
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.CustomersGetCostsByExternalIdRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getUsageByExternalId</a>(externalId, { ...params }) -> Paid.UsageSummariesResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.getUsageByExternalId("externalId", {
    limit: 1,
    offset: 1,
    startTime: "2024-01-15T09:30:00Z",
    endTime: "2024-01-15T09:30:00Z"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` — The external ID of the customer
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.CustomersGetUsageByExternalIdRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listPaymentMethods</a>(externalId) -> Paid.PaymentMethod[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves all payment methods associated with a customer identified by their external ID.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.listPaymentMethods("externalId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` — The external ID of the customer
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createPaymentMethod</a>(externalId, { ...params }) -> Paid.PaymentMethod</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new payment method for a customer using a Stripe confirmation token.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.createPaymentMethod("externalId", {
    confirmationToken: "ctoken_1234567890",
    returnUrl: "https://example.com/payment-method-added",
    metadata: {
        "source": "api"
    }
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` — The external ID of the customer
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.CustomersCreatePaymentMethodRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deletePaymentMethod</a>(externalId, paymentMethodId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a specific payment method from a customer's account.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.customers.deletePaymentMethod("externalId", "paymentMethodId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` — The external ID of the customer
    
</dd>
</dl>

<dl>
<dd>

**paymentMethodId:** `string` — The ID of the payment method to delete
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Customers.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Agents
<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">list</a>() -> Paid.Agent[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

DEPRECATED: Use /products instead. Agents are now products with type='agent'.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.list();

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">create</a>({ ...params }) -> Paid.Agent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

DEPRECATED: Use POST /products instead.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.create({
    name: "Acme Agent",
    description: "Acme Agent is an AI agent that does things.",
    externalId: "acme-agent"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Paid.AgentCreate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">get</a>(agentId) -> Paid.Agent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

DEPRECATED: Use GET /products/{productId} instead.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.get("agentId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">update</a>(agentId, { ...params }) -> Paid.Agent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

DEPRECATED: Use PUT /products/{productId} instead.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.update("agentId", {
    name: "Acme Agent (Updated)",
    agentAttributes: [{
            name: "Emails sent signal",
            active: true,
            pricing: {
                eventName: "emails_sent",
                taxable: true,
                chargeType: "usage",
                pricingModel: "PerUnit",
                billingFrequency: "monthly",
                pricePoints: {
                    "USD": {
                        tiers: [{
                                minQuantity: 0,
                                maxQuantity: 10,
                                unitPrice: 100
                            }, {
                                minQuantity: 11,
                                maxQuantity: 100,
                                unitPrice: 90
                            }, {
                                minQuantity: 101,
                                unitPrice: 80
                            }]
                    }
                }
            }
        }]
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.AgentUpdate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">delete</a>(agentId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

DEPRECATED: Use DELETE /products/{productId} instead.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.delete("agentId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**agentId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">getByExternalId</a>(externalId) -> Paid.Agent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

DEPRECATED: Use GET /products/external/{externalId} instead.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.getByExternalId("externalId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">updateByExternalId</a>(externalId, { ...params }) -> Paid.Agent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

DEPRECATED: Use PUT /products/external/{externalId} instead.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.updateByExternalId("externalId", {
    name: "Acme Agent (Updated)",
    agentAttributes: [{
            name: "Emails sent signal",
            active: true,
            pricing: {
                eventName: "emails_sent",
                taxable: true,
                chargeType: "usage",
                pricingModel: "PerUnit",
                billingFrequency: "monthly",
                pricePoints: {
                    "USD": {
                        unitPrice: 150
                    }
                }
            }
        }]
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.AgentUpdate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">deleteByExternalId</a>(externalId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

DEPRECATED: Use DELETE /products/external/{externalId} instead.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agents.deleteByExternalId("externalId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Agents.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Products
<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">list</a>() -> Paid.Product[]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.products.list();

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Products.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">create</a>({ ...params }) -> Paid.Product</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.products.create({
    name: "Acme Product",
    description: "Acme Product does amazing things.",
    externalId: "acme-product",
    type: "product"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Paid.ProductCreate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Products.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">get</a>(productId) -> Paid.Product</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.products.get("productId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**productId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Products.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">update</a>(productId, { ...params }) -> Paid.Product</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.products.update("productId", {});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**productId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.ProductUpdate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Products.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">delete</a>(productId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.products.delete("productId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**productId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Products.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">getByExternalId</a>(externalId) -> Paid.Product</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.products.getByExternalId("externalId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Products.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">updateByExternalId</a>(externalId, { ...params }) -> Paid.Product</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.products.updateByExternalId("externalId", {});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.ProductUpdate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Products.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">deleteByExternalId</a>(externalId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.products.deleteByExternalId("externalId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Products.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Contacts
<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">list</a>() -> Paid.Contact[]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.contacts.list();

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Contacts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">create</a>({ ...params }) -> Paid.Contact</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.contacts.create({
    customerExternalId: "acme-inc",
    salutation: "Mr.",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Paid.ContactCreate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Contacts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">get</a>(contactId) -> Paid.Contact</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.contacts.get("contactId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**contactId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Contacts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">delete</a>(contactId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.contacts.delete("contactId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**contactId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Contacts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">getByExternalId</a>(externalId) -> Paid.Contact</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.contacts.getByExternalId("externalId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Contacts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">deleteByExternalId</a>(externalId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.contacts.deleteByExternalId("externalId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**externalId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Contacts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Orders
<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">list</a>() -> Paid.Order[]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.list();

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Orders.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">create</a>({ ...params }) -> Paid.Order</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.create({
    customerExternalId: "acme-inc",
    name: "Acme Order",
    description: "Acme Order is an order for Acme, Inc.",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    currency: "USD"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Paid.OrderCreate` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Orders.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">get</a>(orderId) -> Paid.Order</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.get("orderId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orderId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Orders.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">delete</a>(orderId) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.delete("orderId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orderId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Orders.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">activate</a>(orderId) -> Paid.Order</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.activate("orderId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orderId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Orders.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">activateAndPay</a>(orderId, { ...params }) -> Paid.Order</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Activates the order and processes the initial payment using the provided Stripe confirmation token.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.activateAndPay("orderId", {
    confirmationToken: "ctoken_1234567890",
    returnUrl: "https://example.com/payment-complete"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orderId:** `string` — The order ID (can be internal ID or display ID)
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.OrdersActivateAndPayRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Orders.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">cancelRenewal</a>(orderId, { ...params }) -> Paid.CancelRenewalResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Schedules the cancellation of an order's renewal from a specified date. The order will remain active until the cancellation date.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.cancelRenewal("orderId", {
    orderVersion: 1,
    cancelFromDate: "2025-12-31T00:00:00Z"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orderId:** `string` — The order ID (can be internal ID or display ID)
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.CancelRenewalRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Orders.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">schedulePlanChange</a>(orderId, { ...params }) -> Paid.ProrationUpgradeResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Schedules a plan upgrade or downgrade for an order with automatic proration calculation. Credits are applied for the unused portion of the current billing period.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.schedulePlanChange("orderId", {
    orderVersion: 1,
    effectiveDate: "2025-02-01T00:00:00Z",
    updatedOrderLineAttributes: [{
            orderLineAttributeId: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
            newPricing: {
                "unitPrice": 200,
                "currency": "USD"
            },
            newQuantity: 10
        }]
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orderId:** `string` — The order ID (can be internal ID or display ID)
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.ProrationUpgradeRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Orders.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">getInvoices</a>(orderId) -> Paid.Invoice[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves all invoices associated with a specific order.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.getInvoices("orderId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orderId:** `string` — The order ID (can be internal ID or display ID)
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Orders.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Plans
<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">getById</a>(planId) -> Paid.Plan</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.plans.getById("planId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**planId:** `string` — The ID of the plan
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Plans.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">getUsage</a>(planId, { ...params }) -> Paid.UsageSummariesResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.plans.getUsage("planId", {
    externalId: "externalId",
    limit: 1,
    offset: 1,
    startTime: "2024-01-15T09:30:00Z",
    endTime: "2024-01-15T09:30:00Z"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**planId:** `string` — The ID of the plan
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.PlansGetUsageRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Plans.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">getGroupById</a>(planGroupId) -> Paid.PlanGroup</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.plans.getGroupById("planGroupId");

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**planGroupId:** `string` — The ID of the plan group
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Plans.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Usage
<details><summary><code>client.usage.<a href="/src/api/resources/usage/client/Client.ts">recordBulk</a>({ ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

DEPRECATED: Use POST /usage/v2/signals/bulk instead for cleaner field names.
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.usage.recordBulk({
    signals: [{}, {}, {}]
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Paid.UsageRecordBulkRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Usage.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.usage.<a href="/src/api/resources/usage/client/Client.ts">usageRecordBulkV2</a>({ ...params }) -> void</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.usage.usageRecordBulkV2({
    signals: [{
            event_name: "emails_sent",
            product_id: "63fd642c-569d-44f9-8d67-5cf4944a16cc",
            customer_id: "7d0b6fce-d82a-433d-8315-c994f8f1d68d"
        }, {
            event_name: "emails_sent",
            external_product_id: "acme-product",
            external_customer_id: "acme-inc"
        }, {
            event_name: "meeting_booked",
            product_id: "63fd642c-569d-44f9-8d67-5cf4944a16cc",
            external_customer_id: "acme-inc",
            data: {
                "meeting_duration": 30,
                "meeting_type": "demo"
            }
        }]
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Paid.UsageRecordBulkV2Request` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Usage.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.usage.<a href="/src/api/resources/usage/client/Client.ts">checkUsage</a>({ ...params }) -> Paid.UsageCheckUsageResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.usage.checkUsage({
    externalCustomerId: "acme-inc",
    externalProductId: "acme-agent"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Paid.UsageCheckUsageRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Usage.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Traces
<details><summary><code>client.traces.<a href="/src/api/resources/traces/client/Client.ts">getTraces</a>({ ...params }) -> Paid.TracesResponse</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.traces.getTraces({
    limit: 1,
    offset: 1,
    startTime: "2024-01-15T09:30:00Z",
    endTime: "2024-01-15T09:30:00Z",
    externalCustomerId: "externalCustomerId",
    externalProductId: "externalProductId",
    externalAgentId: "externalAgentId",
    metadata: "metadata"
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Paid.GetTracesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Traces.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Orders Lines
<details><summary><code>client.orders.lines.<a href="/src/api/resources/orders/resources/lines/client/Client.ts">update</a>(orderId, { ...params }) -> Paid.Order</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.orders.lines.update("orderId", {
    lines: [{
            name: "Order Line One",
            description: "Order Line One is an order line for Acme, Inc."
        }, {
            name: "Order Line Two",
            description: "Order Line Two is an order line for Acme, Inc."
        }]
});

```
</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**orderId:** `string` 
    
</dd>
</dl>

<dl>
<dd>

**request:** `Paid.orders.LinesUpdateRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Lines.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>
