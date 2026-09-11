# Reference
## Products
<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">listProducts</a>({ ...params }) -> Paid.ProductListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of products for the organization
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
await client.products.listProducts();

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

**request:** `Paid.ListProductsRequest` 
    
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

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">createProduct</a>({ ...params }) -> Paid.Product</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new product for the organization. Products are created without pricing: to create product attributes and set their pricing, call the update product endpoint (updateProductById / updateProductByExternalId), which upserts productAttributes.
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
await client.products.createProduct({
    name: "name"
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

**request:** `Paid.CreateProductRequest` 
    
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

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">getProductById</a>({ ...params }) -> Paid.ProductDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a product by ID, including its product attributes with pricing details
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
await client.products.getProductById({
    id: "id"
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

**request:** `Paid.GetProductByIdRequest` 
    
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

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">updateProductById</a>({ ...params }) -> Paid.ProductDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a product by ID. Also creates and edits product attributes: productAttributes upserts attributes and sets their pricing (metering event, price points, credit brackets). This is the endpoint to use to add pricing to a product created without any.
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
await client.products.updateProductById({
    id: "id",
    body: {}
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

**request:** `Paid.UpdateProductByIdRequest` 
    
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

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">getProductByExternalId</a>({ ...params }) -> Paid.ProductDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a product by external ID, including its product attributes with pricing details
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
await client.products.getProductByExternalId({
    externalId: "externalId"
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

**request:** `Paid.GetProductByExternalIdRequest` 
    
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

<details><summary><code>client.products.<a href="/src/api/resources/products/client/Client.ts">updateProductByExternalId</a>({ ...params }) -> Paid.ProductDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a product by external ID. Also creates and edits product attributes: productAttributes upserts attributes and sets their pricing (metering event, price points, credit brackets). This is the endpoint to use to add pricing to a product created without any.
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
await client.products.updateProductByExternalId({
    externalId: "externalId",
    body: {}
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

**request:** `Paid.UpdateProductByExternalIdRequest` 
    
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

## Plans
<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">listPlans</a>({ ...params }) -> Paid.PlanListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns plans for your organization, including archived plans by default, optionally filtered to a product.
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
await client.plans.listPlans();

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

**request:** `Paid.ListPlansRequest` 
    
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

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">createPlan</a>({ ...params }) -> Paid.Plan</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new plan for a product.
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
await client.plans.createPlan({
    productId: "productId",
    attributes: [{
            productAttributeId: "productAttributeId",
            pricing: {
                pricingType: "RecurringPerUnit",
                billingFrequency: "Monthly",
                pricePoints: [{
                        currency: "USD",
                        unitPrice: 99
                    }]
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

**request:** `Paid.CreatePlanRequest` 
    
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

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">updatePlanUpgradePath</a>({ ...params }) -> Paid.PlanUpgradePathResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates upgrade path ordering for plans within a product, grouped by billing frequency.
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
await client.plans.updatePlanUpgradePath({
    productId: "productId",
    groups: [{
            planIds: ["planIds"]
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

**request:** `Paid.UpdatePlanUpgradePathRequest` 
    
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

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">getPlanById</a>({ ...params }) -> Paid.Plan</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a plan by Paid plan ID.
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
await client.plans.getPlanById({
    id: "id"
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

**request:** `Paid.GetPlanByIdRequest` 
    
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

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">updatePlanById</a>({ ...params }) -> Paid.Plan</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a plan by Paid plan ID. If attributes are provided, they replace the plan's existing attributes. Set status to archive or restore the plan.
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
await client.plans.updatePlanById({
    id: "id",
    body: {}
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

**request:** `Paid.UpdatePlanByIdRequest` 
    
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

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">getPlanByExternalId</a>({ ...params }) -> Paid.Plan</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a plan by your external plan ID.
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
await client.plans.getPlanByExternalId({
    externalId: "externalId"
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

**request:** `Paid.GetPlanByExternalIdRequest` 
    
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

<details><summary><code>client.plans.<a href="/src/api/resources/plans/client/Client.ts">updatePlanByExternalId</a>({ ...params }) -> Paid.Plan</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a plan by your external plan ID. If attributes are provided, they replace the plan's existing attributes. Set status to archive or restore the plan.
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
await client.plans.updatePlanByExternalId({
    externalId: "externalId",
    body: {}
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

**request:** `Paid.UpdatePlanByExternalIdRequest` 
    
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

## Customers
<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomers</a>({ ...params }) -> Paid.CustomerListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of customers for the organization
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
await client.customers.listCustomers();

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

**request:** `Paid.ListCustomersRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomer</a>({ ...params }) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new customer for the organization
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
await client.customers.createCustomer({
    name: "name"
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

**request:** `Paid.CreateCustomerRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerAliases</a>({ ...params }) -> Paid.CustomerAliasListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List alternate external identifiers that resolve to a customer by Paid display ID.
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
await client.customers.listCustomerAliases({
    id: "cus_abc123"
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

**request:** `Paid.ListCustomerAliasesRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerAlias</a>({ ...params }) -> Paid.CustomerAlias</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create an alternate external identifier for a customer by Paid display ID.
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
await client.customers.createCustomerAlias({
    id: "cus_abc123",
    body: {
        alias: "child-customer-1"
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

**request:** `Paid.CreateCustomerAliasRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteCustomerAlias</a>({ ...params }) -> Paid.EmptyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove an alternate external identifier from a customer by Paid display ID.
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
await client.customers.deleteCustomerAlias({
    id: "cus_abc123",
    alias: "child-customer-1"
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

**request:** `Paid.DeleteCustomerAliasRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerById</a>({ ...params }) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a customer by Paid display ID. Use the value returned as `customer.id`, for example `cus_abc123`. If you have your own customer ID, use `GET /api/v2/customers/external/{externalId}`.
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
await client.customers.getCustomerById({
    id: "cus_abc123"
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

**request:** `Paid.GetCustomerByIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">updateCustomerById</a>({ ...params }) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a customer by Paid display ID. Use the value returned as `customer.id`, for example `cus_abc123`. If you have your own customer ID, use `PUT /api/v2/customers/external/{externalId}`.
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
await client.customers.updateCustomerById({
    id: "cus_abc123",
    body: {}
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

**request:** `Paid.UpdateCustomerByIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteCustomerById</a>({ ...params }) -> Paid.EmptyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a customer by Paid display ID. Use the value returned as `customer.id`, for example `cus_abc123`. If you have your own customer ID, use `DELETE /api/v2/customers/external/{externalId}`.
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
await client.customers.deleteCustomerById({
    id: "cus_abc123"
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

**request:** `Paid.DeleteCustomerByIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerStateById</a>({ ...params }) -> Paid.CustomerState</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the current customer state by Paid display ID
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
await client.customers.getCustomerStateById({
    id: "cus_abc123"
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

**request:** `Paid.GetCustomerStateByIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerAliasesByExternalId</a>({ ...params }) -> Paid.CustomerAliasListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List alternate external identifiers that resolve to a customer by external ID.
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
await client.customers.listCustomerAliasesByExternalId({
    externalId: "customer_123"
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

**request:** `Paid.ListCustomerAliasesByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerAliasByExternalId</a>({ ...params }) -> Paid.CustomerAlias</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create an alternate external identifier for a customer by external ID.
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
await client.customers.createCustomerAliasByExternalId({
    externalId: "customer_123",
    body: {
        alias: "child-customer-1"
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

**request:** `Paid.CreateCustomerAliasByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteCustomerAliasByExternalId</a>({ ...params }) -> Paid.EmptyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove an alternate external identifier from a customer by external ID.
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
await client.customers.deleteCustomerAliasByExternalId({
    externalId: "customer_123",
    alias: "child-customer-1"
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

**request:** `Paid.DeleteCustomerAliasByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerByExternalId</a>({ ...params }) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a customer by external ID
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
await client.customers.getCustomerByExternalId({
    externalId: "customer_123"
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

**request:** `Paid.GetCustomerByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">updateCustomerByExternalId</a>({ ...params }) -> Paid.Customer</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a customer by external ID
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
await client.customers.updateCustomerByExternalId({
    externalId: "customer_123",
    body: {}
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

**request:** `Paid.UpdateCustomerByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteCustomerByExternalId</a>({ ...params }) -> Paid.EmptyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a customer by external ID
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
await client.customers.deleteCustomerByExternalId({
    externalId: "customer_123"
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

**request:** `Paid.DeleteCustomerByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerStateByExternalId</a>({ ...params }) -> Paid.CustomerState</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Primary integration endpoint for agents and programmatic clients using their own customer IDs. Use the value you stored on `customer.externalId`, for example `customer_123`.
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
await client.customers.getCustomerStateByExternalId({
    externalId: "customer_123"
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

**request:** `Paid.GetCustomerStateByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerCreditBalances</a>({ ...params }) -> Paid.CreditBalanceListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get current customer credit balances grouped by currency for a Paid customer display ID. Use the value returned as `customer.id`, for example `cus_abc123`. If you have your own customer ID, use `/api/v2/customers/external/{externalId}/credits/balances`.
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
await client.customers.getCustomerCreditBalances({
    id: "cus_abc123"
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

**request:** `Paid.GetCustomerCreditBalancesRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">grantCustomerCredits</a>({ ...params }) -> Paid.GrantCustomerCreditsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Immediately grant credits to a customer using an active credit currency key.
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
await client.customers.grantCustomerCredits({
    id: "cus_abc123",
    body: {
        creditCurrencyKey: "api_credits",
        amount: 10000,
        startsAt: "2026-06-05T12:00:00Z",
        expiresAt: "2026-12-31T23:59:59Z"
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

**request:** `Paid.GrantCustomerCreditsRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerCreditBalancesByExternalId</a>({ ...params }) -> Paid.CreditBalanceListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get current customer credit balances grouped by currency, looked up by external ID
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
await client.customers.getCustomerCreditBalancesByExternalId({
    externalId: "customer_123"
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

**request:** `Paid.GetCustomerCreditBalancesByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerPendingCreditConsumption</a>({ ...params }) -> Paid.PendingCreditConsumptionListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List credit consumption that was recorded before a matching credit pool existed — for example usage that arrived before an invoice was paid or before a new period's credits were granted. Entries leave this list once they are applied to a pool or settled. Use the value returned as `customer.id`, for example `cus_abc123`. If you have your own customer ID, use `/api/v2/customers/external/{externalId}/credits/pending-consumption`.
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
await client.customers.listCustomerPendingCreditConsumption({
    id: "cus_abc123"
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

**request:** `Paid.ListCustomerPendingCreditConsumptionRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerPendingCreditConsumptionByExternalId</a>({ ...params }) -> Paid.PendingCreditConsumptionListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List credit consumption recorded before a matching credit pool existed, for a customer looked up by external ID.
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
await client.customers.listCustomerPendingCreditConsumptionByExternalId({
    externalId: "customer_123"
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

**request:** `Paid.ListCustomerPendingCreditConsumptionByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">grantCustomerCreditsByExternalId</a>({ ...params }) -> Paid.GrantCustomerCreditsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Immediately grant credits to a customer looked up by external ID using an active credit currency key.
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
await client.customers.grantCustomerCreditsByExternalId({
    externalId: "customer_123",
    body: {
        creditCurrencyKey: "api_credits",
        amount: 10000,
        startsAt: "2026-06-05T12:00:00Z",
        expiresAt: "2026-12-31T23:59:59Z"
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

**request:** `Paid.GrantCustomerCreditsByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">upsertCustomerUserByExternalId</a>({ ...params }) -> Paid.CustomerUser</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create or update a customer user using customer and user external IDs
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
await client.customers.upsertCustomerUserByExternalId({
    customerExternalId: "customerExternalId",
    userExternalId: "userExternalId"
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

**request:** `Paid.UpsertCustomerUserRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerUnitsByExternalId</a>({ ...params }) -> Paid.CustomerUnitListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the customer's units as a flat list, newest last; assemble the tree from `parentExternalId` (`null` on the root unit, `isRoot: true`). Deleted units are hidden unless `status=DELETED` is given. Filter by `externalType`, or by `parentExternalId` for one level of the tree. Addresses the customer by your external customer id.
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
await client.customers.listCustomerUnitsByExternalId({
    externalId: "customer_123",
    parentExternalId: "dept-rnd"
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

**request:** `Paid.ListCustomerUnitsByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerUnitByExternalId</a>({ ...params }) -> Paid.CustomerUnit</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a unit for this customer. `externalId` is your own key for it: required, unique within the customer and immutable; every unit route addresses the unit by it, and `name` defaults to it. Omit `parentExternalId` to create the customer's root unit (its first unit; `409 ROOT_EXISTS` if it already has one — a customer created with an external id usable as a unit key already has its root, keyed by that external id, so name it as the parent instead); otherwise the parent must exist (`409 PARENT_NOT_FOUND`) and be ACTIVE. Units are never created implicitly: a signal that names a unit before it exists is accepted and its spend attaches to the unit once you create it with that key. `409` also when the externalId is taken (`CUSTOMER_UNIT_EXISTS`), the tree would get too deep, or the customer is on seat-based billing. Addresses the customer by your external customer id.
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
await client.customers.createCustomerUnitByExternalId({
    externalId: "customer_123",
    body: {
        externalId: "team-research"
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

**request:** `Paid.CreateCustomerUnitByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerUnitByExternalId</a>({ ...params }) -> Paid.CustomerUnit</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns one unit of this customer by its `externalId`, including a deleted one. `404` when the unit does not exist or belongs to another customer. Addresses the customer by your external customer id.
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
await client.customers.getCustomerUnitByExternalId({
    externalId: "customer_123",
    externalCustomerUnitId: "team-research"
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

**request:** `Paid.GetCustomerUnitByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteCustomerUnitByExternalId</a>({ ...params }) -> Paid.CustomerUnit</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Soft-deletes a unit: it stays readable with `status: DELETED` and cannot be reactivated. Spend history that references it is kept, and signals that keep naming it are still attributed to it. `409` while the unit has ACTIVE children or a cap in force or scheduled; the root follows the same rules, and once it is deleted a new root can be created. Addresses the customer by your external customer id.
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
await client.customers.deleteCustomerUnitByExternalId({
    externalId: "customer_123",
    externalCustomerUnitId: "team-research"
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

**request:** `Paid.DeleteCustomerUnitByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">updateCustomerUnitByExternalId</a>({ ...params }) -> Paid.CustomerUnit</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Renames, re-types, re-parents or annotates a unit, the root included. `externalId` cannot change. Re-parenting (`parentExternalId`) moves the unit with everything under it. Spend already recorded keeps naming the unit it landed on; caps are evaluated on the current tree, so from the move on the unit's spend in the running cap period counts toward its new ancestors' caps and no longer toward the old ones. `409` for a deleted unit, a parent that does not exist or is not ACTIVE, a move of the root (`ROOT_UNIT_IMMOVABLE`), a move under the unit's own subtree, or a tree that would get too deep. Addresses the customer by your external customer id.
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
await client.customers.updateCustomerUnitByExternalId({
    externalId: "customer_123",
    externalCustomerUnitId: "team-research",
    body: {}
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

**request:** `Paid.UpdateCustomerUnitByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerUnits</a>({ ...params }) -> Paid.CustomerUnitListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the customer's units as a flat list, newest last; assemble the tree from `parentExternalId` (`null` on the root unit, `isRoot: true`). Deleted units are hidden unless `status=DELETED` is given. Filter by `externalType`, or by `parentExternalId` for one level of the tree. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.listCustomerUnits({
    id: "cus_abc123",
    parentExternalId: "dept-rnd"
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

**request:** `Paid.ListCustomerUnitsRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerUnit</a>({ ...params }) -> Paid.CustomerUnit</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a unit for this customer. `externalId` is your own key for it: required, unique within the customer and immutable; every unit route addresses the unit by it, and `name` defaults to it. Omit `parentExternalId` to create the customer's root unit (its first unit; `409 ROOT_EXISTS` if it already has one — a customer created with an external id usable as a unit key already has its root, keyed by that external id, so name it as the parent instead); otherwise the parent must exist (`409 PARENT_NOT_FOUND`) and be ACTIVE. Units are never created implicitly: a signal that names a unit before it exists is accepted and its spend attaches to the unit once you create it with that key. `409` also when the externalId is taken (`CUSTOMER_UNIT_EXISTS`), the tree would get too deep, or the customer is on seat-based billing. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.createCustomerUnit({
    id: "cus_abc123",
    body: {
        externalId: "team-research"
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

**request:** `Paid.CreateCustomerUnitRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerUnit</a>({ ...params }) -> Paid.CustomerUnit</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns one unit of this customer by its `externalId`, including a deleted one. `404` when the unit does not exist or belongs to another customer. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.getCustomerUnit({
    id: "cus_abc123",
    externalCustomerUnitId: "team-research"
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

**request:** `Paid.GetCustomerUnitRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteCustomerUnit</a>({ ...params }) -> Paid.CustomerUnit</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Soft-deletes a unit: it stays readable with `status: DELETED` and cannot be reactivated. Spend history that references it is kept, and signals that keep naming it are still attributed to it. `409` while the unit has ACTIVE children or a cap in force or scheduled; the root follows the same rules, and once it is deleted a new root can be created. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.deleteCustomerUnit({
    id: "cus_abc123",
    externalCustomerUnitId: "team-research"
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

**request:** `Paid.DeleteCustomerUnitRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">updateCustomerUnit</a>({ ...params }) -> Paid.CustomerUnit</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Renames, re-types, re-parents or annotates a unit, the root included. `externalId` cannot change. Re-parenting (`parentExternalId`) moves the unit with everything under it. Spend already recorded keeps naming the unit it landed on; caps are evaluated on the current tree, so from the move on the unit's spend in the running cap period counts toward its new ancestors' caps and no longer toward the old ones. `409` for a deleted unit, a parent that does not exist or is not ACTIVE, a move of the root (`ROOT_UNIT_IMMOVABLE`), a move under the unit's own subtree, or a tree that would get too deep. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.updateCustomerUnit({
    id: "cus_abc123",
    externalCustomerUnitId: "team-research",
    body: {}
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

**request:** `Paid.UpdateCustomerUnitRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerUnitCapByExternalId</a>({ ...params }) -> Paid.CustomerUnitCapResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the cap in force on this customer unit for one credits currency, with usage in the current period when available. Select the currency with `creditsCurrencyId`; it may be omitted only when the organization has exactly one credits currency, which is then used and echoed back. `404` when the customer or the unit does not exist, or the unit has no cap in force for that currency. The usage figures are advisory: other spend may land between this read and the next burn. Addresses the customer by your external customer id.
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
await client.customers.getCustomerUnitCapByExternalId({
    externalId: "customer_123",
    externalCustomerUnitId: "tenant-a",
    creditsCurrencyId: "7f4f5d4c-55e9-4d5b-a3e7-c9eb3d2d01bf"
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

**request:** `Paid.GetCustomerUnitCapByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">setCustomerUnitCapByExternalId</a>({ ...params }) -> Paid.CustomerUnitCapSetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Sets the cap on this customer unit for one credits currency by recording a new cap version; earlier versions are kept and never modified, and the newest version wins where they overlap. The new version applies from `effectiveFrom` (default now) and its periods are anchored on that day of the month. Select the currency with `creditsCurrencyId` in the body; it may be omitted only when the organization has exactly one credits currency. A cap on the customer's root unit is the customer-wide cap. `404` when the customer or the unit does not exist. `409` for customers on seat-based billing. Addresses the customer by your external customer id.
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
await client.customers.setCustomerUnitCapByExternalId({
    externalId: "customer_123",
    externalCustomerUnitId: "tenant-a",
    body: {
        amount: 10000
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

**request:** `Paid.SetCustomerUnitCapByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">endCustomerUnitCapByExternalId</a>({ ...params }) -> Paid.CustomerUnitCapEndResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Ends the cap on this customer unit for one credits currency by setting `effectiveUntil` to now on every open version — the one in force, older overlapping versions still open, and versions scheduled to start later — so nothing can resurface or activate afterwards; nothing is deleted and history is kept. Select the currency with `creditsCurrencyId`; it may be omitted only when the organization has exactly one credits currency. `404` when the customer or the unit does not exist, or there is no open version for that currency. Addresses the customer by your external customer id.
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
await client.customers.endCustomerUnitCapByExternalId({
    externalId: "customer_123",
    externalCustomerUnitId: "tenant-a",
    creditsCurrencyId: "7f4f5d4c-55e9-4d5b-a3e7-c9eb3d2d01bf"
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

**request:** `Paid.EndCustomerUnitCapByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerUnitCap</a>({ ...params }) -> Paid.CustomerUnitCapResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the cap in force on this customer unit for one credits currency, with usage in the current period when available. Select the currency with `creditsCurrencyId`; it may be omitted only when the organization has exactly one credits currency, which is then used and echoed back. `404` when the customer or the unit does not exist, or the unit has no cap in force for that currency. The usage figures are advisory: other spend may land between this read and the next burn. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.getCustomerUnitCap({
    id: "cus_abc123",
    externalCustomerUnitId: "tenant-a",
    creditsCurrencyId: "7f4f5d4c-55e9-4d5b-a3e7-c9eb3d2d01bf"
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

**request:** `Paid.GetCustomerUnitCapRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">setCustomerUnitCap</a>({ ...params }) -> Paid.CustomerUnitCapSetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Sets the cap on this customer unit for one credits currency by recording a new cap version; earlier versions are kept and never modified, and the newest version wins where they overlap. The new version applies from `effectiveFrom` (default now) and its periods are anchored on that day of the month. Select the currency with `creditsCurrencyId` in the body; it may be omitted only when the organization has exactly one credits currency. A cap on the customer's root unit is the customer-wide cap. `404` when the customer or the unit does not exist. `409` for customers on seat-based billing. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.setCustomerUnitCap({
    id: "cus_abc123",
    externalCustomerUnitId: "tenant-a",
    body: {
        amount: 10000
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

**request:** `Paid.SetCustomerUnitCapRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">endCustomerUnitCap</a>({ ...params }) -> Paid.CustomerUnitCapEndResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Ends the cap on this customer unit for one credits currency by setting `effectiveUntil` to now on every open version — the one in force, older overlapping versions still open, and versions scheduled to start later — so nothing can resurface or activate afterwards; nothing is deleted and history is kept. Select the currency with `creditsCurrencyId`; it may be omitted only when the organization has exactly one credits currency. `404` when the customer or the unit does not exist, or there is no open version for that currency. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.endCustomerUnitCap({
    id: "cus_abc123",
    externalCustomerUnitId: "tenant-a",
    creditsCurrencyId: "7f4f5d4c-55e9-4d5b-a3e7-c9eb3d2d01bf"
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

**request:** `Paid.EndCustomerUnitCapRequest` 
    
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

## Contacts
<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">listContacts</a>({ ...params }) -> Paid.ContactListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of contacts for the organization
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
await client.contacts.listContacts();

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

**request:** `Paid.ListContactsRequest` 
    
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

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">createContact</a>({ ...params }) -> Paid.Contact</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new contact for the organization
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
await client.contacts.createContact({
    customerId: "customerId",
    email: "email"
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

**request:** `Paid.CreateContactRequest` 
    
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

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">getContactById</a>({ ...params }) -> Paid.Contact</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a contact by its ID
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
await client.contacts.getContactById({
    id: "id"
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

**request:** `Paid.GetContactByIdRequest` 
    
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

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">updateContactById</a>({ ...params }) -> Paid.Contact</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a contact by its ID
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
await client.contacts.updateContactById({
    id: "id",
    body: {}
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

**request:** `Paid.UpdateContactByIdRequest` 
    
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

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">deleteContactById</a>({ ...params }) -> Paid.EmptyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a contact by its ID
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
await client.contacts.deleteContactById({
    id: "id"
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

**request:** `Paid.DeleteContactByIdRequest` 
    
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

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">getContactByExternalId</a>({ ...params }) -> Paid.Contact</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a contact by its external ID
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
await client.contacts.getContactByExternalId({
    externalId: "externalId"
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

**request:** `Paid.GetContactByExternalIdRequest` 
    
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

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">updateContactByExternalId</a>({ ...params }) -> Paid.Contact</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a contact by its external ID
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
await client.contacts.updateContactByExternalId({
    externalId: "externalId",
    body: {}
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

**request:** `Paid.UpdateContactByExternalIdRequest` 
    
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

<details><summary><code>client.contacts.<a href="/src/api/resources/contacts/client/Client.ts">deleteContactByExternalId</a>({ ...params }) -> Paid.EmptyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a contact by its external ID
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
await client.contacts.deleteContactByExternalId({
    externalId: "externalId"
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

**request:** `Paid.DeleteContactByExternalIdRequest` 
    
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
<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">listOrders</a>({ ...params }) -> Paid.OrderListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of orders for the organization
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
await client.orders.listOrders();

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

**request:** `Paid.ListOrdersRequest` 
    
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">createOrder</a>({ ...params }) -> Paid.Order</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new order for the organization
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
await client.orders.createOrder({
    customerId: "customerId"
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

**request:** `Paid.CreateOrderRequest` 
    
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">getOrderById</a>({ ...params }) -> Paid.Order</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get an order by ID
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
await client.orders.getOrderById({
    id: "id"
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

**request:** `Paid.GetOrderByIdRequest` 
    
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">updateOrderById</a>({ ...params }) -> Paid.Order</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an order by ID
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
await client.orders.updateOrderById({
    id: "id"
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

**request:** `Paid.UpdateOrderRequest` 
    
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">deleteOrderById</a>({ ...params }) -> Paid.EmptyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete an order by ID
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
await client.orders.deleteOrderById({
    id: "id"
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

**request:** `Paid.DeleteOrderByIdRequest` 
    
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">activateOrderById</a>({ ...params }) -> Paid.Order</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Activate a draft order by ID. Activation starts billing for the order using the same validation and side effects as the dashboard activation flow.
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
await client.orders.activateOrderById({
    id: "id"
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

**request:** `Paid.ActivateOrderByIdRequest` 
    
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">getOrderLines</a>({ ...params }) -> Paid.OrderLinesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the order lines for an order by ID
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
await client.orders.getOrderLines({
    id: "id"
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

**request:** `Paid.GetOrderLinesRequest` 
    
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">listOrderSeats</a>({ ...params }) -> Paid.OrderSeatListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List seats for an order
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
await client.orders.listOrderSeats({
    id: "id"
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

**request:** `Paid.ListOrderSeatsRequest` 
    
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">updateOrderSeatAssignment</a>({ ...params }) -> Paid.OrderSeat</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Assign or unassign a single seat on an order
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
await client.orders.updateOrderSeatAssignment({
    id: "id",
    seatId: "seatId"
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

**request:** `Paid.UpdateSeatAssignmentRequest` 
    
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">batchOrderSeatAssignments</a>({ ...params }) -> Paid.BatchSeatAssignmentsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Assign or unassign seats in batch for an order
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
await client.orders.batchOrderSeatAssignments({
    id: "id",
    assignments: [{
            seatId: "seatId"
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

**request:** `Paid.BatchSeatAssignmentsRequest` 
    
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

## Invoices
<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client/Client.ts">listInvoices</a>({ ...params }) -> Paid.InvoiceListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of invoices for the organization
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
await client.invoices.listInvoices();

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

**request:** `Paid.ListInvoicesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invoices.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client/Client.ts">getInvoiceById</a>({ ...params }) -> Paid.Invoice</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get an invoice by ID
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
await client.invoices.getInvoiceById({
    id: "id"
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

**request:** `Paid.GetInvoiceByIdRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invoices.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client/Client.ts">updateInvoiceById</a>({ ...params }) -> Paid.Invoice</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an invoice by ID
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
await client.invoices.updateInvoiceById({
    id: "id"
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

**request:** `Paid.UpdateInvoiceRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invoices.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.invoices.<a href="/src/api/resources/invoices/client/Client.ts">getInvoiceLines</a>({ ...params }) -> Paid.InvoiceLinesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the invoice lines for an invoice by ID
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
await client.invoices.getInvoiceLines({
    id: "id"
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

**request:** `Paid.GetInvoiceLinesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Invoices.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Signals
<details><summary><code>client.signals.<a href="/src/api/resources/signals/client/Client.ts">listSignals</a>({ ...params }) -> Paid.SignalListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns ingested signals (usage events) for your organization, newest first. Filter by signal name, customer, product, and creation date range.
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
await client.signals.listSignals();

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

**request:** `Paid.ListSignalsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Signals.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.signals.<a href="/src/api/resources/signals/client/Client.ts">getSignalById</a>({ ...params }) -> Paid.SignalListItem</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a single ingested signal (usage event) by its ID, including the data payload submitted at ingest.
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
await client.signals.getSignalById({
    id: "6890b0e2a6f2c30012f0a1b3"
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

**request:** `Paid.GetSignalByIdRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Signals.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.signals.<a href="/src/api/resources/signals/client/Client.ts">createSignals</a>({ ...params }) -> Paid.BulkSignalsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create multiple signals (usage events) in a single request. Each signal must include a customer attribution (either customerId or externalCustomerId) and a product attribution (either productId or externalProductId).
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
await client.signals.createSignals({
    signals: [{
            eventName: "eventName",
            customer: {
                customerId: "customerId"
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

**request:** `Paid.BulkSignalsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Signals.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Credits
<details><summary><code>client.credits.<a href="/src/api/resources/credits/client/Client.ts">listCreditCurrencies</a>({ ...params }) -> Paid.CreditCurrencyListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List credit currencies for the organization. Includes active and archived currencies by default; use the status query parameter to filter.
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
await client.credits.listCreditCurrencies();

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

**request:** `Paid.ListCreditCurrenciesRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Credits.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credits.<a href="/src/api/resources/credits/client/Client.ts">createCreditCurrency</a>({ ...params }) -> Paid.CreditCurrency</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a credit currency for the organization.
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
await client.credits.createCreditCurrency({
    name: "API Credits",
    key: "api_credits",
    description: "Credits consumed by API calls."
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

**request:** `Paid.CreateCreditCurrencyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Credits.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credits.<a href="/src/api/resources/credits/client/Client.ts">listCreditTransactions</a>({ ...params }) -> Paid.CreditTransactionListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List credit ledger transactions (grants, spends, and pending grants) for the organization, newest first. Filter by customer, credit currency, type, order, or date range.
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
await client.credits.listCreditTransactions();

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

**request:** `Paid.ListCreditTransactionsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Credits.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.credits.<a href="/src/api/resources/credits/client/Client.ts">updateCreditCurrencyById</a>({ ...params }) -> Paid.CreditCurrency</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a credit currency description or set its active/archive status.
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
await client.credits.updateCreditCurrencyById({
    id: "7f4f5d4c-55e9-4d5b-a3e7-c9eb3d2d01bf",
    description: "Credits consumed by developer API calls.",
    status: "archived"
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

**request:** `Paid.UpdateCreditCurrencyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Credits.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Checkouts
<details><summary><code>client.checkouts.<a href="/src/api/resources/checkouts/client/Client.ts">listCheckouts</a>({ ...params }) -> Paid.CheckoutListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a list of checkouts for the organization
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
await client.checkouts.listCheckouts();

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

**request:** `Paid.ListCheckoutsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Checkouts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.checkouts.<a href="/src/api/resources/checkouts/client/Client.ts">createCheckout</a>({ ...params }) -> Paid.Checkout</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a checkout link that generates a URL for a customer to complete a purchase
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
await client.checkouts.createCheckout({
    products: [{
            id: "id"
        }],
    successUrl: "successUrl"
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

**request:** `Paid.CreateCheckoutRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Checkouts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.checkouts.<a href="/src/api/resources/checkouts/client/Client.ts">getCheckout</a>({ ...params }) -> Paid.CheckoutDetails</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a checkout by ID
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
await client.checkouts.getCheckout({
    id: "id"
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

**request:** `Paid.GetCheckoutRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Checkouts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.checkouts.<a href="/src/api/resources/checkouts/client/Client.ts">archiveCheckout</a>({ ...params }) -> Paid.EmptyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Archive a checkout by ID
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
await client.checkouts.archiveCheckout({
    id: "id"
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

**request:** `Paid.ArchiveCheckoutRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Checkouts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## CustomerPortals
<details><summary><code>client.customerPortals.<a href="/src/api/resources/customerPortals/client/Client.ts">createCustomerPortal</a>({ ...params }) -> Paid.CustomerPortal</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a portal session for the customer. Returns a short-lived URL to the customer portal.
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
await client.customerPortals.createCustomerPortal();

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

**request:** `Paid.CreateCustomerPortalRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomerPortals.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ValueReceipts
<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">listValueReceipts</a>({ ...params }) -> Paid.ValueReceiptListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List value receipts for the organization
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
await client.valueReceipts.listValueReceipts();

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

**request:** `Paid.ListValueReceiptsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">createValueReceipt</a>({ ...params }) -> Paid.ValueReceiptSyncResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a value receipt for a customer and date range, optionally scoped to a product or an order. Every call creates a receipt, so calling twice for the same period gives the customer two. The date range must have ended; a range with nothing delivered in it reports zero. Returns the receipt's ID and public URL.
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
await client.valueReceipts.createValueReceipt({
    startDate: "2024-01-15T09:30:00Z",
    endDate: "2024-01-15T09:30:00Z"
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

**request:** `Paid.SyncValueReceiptRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">syncValueReceipt</a>({ ...params }) -> Paid.ValueReceiptSyncResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deprecated — use POST /value-receipts. Returns the receipt this customer already has for the date range (200), refreshed with current data, and creates one only if there is none (201), so calling twice does not give the customer two receipts.
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
await client.valueReceipts.syncValueReceipt({
    startDate: "2024-01-15T09:30:00Z",
    endDate: "2024-01-15T09:30:00Z"
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

**request:** `Paid.SyncValueReceiptRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">getValueReceiptById</a>({ ...params }) -> Paid.ValueReceiptDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a value receipt by ID, including its publish/share state.
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
await client.valueReceipts.getValueReceiptById({
    id: "id"
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

**request:** `Paid.GetValueReceiptByIdRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">refreshValueReceipt</a>({ ...params }) -> Paid.ValueReceiptSyncResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Re-populate an existing draft value receipt with current data inline. Returns the slim sync response. Sealed VRs cannot be refreshed.
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
await client.valueReceipts.refreshValueReceipt({
    id: "id"
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

**request:** `Paid.RefreshValueReceiptRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">sealValueReceipt</a>({ ...params }) -> Paid.SuccessResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Transition a draft value receipt to sealed (posted) status. Sealed VRs are immutable — they cannot be updated or re-populated.
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
await client.valueReceipts.sealValueReceipt({
    id: "id"
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

**request:** `Paid.SealValueReceiptRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">archiveValueReceipt</a>({ ...params }) -> Paid.SuccessResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Soft-archive a value receipt. Archived VRs are hidden from list by default.
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
await client.valueReceipts.archiveValueReceipt({
    id: "id"
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

**request:** `Paid.ArchiveValueReceiptRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">unarchiveValueReceipt</a>({ ...params }) -> Paid.SuccessResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Restore an archived value receipt.
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
await client.valueReceipts.unarchiveValueReceipt({
    id: "id"
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

**request:** `Paid.UnarchiveValueReceiptRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">publishValueReceipt</a>({ ...params }) -> Paid.ValueReceiptDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Make a value receipt publicly accessible via URL. An archived receipt is rejected with 409 — unarchive it first.
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
await client.valueReceipts.publishValueReceipt({
    id: "id"
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

**request:** `Paid.PublishValueReceiptBody` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueReceipts.<a href="/src/api/resources/valueReceipts/client/Client.ts">unpublishValueReceipt</a>({ ...params }) -> Paid.ValueReceiptDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Revoke public access to a value receipt. Available for archived receipts too, so a live link can always be revoked.
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
await client.valueReceipts.unpublishValueReceipt({
    id: "id"
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

**request:** `Paid.UnpublishValueReceiptRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueReceipts.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Webhooks
<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">listWebhooks</a>() -> Paid.WebhookListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List customer-facing billing webhooks for the authenticated organization, along with whether the organization has generated a signing secret.
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
await client.webhooks.listWebhooks();

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

**requestOptions:** `Webhooks.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">updateWebhook</a>({ ...params }) -> Paid.WebhookUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Enable or disable a webhook and configure the destination URL for the authenticated organization.
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
await client.webhooks.updateWebhook({
    webhookName: "billing-invoice-created"
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

**request:** `Paid.UpdateWebhookRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Webhooks.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">testWebhook</a>({ ...params }) -> Paid.WebhookTestResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Send a synthetic webhook delivery to the configured destination for this webhook.
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
await client.webhooks.testWebhook({
    webhookName: "billing-invoice-created"
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

**request:** `Paid.TestWebhookRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Webhooks.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">rotateWebhookSecret</a>({ ...params }) -> Paid.RotateWebhookSecretResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Generate a new HMAC signing secret used by every webhook in this organization and return it exactly once. The previous secret is invalidated immediately on next delivery.
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
await client.webhooks.rotateWebhookSecret();

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

**request:** `Paid.RotateWebhookSecretRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Webhooks.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Pricing
<details><summary><code>client.pricing.<a href="/src/api/resources/pricing/client/Client.ts">listPricing</a>({ ...params }) -> Paid.PricingListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns pricing for all product attributes of a product. Each entry includes the attribute's pricing configuration and credit benefits.
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
await client.pricing.listPricing({
    productId: "productId"
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

**request:** `Paid.ListPricingRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pricing.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.pricing.<a href="/src/api/resources/pricing/client/Client.ts">getPricing</a>({ ...params }) -> Paid.PricingResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns pricing and credit benefits for a single product attribute.
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
await client.pricing.getPricing({
    productAttributeId: "productAttributeId"
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

**request:** `Paid.GetPricingRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pricing.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.pricing.<a href="/src/api/resources/pricing/client/Client.ts">updatePricing</a>({ ...params }) -> Paid.PricingResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates pricing on an existing product attribute. To create a new attribute, use the update product endpoint (updateProductById), which upserts productAttributes. If creditBenefits is provided, it fully replaces existing benefits. If omitted, existing benefits are preserved.
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
await client.pricing.updatePricing({
    productAttributeId: "productAttributeId",
    pricing: {
        pricingType: "RecurringPerUnit",
        billingFrequency: "Monthly",
        pricePoints: [{
                currency: "currency",
                unitPrice: 1
            }]
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

**request:** `Paid.UpdatePricingRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pricing.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Costs
<details><summary><code>client.costs.<a href="/src/api/resources/costs/client/Client.ts">createCosts</a>({ ...params }) -> Paid.CostIngestResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Ingests a batch of cost records. Each record is either a pre-computed `cost` (caller supplies amount + currency) or a `usage` record (caller supplies vendor/model/token counts and Paid prices it server-side). The batch is all-or-nothing: if any record fails validation, the entire request is rejected with a 400 and nothing is persisted.
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
await client.costs.createCosts({
    costs: [{
            type: "cost",
            customer: {
                customerId: "customerId"
            },
            amount: 1.1,
            currency: "currency"
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

**request:** `Paid.CostIngestRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Costs.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Analytics
<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client/Client.ts">executeAnalyticsQuery</a>({ ...params }) -> Paid.AnalyticsQueryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Runs a single ClickHouse SELECT (or WITH … SELECT) against your organization's analytics views. Before writing a query, call `getAnalyticsSchema` (GET /schema) for the available views and columns, and `getSignalsMetadata` (GET /signals/metadata) for the JSON paths inside `fact_signal.data`. Results are automatically scoped to your organization — no org filter is needed or possible. Only SELECT/WITH statements are accepted.

Conventions: monetary amounts are minor units (cents — divide by 100 for the major unit); most are integers, but `fact_cost.cost_amount` is fractional cents (Decimal) since a single AI call usually costs less than a cent; 64-bit integers (counts, ids, amounts) are returned as JSON strings to preserve precision, so parse them client-side; Decimal columns (fractional cents, and credit amounts, which are counts of credits rather than cents and are never divided by 100) come back as JSON numbers instead, so a value beyond 2^53 is already rounded — select toString(col) when you need its exact digits. Query signal payloads via JSON paths, e.g. `SELECT data.country::String AS country, count() FROM fact_signal GROUP BY country`.

Limits: 30 seconds of execution time and 10,000 result rows (truncation is flagged via `meta.truncated`). Prefer aggregates and a `created_at` date filter on large tables — this endpoint is for interactive analytics, not bulk export.
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
await client.analytics.executeAnalyticsQuery({
    query: "SELECT signal_name, count() AS signals FROM fact_signal WHERE created_at > now() - INTERVAL 30 DAY GROUP BY signal_name ORDER BY signals DESC"
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

**request:** `Paid.AnalyticsQueryRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Analytics.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client/Client.ts">getAnalyticsSchema</a>() -> Paid.AnalyticsSchemaResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the analytics views available to POST /query, with column names, ClickHouse types, and descriptions. Dimensions (`dim_*`) describe entities; facts (`fact_*`) are event/transaction tables that join to dimensions via the `*_id` columns described in each comment.
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
await client.analytics.getAnalyticsSchema();

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

**requestOptions:** `Analytics.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analytics.<a href="/src/api/resources/analytics/client/Client.ts">getSignalsMetadata</a>({ ...params }) -> Paid.SignalsMetadataResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the JSON paths (and their observed types) present in the `data` payload of your signals within a time window (default: last 30 days), grouped by signal name. Use the returned paths in queries against `fact_signal`, e.g. `WHERE data.<path>::String = '...'`.
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
await client.analytics.getSignalsMetadata();

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

**request:** `Paid.GetSignalsMetadataRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Analytics.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## CustomViewsExperimental
<details><summary><code>client.customViewsExperimental.<a href="/src/api/resources/customViewsExperimental/client/Client.ts">listCustomViews</a>() -> Paid.CustomViewListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

⚠️ **Experimental** — this endpoint may change or be removed without notice and is not subject to v2 backwards-compatibility guarantees. Do not build production-critical integrations against it yet.

Lists the organization's custom views (newest first) with lightweight summary info — name, status, query count, default date range, created date. Does not return the SQL or render bundle; fetch a single view via getCustomView for those.
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
await client.customViewsExperimental.listCustomViews();

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

**requestOptions:** `CustomViewsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customViewsExperimental.<a href="/src/api/resources/customViewsExperimental/client/Client.ts">createCustomView</a>({ ...params }) -> Paid.CustomView</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

⚠️ **Experimental** — this endpoint may change or be removed without notice and is not subject to v2 backwards-compatibility guarantees. Do not build production-critical integrations against it yet.

⚠️ Only call this when the user has EXPLICITLY asked to save or create the view. After generating or previewing a dashboard, do NOT automatically save it — show it to the user and wait for them to ask you to save it. A customer-scoped view is created as a DRAFT — creating it is NOT permission to publish; never chain a publish onto a create. An organization-scoped view is created already PUBLISHED instead: it has no draft state and no publish step at all (never call publishCustomView on one — it's a no-op, and unpublishView refuses it outright). After saving, hand the user the previewUrl and wait for their feedback before doing anything else. Saves named analytics queries + a self-contained HTML render bundle. **Call getCustomViewAuthoringGuide (GET /experimental/views/authoring-guide) first** — it returns the full guide and a copy-paste interactive template. Key rules: (1) Do NOT add a customer filter to the SQL — the database scopes every query to the viewing customer at embed time. (2) Each query's SQL must be SELECT-only; return clearly-named columns. Compute metric VALUES in SQL (e.g. (count()*2)/5 AS custom_metric) — derive a number in the render bundle only when it depends on user interaction (toggle/filter/hover) or is pure formatting of a value a query already returns. (3) The render bundle must be SELF-CONTAINED — inline all CSS/JS/charting, NO external loads or fetch (the sandbox has connect-src 'none'); it must listen for the `paid:data` message (data keyed by query id) and re-render on each one. (4) Make it INTERACTIVE — mousemove hover tooltips and at least one addEventListener-wired control that re-renders (a static chart feels broken). (5) The render bundle is the single source of truth — BEFORE saving, preview the EXACT bundle in the user's current client (call getCustomViewPreviewHarness with your bundle + sample data and render the HTML it returns) and show it to the user; that preview in the current client is how the user first sees the dashboard. Do NOT save a draft just to preview it in Paid — creating writes to the user's real account and is never a preview step. Do NOT build a separate chart, and only show numbers that come from a declared query. (6) A view is a FULL dashboard — include as many charts/KPIs as the analysis has. Keep every element derived from the single viewing customer (KPIs, trends, type mix); drop only cross-customer comparisons (rankings, share-of-total, 'N customers'). Don't simplify to one chart. (7) To make the date range adjustable (e.g. the user says 'last month'), write the date boundary as `{period_start:DateTime}` / `{period_end:DateTime}` placeholders in the SQL and pass a default `period` (relative like {kind:'relative',unit:'month',amount:1}, or absolute start/end). The org user can then change it in Paid without re-authoring. A query using the placeholders REQUIRES a period. Do NOT add your own date-range picker to the render bundle — Paid owns the timeframe and the bundle receives already-filtered data; a second in-bundle picker cannot re-run the SQL. (8) Check your draft with validateCustomView (POST /experimental/views/validate) BEFORE asking the user to save — it runs these same gates without persisting and reports every problem at once. The response returns a `previewUrl` — give it to the user so they can open the new view in Paid.
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
await client.customViewsExperimental.createCustomView({
    name: "Usage over time",
    queries: [{
            id: "usage",
            sql: "SELECT toDate(created_at) AS day, count() AS signals FROM fact_signal GROUP BY day ORDER BY day"
        }],
    renderBundle: "<!doctype html><body>\u2026</body>"
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

**request:** `Paid.CreateCustomViewRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomViewsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customViewsExperimental.<a href="/src/api/resources/customViewsExperimental/client/Client.ts">publishCustomView</a>({ ...params }) -> Paid.CustomView</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

⚠️ **Experimental** — this endpoint may change or be removed without notice and is not subject to v2 backwards-compatibility guarantees. Do not build production-critical integrations against it yet.

⚠️ Never publish as an automatic follow-up to creating or generating a view. Only call this after you have shown the user the built/previewed view and they have EXPLICITLY approved publishing — building and publishing are separate user decisions, and answering an earlier question (e.g. the view's scope) is NOT publish approval. Flips the view from DRAFT to PUBLISHED. Only PUBLISHED views are served on the embed data path — this is the gate that stops an unreviewed view reaching end-customers. Idempotent: publishing an already-published view is a no-op success. The response returns a `previewUrl` — give it to the user so they can open the view in Paid.
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
await client.customViewsExperimental.publishCustomView({
    displayId: "displayId"
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

**request:** `Paid.PublishCustomViewRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomViewsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customViewsExperimental.<a href="/src/api/resources/customViewsExperimental/client/Client.ts">updateCustomViewPeriod</a>({ ...params }) -> Paid.CustomView</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

⚠️ **Experimental** — this endpoint may change or be removed without notice and is not subject to v2 backwards-compatibility guarantees. Do not build production-critical integrations against it yet.

Updates the view's default date range (the period applied to queries that use the `{period_start:DateTime}` / `{period_end:DateTime}` placeholders). Accepts a relative rolling window (e.g. last 30 days) or a fixed start/end range. Lets the period be changed after deployment without re-authoring the SQL. Applies to DRAFT or PUBLISHED views.
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
await client.customViewsExperimental.updateCustomViewPeriod({
    displayId: "displayId",
    period: {
        kind: "relative"
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

**request:** `Paid.UpdateCustomViewPeriodRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomViewsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customViewsExperimental.<a href="/src/api/resources/customViewsExperimental/client/Client.ts">getCustomView</a>({ ...params }) -> Paid.CustomViewDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

⚠️ **Experimental** — this endpoint may change or be removed without notice and is not subject to v2 backwards-compatibility guarantees. Do not build production-critical integrations against it yet.

Returns the view's name, status, query ids, and the author render bundle for the owning organization (DRAFT or PUBLISHED). Used by the trusted preview/embed frame to render the sandbox; the per-customer data is fetched separately via /:displayId/data.
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
await client.customViewsExperimental.getCustomView({
    displayId: "displayId"
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

**request:** `Paid.GetCustomViewRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomViewsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customViewsExperimental.<a href="/src/api/resources/customViewsExperimental/client/Client.ts">updateCustomView</a>({ ...params }) -> Paid.CustomView</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

⚠️ **Experimental** — this endpoint may change or be removed without notice and is not subject to v2 backwards-compatibility guarantees. Do not build production-critical integrations against it yet.

Partially updates a view. Omitted fields are left unchanged. For REVISIONS, prefer the incremental fields — `bundleEdits` (exact search-and-replace on the stored render bundle) and `queryUpserts`/`queryRemovals` (per-query changes) — so you transmit only what changed instead of re-sending the whole payload. The full-replacement fields remain for rewrites: `renderBundle`, and `queries` (a FULL replacement of the query list — never drop queries the user didn't ask to remove). Replacement and incremental forms of the same aspect cannot be combined. The resulting SQL and bundle pass the same validation as createCustomView (SELECT-only, size cap, self-contained, paid:data listener). Works on DRAFT or PUBLISHED views — published embeds pick the change up on their next load.
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
await client.customViewsExperimental.updateCustomView({
    displayId: "displayId"
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

**request:** `Paid.UpdateCustomViewRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomViewsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customViewsExperimental.<a href="/src/api/resources/customViewsExperimental/client/Client.ts">getCustomViewData</a>({ ...params }) -> Paid.ViewDataResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

⚠️ **Experimental** — this endpoint may change or be removed without notice and is not subject to v2 backwards-compatibility guarantees. Do not build production-critical integrations against it yet.

Runs every stored query of the view on the read-only analytics database and returns the result sets keyed by query id. For a customer-scoped view (the default), the query is scoped to the caller's organization AND the given `customerId` (both enforced as ClickHouse row filters) — `customerId` is required. For an organization-scoped view, the data is org-wide (scoped only to the caller's organization) and `customerId` is ignored. The scope is enforced by the database — it cannot be widened by the stored SQL. If the view declares filters, pass per-request values as `filter_<name>` query parameters (e.g. `filter_region=eu`); undeclared names or disallowed values are rejected with 400. Filters narrow data within the scope — never widen it.
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
await client.customViewsExperimental.getCustomViewData({
    displayId: "displayId"
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

**request:** `Paid.GetCustomViewDataRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomViewsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customViewsExperimental.<a href="/src/api/resources/customViewsExperimental/client/Client.ts">getCustomViewEmbedToken</a>({ ...params }) -> Paid.CustomViewEmbedTokenResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

⚠️ **Experimental** — this endpoint may change or be removed without notice and is not subject to v2 backwards-compatibility guarantees. Do not build production-critical integrations against it yet.

Mints a short-lived, customer-scoped token for embedding a published custom view. Call this from your server with your API key, then pass the returned token to the embed SDK. Organization-scoped views cannot be embedded per-customer — this returns a 400 (`ORG_SCOPED_VIEW_NOT_EMBEDDABLE`) for one.
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
await client.customViewsExperimental.getCustomViewEmbedToken({
    displayId: "displayId",
    customerId: "customerId"
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

**request:** `Paid.GetCustomViewEmbedTokenRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomViewsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ValueModels
<details><summary><code>client.valueModels.<a href="/src/api/resources/valueModels/client/Client.ts">getCurrentValueModel</a>() -> Paid.ValueModelDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the current (latest active) value model for the organization.
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
await client.valueModels.getCurrentValueModel();

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

**requestOptions:** `ValueModels.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueModels.<a href="/src/api/resources/valueModels/client/Client.ts">updateValueModel</a>({ ...params }) -> Paid.ValueModelDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Uploads a new value model version. Validates the content, creates a new version, archives the previous active version, syncs to ClickHouse, and triggers a backfill of all historical signals.
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
await client.valueModels.updateValueModel({
    content: {
        currency: "currency",
        valueTypes: [{
                slug: "slug",
                name: "name",
                calculationTimeline: [{
                        effectiveFrom: "2024-01-15T09:30:00Z",
                        calculation: {
                            unit: {
                                type: "monetary"
                            },
                            formulaIds: ["formulaIds"],
                            signalEventNames: ["signalEventNames"],
                            segmentTableIds: ["segmentTableIds"],
                            overrideIds: ["overrideIds"]
                        }
                    }]
            }],
        formulas: [{
                id: "id",
                valueTypeSlug: "valueTypeSlug",
                label: "label",
                variables: [{
                        id: "id",
                        label: "label"
                    }],
                expression: "expression"
            }],
        signals: [{
                eventName: "eventName",
                label: "label"
            }]
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

**request:** `Paid.ValueModelUploadRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueModels.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueModels.<a href="/src/api/resources/valueModels/client/Client.ts">listValueModelVersions</a>({ ...params }) -> Paid.ValueModelVersionListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all value model versions sorted by version descending. Does not include the full content.
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
await client.valueModels.listValueModelVersions();

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

**request:** `Paid.ListValueModelVersionsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueModels.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueModels.<a href="/src/api/resources/valueModels/client/Client.ts">getValueModelVersion</a>({ ...params }) -> Paid.ValueModelDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a specific historical value model version by version number, including full content.
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
await client.valueModels.getValueModelVersion({
    version: 1
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

**request:** `Paid.GetValueModelVersionRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueModels.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueModels.<a href="/src/api/resources/valueModels/client/Client.ts">refreshValueModelBackfill</a>({ ...params }) -> Paid.BackfillResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Manually triggers a recalculation of all ClickHouse rows against the current value model.
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
await client.valueModels.refreshValueModelBackfill();

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

**request:** `Paid.RefreshValueModelBackfillRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueModels.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## ValueMetrics
<details><summary><code>client.valueMetrics.<a href="/src/api/resources/valueMetrics/client/Client.ts">listValueMetrics</a>({ ...params }) -> Paid.ValueMetricListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the value metrics in the current value model, without their formulas. Archived metrics are hidden unless includeArchived is true.
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
await client.valueMetrics.listValueMetrics();

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

**request:** `Paid.ListValueMetricsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueMetrics.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueMetrics.<a href="/src/api/resources/valueMetrics/client/Client.ts">createValueMetric</a>({ ...params }) -> Paid.ValueMetricWriteAck</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Adds one value metric — its unit, formula, signal binding and optional monetary conversion — to the value model. The signal must already exist: an event name your organization has sent, or one referenced by usage pricing on an active product. Publishes a new value model version and recalculates delivered value for historical signals.
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
await client.valueMetrics.createValueMetric({
    name: "Time saved",
    unit: {
        type: "monetary"
    },
    formula: {
        expression: "minutes_saved / 60",
        variables: [{
                id: "id",
                label: "label"
            }]
    },
    signal: {
        eventName: "ticket_resolved"
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

**request:** `Paid.CreateValueMetricRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueMetrics.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueMetrics.<a href="/src/api/resources/valueMetrics/client/Client.ts">getValueMetric</a>({ ...params }) -> Paid.ValueMetricDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns one value metric with its formula, signal binding and monetary conversion joined together. Call getCurrentValueModel if you need the active version number to guard a follow-up write.
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
await client.valueMetrics.getValueMetric({
    slug: "slug"
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

**request:** `Paid.GetValueMetricRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueMetrics.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueMetrics.<a href="/src/api/resources/valueMetrics/client/Client.ts">archiveValueMetric</a>({ ...params }) -> Paid.ValueMetricWriteAck</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Marks a value metric archived so it stops appearing in listValueMetrics. Its formula and signal bindings are deliberately kept, so historical delivered value and sealed value receipts still resolve — which also means an archived metric's signals continue to be ingested and can still surface on value receipts. Removing it from receipts entirely requires deleting its signal bindings. Restore it with updateValueMetric and archivedAt null.
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
await client.valueMetrics.archiveValueMetric({
    slug: "slug"
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

**request:** `Paid.ArchiveValueMetricRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueMetrics.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.valueMetrics.<a href="/src/api/resources/valueMetrics/client/Client.ts">updateValueMetric</a>({ ...params }) -> Paid.ValueMetricWriteAck</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Changes one value metric. Omitted fields are left alone. You can change its name, category, unit, customer-facing copy, sources, monetary rate, archive state, and the value, label or display format of any variable its formula declares. The formula expression and the signal it is bound to cannot be changed — recreate the metric, or use the whole value-model upload. Publishes a new value model version.
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
await client.valueMetrics.updateValueMetric({
    slug: "slug"
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

**request:** `Paid.UpdateValueMetricRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ValueMetrics.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## CustomerGroups
<details><summary><code>client.customerGroups.<a href="/src/api/resources/customerGroups/client/Client.ts">listCustomerGroups</a>({ ...params }) -> Paid.CustomerGroupListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List all customer groups for the organization.
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
await client.customerGroups.listCustomerGroups();

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

**request:** `Paid.ListCustomerGroupsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomerGroups.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customerGroups.<a href="/src/api/resources/customerGroups/client/Client.ts">createCustomerGroup</a>({ ...params }) -> Paid.CustomerGroupDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new customer group. Names must be unique per org.
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
await client.customerGroups.createCustomerGroup({
    name: "name"
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

**request:** `Paid.CreateCustomerGroupRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomerGroups.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customerGroups.<a href="/src/api/resources/customerGroups/client/Client.ts">getCustomerGroup</a>({ ...params }) -> Paid.CustomerGroupDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns group details including member list (capped at 500).
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
await client.customerGroups.getCustomerGroup({
    id: "id"
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

**request:** `Paid.GetCustomerGroupRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomerGroups.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customerGroups.<a href="/src/api/resources/customerGroups/client/Client.ts">deleteCustomerGroup</a>({ ...params }) -> Paid.CustomerGroupDeleteResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the group and unbinds all members. Unbound customers fall back to the base value model config.
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
await client.customerGroups.deleteCustomerGroup({
    id: "id"
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

**request:** `Paid.DeleteCustomerGroupRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomerGroups.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customerGroups.<a href="/src/api/resources/customerGroups/client/Client.ts">updateCustomerGroup</a>({ ...params }) -> Paid.CustomerGroupDetail</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a customer group's name or description.
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
await client.customerGroups.updateCustomerGroup({
    id: "id"
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

**request:** `Paid.UpdateCustomerGroupRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomerGroups.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customerGroups.<a href="/src/api/resources/customerGroups/client/Client.ts">createCustomerGroupMembers</a>({ ...params }) -> Paid.AddMembersResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Additive. Adds customers to the group without removing existing members.
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
await client.customerGroups.createCustomerGroupMembers({
    id: "id",
    body: {
        customerIds: ["customerIds"]
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

**request:** `Paid.CreateCustomerGroupMembersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomerGroups.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customerGroups.<a href="/src/api/resources/customerGroups/client/Client.ts">updateCustomerGroupMembers</a>({ ...params }) -> Paid.SetMembersResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Reconcile membership. The provided list is the complete desired membership. Customers not in the list are removed. Customers in the list but not currently in the group are added.
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
await client.customerGroups.updateCustomerGroupMembers({
    id: "id",
    body: {
        customerIds: ["customerIds"]
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

**request:** `Paid.UpdateCustomerGroupMembersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomerGroups.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.customerGroups.<a href="/src/api/resources/customerGroups/client/Client.ts">deleteCustomerGroupMembers</a>({ ...params }) -> Paid.RemoveMembersResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes specific customers from the group.
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
await client.customerGroups.deleteCustomerGroupMembers({
    id: "id",
    body: {
        customerIds: ["customerIds"]
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

**request:** `Paid.DeleteCustomerGroupMembersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `CustomerGroups.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PaymentMethods
<details><summary><code>client.paymentMethods.<a href="/src/api/resources/paymentMethods/client/Client.ts">listPaymentMethods</a>({ ...params }) -> Paid.PaymentMethodListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the payment methods saved for a customer
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
await client.paymentMethods.listPaymentMethods({
    customerId: "cus_1234abcd"
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

**request:** `Paid.ListPaymentMethodsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PaymentMethods.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentMethods.<a href="/src/api/resources/paymentMethods/client/Client.ts">createPaymentMethod</a>({ ...params }) -> Paid.PaymentMethodSetup</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Starts attaching a payment method to a customer by exchanging a client-side confirmation token for a setup intent. Complete any additional authentication client-side using the returned client secret.
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
await client.paymentMethods.createPaymentMethod({
    confirmationToken: "ctoken_1NXWPnLkdIwHu7ix"
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

**request:** `Paid.CreatePaymentMethodRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PaymentMethods.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentMethods.<a href="/src/api/resources/paymentMethods/client/Client.ts">getPaymentMethod</a>({ ...params }) -> Paid.PaymentMethod</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a payment method by its ID
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
await client.paymentMethods.getPaymentMethod({
    id: "id"
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

**request:** `Paid.GetPaymentMethodRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PaymentMethods.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentMethods.<a href="/src/api/resources/paymentMethods/client/Client.ts">deletePaymentMethod</a>({ ...params }) -> Paid.EmptyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Detaches a payment method from the customer and removes it from the payment processor
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
await client.paymentMethods.deletePaymentMethod({
    id: "id"
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

**request:** `Paid.DeletePaymentMethodRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PaymentMethods.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentMethods.<a href="/src/api/resources/paymentMethods/client/Client.ts">updateDefaultPaymentMethod</a>({ ...params }) -> Paid.PaymentMethod</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Makes this payment method the customer's default for future charges
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
await client.paymentMethods.updateDefaultPaymentMethod({
    id: "id"
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

**request:** `Paid.UpdateDefaultPaymentMethodRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PaymentMethods.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Payments
<details><summary><code>client.payments.<a href="/src/api/resources/payments/client/Client.ts">listPayments</a>({ ...params }) -> Paid.PaymentListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists payments for your organization
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
await client.payments.listPayments();

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

**request:** `Paid.ListPaymentsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Payments.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/src/api/resources/payments/client/Client.ts">createPayment</a>({ ...params }) -> Paid.Payment</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Records a payment received from a customer, e.g. a bank transfer or check collected outside Paid. Allocate it to invoice lines with the payment allocations endpoints.
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
await client.payments.createPayment({
    amount: 15000,
    currency: "USD",
    paymentType: "creditCard"
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

**request:** `Paid.CreatePaymentRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Payments.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.payments.<a href="/src/api/resources/payments/client/Client.ts">getPayment</a>({ ...params }) -> Paid.Payment</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get a payment by its ID
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
await client.payments.getPayment({
    id: "id"
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

**request:** `Paid.GetPaymentRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Payments.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PaymentAllocations
<details><summary><code>client.paymentAllocations.<a href="/src/api/resources/paymentAllocations/client/Client.ts">listPaymentAllocations</a>({ ...params }) -> Paid.PaymentAllocationListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists payment allocations for a payment or an invoice
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
await client.paymentAllocations.listPaymentAllocations({
    paymentId: "pay_1234abcd",
    invoiceId: "inv_1234abcd"
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

**request:** `Paid.ListPaymentAllocationsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PaymentAllocations.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.paymentAllocations.<a href="/src/api/resources/paymentAllocations/client/Client.ts">createPaymentAllocation</a>({ ...params }) -> Paid.PaymentAllocationCreateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Allocates a payment across one or more invoice lines. When an invoice becomes fully paid, its credit entitlements are processed.
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
await client.paymentAllocations.createPaymentAllocation({
    paymentId: "pay_1234abcd",
    allocations: [{
            invoiceLineId: "invoiceLineId",
            amount: 15000
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

**request:** `Paid.CreatePaymentAllocationRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PaymentAllocations.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Amendments
<details><summary><code>client.amendments.<a href="/src/api/resources/amendments/client/Client.ts">getOrderAmendmentOptions</a>({ ...params }) -> Paid.AmendmentOptions</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns which amendments the order admits right now: per-attribute intents and treatment axes with choosable options, defaults, and unavailability reasons, plus the order version, currency, and effective date an amendment request needs.
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
await client.amendments.getOrderAmendmentOptions({
    orderId: "orderId"
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

**request:** `Paid.GetOrderAmendmentOptionsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Amendments.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.amendments.<a href="/src/api/resources/amendments/client/Client.ts">previewOrderAmendment</a>({ ...params }) -> Paid.AmendmentPlan</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Compiles amendment intents into a plan (operations, money effects, credit effects, state diff) without executing. The returned planHash can be passed to the execute endpoint for two-phase, drift-guarded execution.
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
await client.amendments.previewOrderAmendment({
    orderId: "orderId",
    orderVersion: 1,
    intents: [{
            type: "updateQuantity",
            orderLineAttributeId: "orderLineAttributeId",
            newQuantity: 1
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

**request:** `Paid.UnifiedAmendmentPreviewRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Amendments.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.amendments.<a href="/src/api/resources/amendments/client/Client.ts">executeOrderAmendment</a>({ ...params }) -> Paid.UnifiedAmendmentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Executes amendment intents against an order. One-shot by default; pass the previewed planHash to require the recomputed plan to match (409 PLAN_CONFLICT on drift).
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
await client.amendments.executeOrderAmendment({
    orderId: "orderId",
    orderVersion: 1,
    intents: [{
            type: "updateQuantity",
            orderLineAttributeId: "orderLineAttributeId",
            newQuantity: 1
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

**request:** `Paid.UnifiedAmendmentExecuteRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Amendments.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## AnalyticsExperimental
<details><summary><code>client.analyticsExperimental.<a href="/src/api/resources/analyticsExperimental/client/Client.ts">executeExperimentalAnalyticsQuery</a>({ ...params }) -> Paid.AnalyticsQueryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This experimental path is deprecated and is not supported for new integrations. Use `POST /api/v2/analytics/query` instead; the old path remains available for existing integrations.

Runs a single ClickHouse SELECT (or WITH … SELECT) against your organization's analytics views. Before writing a query, call `getAnalyticsSchema` (GET /schema) for the available views and columns, and `getSignalsMetadata` (GET /signals/metadata) for the JSON paths inside `fact_signal.data`. Results are automatically scoped to your organization — no org filter is needed or possible. Only SELECT/WITH statements are accepted.

Conventions: monetary amounts are minor units (cents — divide by 100 for the major unit); most are integers, but `fact_cost.cost_amount` is fractional cents (Decimal) since a single AI call usually costs less than a cent; 64-bit integers (counts, ids, amounts) are returned as JSON strings to preserve precision, so parse them client-side; Decimal columns (fractional cents, and credit amounts, which are counts of credits rather than cents and are never divided by 100) come back as JSON numbers instead, so a value beyond 2^53 is already rounded — select toString(col) when you need its exact digits. Query signal payloads via JSON paths, e.g. `SELECT data.country::String AS country, count() FROM fact_signal GROUP BY country`.

Limits: 30 seconds of execution time and 10,000 result rows (truncation is flagged via `meta.truncated`). Prefer aggregates and a `created_at` date filter on large tables — this endpoint is for interactive analytics, not bulk export.
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
await client.analyticsExperimental.executeExperimentalAnalyticsQuery({
    query: "SELECT signal_name, count() AS signals FROM fact_signal WHERE created_at > now() - INTERVAL 30 DAY GROUP BY signal_name ORDER BY signals DESC"
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

**request:** `Paid.AnalyticsQueryRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AnalyticsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analyticsExperimental.<a href="/src/api/resources/analyticsExperimental/client/Client.ts">getExperimentalAnalyticsSchema</a>() -> Paid.AnalyticsSchemaResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This experimental path is deprecated and is not supported for new integrations. Use `GET /api/v2/analytics/schema` instead; the old path remains available for existing integrations.

Returns the analytics views available to POST /query, with column names, ClickHouse types, and descriptions. Dimensions (`dim_*`) describe entities; facts (`fact_*`) are event/transaction tables that join to dimensions via the `*_id` columns described in each comment.
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
await client.analyticsExperimental.getExperimentalAnalyticsSchema();

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

**requestOptions:** `AnalyticsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.analyticsExperimental.<a href="/src/api/resources/analyticsExperimental/client/Client.ts">getExperimentalSignalsMetadata</a>({ ...params }) -> Paid.SignalsMetadataResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

This experimental path is deprecated and is not supported for new integrations. Use `GET /api/v2/analytics/signals/metadata` instead; the old path remains available for existing integrations.

Lists the JSON paths (and their observed types) present in the `data` payload of your signals within a time window (default: last 30 days), grouped by signal name. Use the returned paths in queries against `fact_signal`, e.g. `WHERE data.<path>::String = '...'`.
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
await client.analyticsExperimental.getExperimentalSignalsMetadata();

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

**request:** `Paid.GetExperimentalSignalsMetadataRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AnalyticsExperimental.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>
