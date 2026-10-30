# Reference
## products
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

## plans
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

## customers
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

Creates a new customer for the organization. `externalId` shares one set of ids with customer unit ids and aliases, unique across the organization and ignoring letter case: an external id that another customer already holds as a unit id or alias, or as its external id in another case, is refused with `409 EXTERNAL_ID_IN_USE`. The same id in the same case is `400 DUPLICATE_EXTERNAL_ID`, as before.
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

Create an alternate external identifier for a customer by Paid display ID. The alias shares one set of ids with customer external ids and unit ids, unique within the organization and ignoring letter case: an alias that another customer already holds as its external id, a unit id or an alias is refused with `409 EXTERNAL_ID_IN_USE` (an exact match keeps its older code, `ALIAS_CONFLICTS_WITH_CUSTOMER_EXTERNAL_ID` or `CUSTOMER_ALIAS_ALREADY_EXISTS`).
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

Update a customer by Paid display ID. Use the value returned as `customer.id`, for example `cus_abc123`. If you have your own customer ID, use `PUT /api/v2/customers/external/{externalId}`. Changing `externalId` follows the organization-wide id rule: a new id that another customer already holds as its external id, a unit id or an alias, ignoring letter case, is refused with `409 EXTERNAL_ID_IN_USE`; the same id in the same case stays `400 DUPLICATE_EXTERNAL_ID`. When the id changes, the previous id is kept as an alias of the customer, so signals that still use it keep resolving to it.
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

Delete a customer by Paid display ID. Use the value returned as `customer.id`, for example `cus_abc123`. If you have your own customer ID, use `DELETE /api/v2/customers/external/{externalId}`. A customer that still has orders, invoices, payments, contacts, child customers or other linked records is not deleted: the request returns 409 `CUSTOMER_HAS_ASSOCIATIONS` and `details` lists what is linked.
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

Create an alternate external identifier for a customer by external ID. The alias shares one set of ids with customer external ids and unit ids, unique within the organization and ignoring letter case: an alias that another customer already holds as its external id, a unit id or an alias is refused with `409 EXTERNAL_ID_IN_USE` (an exact match keeps its older code, `ALIAS_CONFLICTS_WITH_CUSTOMER_EXTERNAL_ID` or `CUSTOMER_ALIAS_ALREADY_EXISTS`).
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

Update a customer by external ID. Changing `externalId` follows the organization-wide id rule: a new id that another customer already holds as its external id, a unit id or an alias, ignoring letter case, is refused with `409 EXTERNAL_ID_IN_USE`; the same id in the same case stays `400 DUPLICATE_EXTERNAL_ID`. When the id changes, the previous id is kept as an alias of the customer, so signals that still use it keep resolving to it.
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

Delete a customer by external ID. A customer that still has orders, invoices, payments, contacts, child customers or other linked records is not deleted: the request returns 409 `CUSTOMER_HAS_ASSOCIATIONS` and `details` lists what is linked.
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
        expiresAt: "2026-12-31T23:59:59Z",
        idempotencyKey: "grant_acme_2026-06-05"
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
        expiresAt: "2026-12-31T23:59:59Z",
        idempotencyKey: "grant_acme_2026-06-05"
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerFundingInstructions</a>({ ...params }) -> Paid.CustomerFundingInstructions</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the virtual bank account (Stripe funding instructions) a customer can pay by bank transfer into, by Paid display ID.
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
await client.customers.getCustomerFundingInstructions({
    id: "cus_abc123",
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

**request:** `Paid.GetCustomerFundingInstructionsRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerFundingInstructions</a>({ ...params }) -> Paid.CustomerFundingInstructions</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a dedicated virtual bank account for the customer to pay invoices by bank transfer, by Paid display ID. Returns the existing account if one already exists for the currency. Requires a live-mode organization with Stripe connected and Bank Transfers enabled on the Stripe account.
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
await client.customers.createCustomerFundingInstructions({
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

**request:** `Paid.CreateCustomerFundingInstructionsRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerFundingInstructionsByExternalId</a>({ ...params }) -> Paid.CustomerFundingInstructions</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the virtual bank account (Stripe funding instructions) a customer can pay by bank transfer into, by your external ID.
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
await client.customers.getCustomerFundingInstructionsByExternalId({
    externalId: "externalId",
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

**request:** `Paid.GetCustomerFundingInstructionsByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerFundingInstructionsByExternalId</a>({ ...params }) -> Paid.CustomerFundingInstructions</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a dedicated virtual bank account for the customer to pay invoices by bank transfer, by your external ID. Returns the existing account if one already exists for the currency. Requires a live-mode organization with Stripe connected and Bank Transfers enabled on the Stripe account.
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
await client.customers.createCustomerFundingInstructionsByExternalId({
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

**request:** `Paid.CreateCustomerFundingInstructionsByExternalIdRequest` 
    
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

Lists the customer's units as a flat list, newest last; assemble the tree from `parentExternalId` (`null` on the root unit, `isRoot: true`). Deleted units are hidden unless `status=DELETED` is given, drafts unless `status=DRAFT`. Filter by `externalType`, or by `parentExternalId` for one level of the tree. Addresses the customer by your external customer id.
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

Creates a unit for this customer. `externalId` is your own key for it: required, immutable, and unique within the organization (no other customer's unit id, external id or alias may be the same, ignoring letter case, and a key another customer's signals named while that customer had no unit with it is kept for that customer: `409 EXTERNAL_ID_IN_USE`); every unit route addresses the unit by it, and `name` defaults to it. Omit `parentExternalId` to create the customer's root unit (its first unit; `409 ROOT_EXISTS` if it already has one — a customer created with an external id usable as a unit key already has its root, keyed by that external id, so name it as the parent instead); otherwise the parent must exist (`409 PARENT_NOT_FOUND`) and be ACTIVE. A create whose `externalId` is one of this customer's `DRAFT` units promotes the draft in place: same unit, same id, now ACTIVE with the request's name, type, metadata and parent (`parentExternalId` is required; a draft sits under the root). A signal that names a unit before it exists is accepted; with draft units enabled for your organization it creates a `DRAFT` unit under the customer's root that holds the key, and creating the unit with that key later promotes the draft; otherwise its spend attaches to the unit once you create it with that key. `409` also when the externalId is taken on this customer (`CUSTOMER_UNIT_EXISTS`) or by another customer of the organization (`EXTERNAL_ID_IN_USE`), the tree would get too deep, the customer is on seat-based billing, or a root unit is sent with `billable: false` (`ROOT_UNIT_ALWAYS_BILLABLE`). `403 FEATURE_NOT_ENABLED` for `billable: false` when non-billable units are not enabled for your organization. Addresses the customer by your external customer id.
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

Soft-deletes a unit: it stays readable with `status: DELETED` and cannot be reactivated. Spend history that references it is kept, and signals that keep naming it are still attributed to it. A `DRAFT` unit is deleted the same way: it stays readable as DELETED, its key stays reserved, and spend already keyed to it stays its own. `409` while the unit has ACTIVE or DRAFT children or a cap in force or scheduled; the root follows the same rules, and once it is deleted a new root can be created. Addresses the customer by your external customer id.
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

Renames, re-types, re-parents or annotates a unit, the root included. `externalId` cannot change. Re-parenting (`parentExternalId`) moves the unit with everything under it. Spend already recorded keeps naming the unit it landed on; caps are evaluated on the current tree, so from the move on the unit's spend in the running cap period counts toward its new ancestors' caps and no longer toward the old ones. `billable` flips the unit's own setting; moving a unit under a non-billable one makes it non-billable in effect (`effectiveBillable`). `409` for a deleted unit (`CUSTOMER_UNIT_DELETED`), a draft (`CUSTOMER_UNIT_DRAFT`), a parent that does not exist or is not ACTIVE, a move of the root (`ROOT_UNIT_IMMOVABLE`), `billable: false` on the root (`ROOT_UNIT_ALWAYS_BILLABLE`), a move under the unit's own subtree, or a tree that would get too deep. `403 FEATURE_NOT_ENABLED` for `billable: false` when non-billable units are not enabled for your organization. Addresses the customer by your external customer id.
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerUnitAliasesByExternalId</a>({ ...params }) -> Paid.CustomerAliasListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the aliases that land signals on this unit. A customer-level alias (created on the customer routes) points at the customer's root unit, so it is listed under the root. Addresses the customer by your external customer id.
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
await client.customers.listCustomerUnitAliasesByExternalId({
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

**request:** `Paid.ListCustomerUnitAliasesByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerUnitAliasByExternalId</a>({ ...params }) -> Paid.CustomerAlias</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an alias that lands signals on this unit: a signal whose `externalCustomerId` is the alias resolves to this customer and, when it names no `customerUnit`, to this unit. The alias shares one set of ids with customer external ids and unit ids, unique within the organization and ignoring letter case: an alias another customer holds is refused with `409 EXTERNAL_ID_IN_USE`. Addresses the customer by your external customer id.
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
await client.customers.createCustomerUnitAliasByExternalId({
    externalId: "customer_123",
    externalCustomerUnitId: "team-research",
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

**request:** `Paid.CreateCustomerUnitAliasByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteCustomerUnitAliasByExternalId</a>({ ...params }) -> Paid.DeleteCustomerUnitAliasByExternalIdResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an alias of this unit. Signals still sent with it then resolve to nothing again. Addresses the customer by your external customer id.
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
await client.customers.deleteCustomerUnitAliasByExternalId({
    externalId: "customer_123",
    externalCustomerUnitId: "team-research",
    alias: "tenant-7-sandbox"
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

**request:** `Paid.DeleteCustomerUnitAliasByExternalIdRequest` 
    
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

Lists the customer's units as a flat list, newest last; assemble the tree from `parentExternalId` (`null` on the root unit, `isRoot: true`). Deleted units are hidden unless `status=DELETED` is given, drafts unless `status=DRAFT`. Filter by `externalType`, or by `parentExternalId` for one level of the tree. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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

Creates a unit for this customer. `externalId` is your own key for it: required, immutable, and unique within the organization (no other customer's unit id, external id or alias may be the same, ignoring letter case, and a key another customer's signals named while that customer had no unit with it is kept for that customer: `409 EXTERNAL_ID_IN_USE`); every unit route addresses the unit by it, and `name` defaults to it. Omit `parentExternalId` to create the customer's root unit (its first unit; `409 ROOT_EXISTS` if it already has one — a customer created with an external id usable as a unit key already has its root, keyed by that external id, so name it as the parent instead); otherwise the parent must exist (`409 PARENT_NOT_FOUND`) and be ACTIVE. A create whose `externalId` is one of this customer's `DRAFT` units promotes the draft in place: same unit, same id, now ACTIVE with the request's name, type, metadata and parent (`parentExternalId` is required; a draft sits under the root). A signal that names a unit before it exists is accepted; with draft units enabled for your organization it creates a `DRAFT` unit under the customer's root that holds the key, and creating the unit with that key later promotes the draft; otherwise its spend attaches to the unit once you create it with that key. `409` also when the externalId is taken on this customer (`CUSTOMER_UNIT_EXISTS`) or by another customer of the organization (`EXTERNAL_ID_IN_USE`), the tree would get too deep, the customer is on seat-based billing, or a root unit is sent with `billable: false` (`ROOT_UNIT_ALWAYS_BILLABLE`). `403 FEATURE_NOT_ENABLED` for `billable: false` when non-billable units are not enabled for your organization. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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

Soft-deletes a unit: it stays readable with `status: DELETED` and cannot be reactivated. Spend history that references it is kept, and signals that keep naming it are still attributed to it. A `DRAFT` unit is deleted the same way: it stays readable as DELETED, its key stays reserved, and spend already keyed to it stays its own. `409` while the unit has ACTIVE or DRAFT children or a cap in force or scheduled; the root follows the same rules, and once it is deleted a new root can be created. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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

Renames, re-types, re-parents or annotates a unit, the root included. `externalId` cannot change. Re-parenting (`parentExternalId`) moves the unit with everything under it. Spend already recorded keeps naming the unit it landed on; caps are evaluated on the current tree, so from the move on the unit's spend in the running cap period counts toward its new ancestors' caps and no longer toward the old ones. `billable` flips the unit's own setting; moving a unit under a non-billable one makes it non-billable in effect (`effectiveBillable`). `409` for a deleted unit (`CUSTOMER_UNIT_DELETED`), a draft (`CUSTOMER_UNIT_DRAFT`), a parent that does not exist or is not ACTIVE, a move of the root (`ROOT_UNIT_IMMOVABLE`), `billable: false` on the root (`ROOT_UNIT_ALWAYS_BILLABLE`), a move under the unit's own subtree, or a tree that would get too deep. `403 FEATURE_NOT_ENABLED` for `billable: false` when non-billable units are not enabled for your organization. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerUnitAliases</a>({ ...params }) -> Paid.CustomerAliasListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the aliases that land signals on this unit. A customer-level alias (created on the customer routes) points at the customer's root unit, so it is listed under the root. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.listCustomerUnitAliases({
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

**request:** `Paid.ListCustomerUnitAliasesRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerUnitAlias</a>({ ...params }) -> Paid.CustomerAlias</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an alias that lands signals on this unit: a signal whose `externalCustomerId` is the alias resolves to this customer and, when it names no `customerUnit`, to this unit. The alias shares one set of ids with customer external ids and unit ids, unique within the organization and ignoring letter case: an alias another customer holds is refused with `409 EXTERNAL_ID_IN_USE`. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.createCustomerUnitAlias({
    id: "cus_abc123",
    externalCustomerUnitId: "team-research",
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

**request:** `Paid.CreateCustomerUnitAliasRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteCustomerUnitAlias</a>({ ...params }) -> Paid.DeleteCustomerUnitAliasResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an alias of this unit. Signals still sent with it then resolve to nothing again. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.deleteCustomerUnitAlias({
    id: "cus_abc123",
    externalCustomerUnitId: "team-research",
    alias: "tenant-7-sandbox"
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

**request:** `Paid.DeleteCustomerUnitAliasRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerUnitByKey</a>({ ...params }) -> Paid.CustomerUnitByKey</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a unit by its key without naming its customer. The answer carries the customer's ids (`customerId`, `customerExternalId`) so the customer routes are one hop away, but, like the create on this path, not Paid's unit id: a caller of these routes names units by key. The key is looked up across the organization ignoring letter case. When more than one unit carries it in another letter case (legacy duplicates across customers, or case variants on one customer), the exact spelling decides; when that does not single one out either, the answer is `409 CUSTOMER_UNIT_AMBIGUOUS`: use the customer's unit routes, where the key is exact.
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
await client.customers.getCustomerUnitByKey({
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

**request:** `Paid.GetCustomerUnitByKeyRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerUnitAliasesByKey</a>({ ...params }) -> Paid.CustomerAliasListResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the aliases that land signals on this unit, without naming its customer. The key is looked up across the organization ignoring letter case. When more than one unit carries it in another letter case (legacy duplicates across customers, or case variants on one customer), the exact spelling decides; when that does not single one out either, the answer is `409 CUSTOMER_UNIT_AMBIGUOUS`: use the customer's unit routes, where the key is exact.
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
await client.customers.listCustomerUnitAliasesByKey({
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

**request:** `Paid.ListCustomerUnitAliasesByKeyRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerUnitAliasByKey</a>({ ...params }) -> Paid.CustomerAlias</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an alias that lands signals on this unit, without naming its customer: a signal whose `externalCustomerId` is the alias resolves to the unit's customer and is attributed to this unit. The alias must be unique within the organization ignoring letter case (`409 EXTERNAL_ID_IN_USE`). The key is looked up across the organization ignoring letter case. When more than one unit carries it in another letter case (legacy duplicates across customers, or case variants on one customer), the exact spelling decides; when that does not single one out either, the answer is `409 CUSTOMER_UNIT_AMBIGUOUS`: use the customer's unit routes, where the key is exact.
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
await client.customers.createCustomerUnitAliasByKey({
    externalCustomerUnitId: "team-research",
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

**request:** `Paid.CreateCustomerUnitAliasByKeyRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">deleteCustomerUnitAliasByKey</a>({ ...params }) -> Paid.DeleteCustomerUnitAliasByKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an alias of this unit, without naming its customer. Signals still sent with it then resolve to nothing again. The key is looked up across the organization ignoring letter case. When more than one unit carries it in another letter case (legacy duplicates across customers, or case variants on one customer), the exact spelling decides; when that does not single one out either, the answer is `409 CUSTOMER_UNIT_AMBIGUOUS`: use the customer's unit routes, where the key is exact.
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
await client.customers.deleteCustomerUnitAliasByKey({
    externalCustomerUnitId: "team-research",
    alias: "tenant-7"
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

**request:** `Paid.DeleteCustomerUnitAliasByKeyRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerUnitUnderParent</a>({ ...params }) -> Paid.CustomerUnitCreatedUnderParent</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a unit by naming its parent alone; the customer is whoever the parent belongs to, so a caller that only knows its own ids never needs the customer routes. `parentExternalId` is looked up across the organization, ignoring letter case, among unit ids, customer external ids and aliases: a unit becomes the parent; a customer (by external id or alias) stands for the top of its tree, so the new unit goes under the root unit, or becomes the root when the customer has none. The parent is only ever named by your id, never by a Paid id, so a customer with no external id takes its units through the customer's unit routes. The answer carries the unit's `externalId` and its customer's ids, not Paid's unit id. `externalId` follows the same rules as on the customer-scoped create: required, immutable, unique within the organization ignoring letter case. `409 PARENT_NOT_FOUND` when nothing matches, `PARENT_NOT_ACTIVE` for a deleted or draft parent, `PARENT_AMBIGUOUS` when legacy rows let the id name more than one customer (use that customer's unit routes), `PARENT_CHANGED` when the reference pointed elsewhere by the time the create ran (send it again), and otherwise the customer-scoped create's 409s (`CUSTOMER_UNIT_EXISTS`, `EXTERNAL_ID_IN_USE`, `DEPTH_EXCEEDED`, `SEAT_BILLING`, and `ROOT_UNIT_ALWAYS_BILLABLE` for `billable: false` on a unit that would become the root). `403 FEATURE_NOT_ENABLED` for `billable: false` when non-billable units are not enabled for your organization.
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
await client.customers.createCustomerUnitUnderParent({
    externalId: "team-research",
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

**request:** `Paid.CustomerUnitCreateUnderParent` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerApiKeysByExternalId</a>({ ...params }) -> Paid.CustomerApiKeyList</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists this customer's API keys, newest first and paginated, revoked and expired ones included. The secret is never returned; `keyPrefix` and `last4` identify each key. Addresses the customer by your external customer id.
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
await client.customers.listCustomerApiKeysByExternalId({
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

**request:** `Paid.ListCustomerApiKeysByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerApiKeyByExternalId</a>({ ...params }) -> Paid.CustomerApiKeyCreated</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an API key bound to this customer. The response carries the secret in `key`, returned only this once: store it immediately, as Paid keeps only its hash. The key acts for this customer alone: it can send signals for this customer through `POST /api/v2/signals/bulk`, and every other route refuses it. Requires `write:api-keys`, which full-access keys hold; a restricted key needs the scope granted explicitly. Addresses the customer by your external customer id.
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
await client.customers.createCustomerApiKeyByExternalId({
    externalId: "customer_123",
    body: {
        name: "Tenant runtime (production)"
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

**request:** `Paid.CreateCustomerApiKeyByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">revokeCustomerApiKeyByExternalId</a>({ ...params }) -> Paid.CustomerApiKey</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Revokes one of this customer's keys, which then stops authenticating. Keys are never deleted: a revoked key stays listed with `revokedAt` set, and deleting the customer revokes its keys too. Revoking an already revoked key returns it unchanged. `404` when the key does not belong to this customer. Addresses the customer by your external customer id.
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
await client.customers.revokeCustomerApiKeyByExternalId({
    externalId: "customer_123",
    apiKeyId: "apiKeyId"
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

**request:** `Paid.RevokeCustomerApiKeyByExternalIdRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">listCustomerApiKeys</a>({ ...params }) -> Paid.CustomerApiKeyList</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists this customer's API keys, newest first and paginated, revoked and expired ones included. The secret is never returned; `keyPrefix` and `last4` identify each key. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.listCustomerApiKeys({
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

**request:** `Paid.ListCustomerApiKeysRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">createCustomerApiKey</a>({ ...params }) -> Paid.CustomerApiKeyCreated</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an API key bound to this customer. The response carries the secret in `key`, returned only this once: store it immediately, as Paid keeps only its hash. The key acts for this customer alone: it can send signals for this customer through `POST /api/v2/signals/bulk`, and every other route refuses it. Requires `write:api-keys`, which full-access keys hold; a restricted key needs the scope granted explicitly. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.createCustomerApiKey({
    id: "cus_abc123",
    body: {
        name: "Tenant runtime (production)"
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

**request:** `Paid.CreateCustomerApiKeyRequest` 
    
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">revokeCustomerApiKey</a>({ ...params }) -> Paid.CustomerApiKey</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Revokes one of this customer's keys, which then stops authenticating. Keys are never deleted: a revoked key stays listed with `revokedAt` set, and deleting the customer revokes its keys too. Revoking an already revoked key returns it unchanged. `404` when the key does not belong to this customer. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.revokeCustomerApiKey({
    id: "cus_abc123",
    apiKeyId: "apiKeyId"
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

**request:** `Paid.RevokeCustomerApiKeyRequest` 
    
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

Sets the cap on this customer unit for one credits currency. Returns `changed: false` without creating a version when the effective timeline is unchanged; otherwise records a new version, preserving earlier rows. The newest version wins where they overlap. `effectiveFrom` controls applicability; `schedule` defines monthly UTC boundaries independently. Omit schedule to inherit the version covering effectiveFrom, or use the creation-time UTC day if none applies. Select the currency with `creditsCurrencyId` in the body; it may be omitted only when the organization has exactly one credits currency. A cap covers the unit and every unit beneath it, so a cap on the customer's root unit covers every unit of that customer; spend from a signal that names no unit counts toward no cap. `404` when the customer or the unit does not exist. `409` for customers on seat-based billing, a deleted unit (`CUSTOMER_UNIT_DELETED`) or a draft (`CUSTOMER_UNIT_DRAFT`). Addresses the customer by your external customer id.
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerUnitSpendByExternalId</a>({ ...params }) -> Paid.CustomerUnitSpendResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the credits of one credits currency spent by this customer unit and every unit beneath it during a window, whether or not the unit has a cap. The window runs from `start` (inclusive) to `end` (exclusive), at most 366 days; omit both for the current calendar month (UTC). For a capped unit over its cap's current period, `spent` equals the cap's `used`. Spend from a signal that names no unit counts toward no unit. Select the currency with `creditsCurrencyId`; it may be omitted only when the organization has exactly one credits currency, which is then used and echoed back. `404` when the customer or the unit does not exist. Addresses the customer by your external customer id.
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
await client.customers.getCustomerUnitSpendByExternalId({
    externalId: "customer_123",
    externalCustomerUnitId: "tenant-a",
    creditsCurrencyId: "7f4f5d4c-55e9-4d5b-a3e7-c9eb3d2d01bf",
    start: "2026-10-01T00:00:00Z",
    end: "2026-11-01T00:00:00Z"
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

**request:** `Paid.GetCustomerUnitSpendByExternalIdRequest` 
    
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

Sets the cap on this customer unit for one credits currency. Returns `changed: false` without creating a version when the effective timeline is unchanged; otherwise records a new version, preserving earlier rows. The newest version wins where they overlap. `effectiveFrom` controls applicability; `schedule` defines monthly UTC boundaries independently. Omit schedule to inherit the version covering effectiveFrom, or use the creation-time UTC day if none applies. Select the currency with `creditsCurrencyId` in the body; it may be omitted only when the organization has exactly one credits currency. A cap covers the unit and every unit beneath it, so a cap on the customer's root unit covers every unit of that customer; spend from a signal that names no unit counts toward no cap. `404` when the customer or the unit does not exist. `409` for customers on seat-based billing, a deleted unit (`CUSTOMER_UNIT_DELETED`) or a draft (`CUSTOMER_UNIT_DRAFT`). Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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

<details><summary><code>client.customers.<a href="/src/api/resources/customers/client/Client.ts">getCustomerUnitSpend</a>({ ...params }) -> Paid.CustomerUnitSpendResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the credits of one credits currency spent by this customer unit and every unit beneath it during a window, whether or not the unit has a cap. The window runs from `start` (inclusive) to `end` (exclusive), at most 366 days; omit both for the current calendar month (UTC). For a capped unit over its cap's current period, `spent` equals the cap's `used`. Spend from a signal that names no unit counts toward no unit. Select the currency with `creditsCurrencyId`; it may be omitted only when the organization has exactly one credits currency, which is then used and echoed back. `404` when the customer or the unit does not exist. Use the value returned as `customer.id`, for example `cus_abc123`; if you have your own customer ID, use the `/api/v2/customers/external/{externalId}/…` twin.
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
await client.customers.getCustomerUnitSpend({
    id: "cus_abc123",
    externalCustomerUnitId: "tenant-a",
    creditsCurrencyId: "7f4f5d4c-55e9-4d5b-a3e7-c9eb3d2d01bf",
    start: "2026-10-01T00:00:00Z",
    end: "2026-11-01T00:00:00Z"
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

**request:** `Paid.GetCustomerUnitSpendRequest` 
    
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

## contacts
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

Update a contact by its ID. A contact can move to another customer only if no orders or invoices reference it; otherwise a different `customerId` returns 400 `CONTACT_CUSTOMER_IMMUTABLE`.
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

Delete a contact by its ID. A contact referenced by an order or an unsettled invoice cannot be deleted (409 `CONTACT_HAS_ASSOCIATIONS`). Posted paid invoices, voided invoices and canceled invoices do not block deletion.
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

Update a contact by its external ID. A contact can move to another customer only if no orders or invoices reference it; otherwise a different `customerId` returns 400 `CONTACT_CUSTOMER_IMMUTABLE`.
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

Delete a contact by its external ID. A contact referenced by an order or an unsettled invoice cannot be deleted (409 `CONTACT_HAS_ASSOCIATIONS`). Posted paid invoices, voided invoices and canceled invoices do not block deletion.
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

## orders
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

Update an order by ID. creationState must equal the order's current state; activate a draft order with POST /orders/{id}/activate.
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

<details><summary><code>client.orders.<a href="/src/api/resources/orders/client/Client.ts">upsertOrderByExternalId</a>({ ...params }) -> Paid.ProvisionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates or updates a customer, an optional contact, the products on the order, and the order with its lines, in one call. Each record is matched by its `externalId`, so you can send the same deal again after it changes in your CRM. Returns 201 Created when the order is new, and 200 OK when an existing draft order with the same `externalId` was updated. Treat both as success. Re-provisioning an order that is already active returns 409 `ORDER_ALREADY_ACTIVE`; change an active order through the amendments API instead. Amounts are whole numbers in minor currency units (cents).
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
await client.orders.upsertOrderByExternalId({
    "idempotency-key": "deal_88213-2026-09-30T14:05:00Z",
    externalReference: {
        source: "standard",
        metadata: {
            "crmDealId": "deal_88213",
            "crmAccountId": "acct_4410"
        }
    },
    customer: {
        externalId: "acct_4410",
        name: "Northwind Logistics",
        email: "billing@northwind.example",
        billingAddress: {
            line1: "200 Harbor Way",
            city: "Seattle",
            state: "WA",
            zipCode: "98101",
            country: "US"
        }
    },
    order: {
        externalId: "deal_88213",
        name: "Northwind Logistics - Growth plan",
        currency: "USD",
        startDate: "2026-10-01T00:00:00.000Z",
        lines: [{
                externalId: "deal_88213_platform",
                startDate: "2026-10-01T00:00:00.000Z",
                product: {
                    externalId: "growth_plan",
                    name: "Growth plan",
                    attributes: [{
                            name: "Platform fee",
                            pricing: {
                                chargeType: "recurring",
                                pricingModel: "perUnit",
                                billingFrequency: "monthly",
                                billingType: "advance",
                                pricePoints: {
                                    currency: "USD",
                                    unitPrice: 49900
                                }
                            }
                        }]
                }
            }, {
                externalId: "deal_88213_launch_discount",
                lineType: "CREDIT",
                startDate: "2026-10-01T00:00:00.000Z",
                endDate: "2027-01-01T00:00:00.000Z",
                product: {
                    externalId: "launch_discount",
                    name: "Launch discount",
                    attributes: [{
                            name: "Launch discount",
                            pricing: {
                                chargeType: "recurring",
                                pricingModel: "perUnit",
                                billingFrequency: "monthly",
                                billingType: "advance",
                                pricePoints: {
                                    currency: "USD",
                                    unitPrice: 10000
                                }
                            }
                        }]
                }
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

**request:** `Paid.ProvisionRequest` 
    
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

## invoices
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

## signals
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

<details><summary><code>client.signals.<a href="/src/api/resources/signals/client/Client.ts">getSignalsByIds</a>({ ...params }) -> Paid.SignalLookupResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Fetch up to 500 ingested signals (usage events) by ID in one request, each with the data payload submitted at ingest. Use it to resolve the `signalId` values on a page of credit transactions, or the signals behind one run or ticket, instead of calling `GET /api/v2/signals/{id}` once per signal. Signals are returned in request order; IDs that match nothing in your organization are listed under `notFound` rather than failing the request. This is a read-only operation: it requires the `read:usage` scope and is not available to customer API keys.
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
await client.signals.getSignalsByIds({
    ids: ["6890b0e2a6f2c30012f0a1b3", "6890b0e2a6f2c30012f0a1b4"]
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

**request:** `Paid.SignalLookupRequest` 
    
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

Create multiple signals (usage events) in a single request. Each signal names its customer (`customerId` or `externalCustomerId`; an alias of the customer resolves too), its customer unit (`externalCustomerUnitId`: the unit's key, or an alias that points at a unit), or both, plus an optional product attribution (`productId` or `externalProductId`). A unit alone derives the customer from the unit. A unit sent with a customer must belong to it, else the batch is refused with `400 CUSTOMER_UNIT_MISMATCH`. A unit is never named by Paid's unit id. A key or alias that matches nothing is stored without a customer, keeping the id, so it can be pointed at a unit later. An identifier is matched as a unit key first, then a customer external id, then an alias. Unit attribution is enabled per organization: where it is not, a `customerUnit` sent next to a `customer` is accepted and ignored rather than checked, as before, while a unit named alone still derives its customer. Authenticate with your organization API key, or with a customer API key (prefixed `paid_ck_live_` or `paid_ck_test_`, created with `POST /api/v2/customers/{id}/api-keys`) so a customer's own runtime can report its usage without holding your organization key. A customer API key can call this endpoint only, and only for its own customer: if any signal names another customer, or one Paid does not know, the whole batch is refused with `403` `CUSTOMER_MISMATCH` and nothing is stored. Its idempotency keys are scoped to that customer. See [Send signals with a customer API key](/documentation/signals/send-signals-with-a-customer-api-key).
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
            eventName: "email_sent",
            customer: {
                externalCustomerId: "acme-corp"
            },
            attribution: {
                externalProductId: "email-agent"
            },
            timestamp: "2026-01-31T23:00:00Z",
            data: {
                "recipients": 3
            },
            idempotencyKey: "email_sent_msg_8f3a2c"
        }, {
            eventName: "email_sent",
            customerUnit: {
                externalCustomerUnitId: "acme-marketing"
            },
            idempotencyKey: "email_sent_msg_9b41d7"
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

<details><summary><code>client.signals.<a href="/src/api/resources/signals/client/Client.ts">createSignalSummaryExport</a>({ ...params }) -> Paid.SignalSummaryExport</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Produces a usage summary file: one row per customer per month, with columns broken down by the signal payload fields you name. Choose `format` to get JSON or a wide CSV; JSON is the default. The export runs in the background, so this returns immediately with a pending export and the file appears on it once it succeeds. Give `spec` to describe the columns, or `copyFrom` with an earlier export's id to reuse that export's columns over a new window. The spec is stored on the export, so an old file can always be explained by the export that produced it. Signals are bucketed by month in UTC on their effective timestamp, the same basis billing uses, so the totals reconcile with invoices. One export runs per organization at a time.
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
await client.signals.createSignalSummaryExport({
    spec: {
        name: "Monthly workflow usage",
        signalNames: [{
                name: "workflow_run",
                group: "Workflow runs",
                slug: "runs"
            }],
        dimensions: [{
                kind: "bands",
                path: "steps",
                appliesTo: ["workflow_run"],
                brackets: [{
                        from: 1,
                        upTo: 10,
                        slug: "1_10_steps",
                        group: "1-10 steps"
                    }, {
                        upTo: null,
                        slug: "11_plus_steps",
                        group: "11+ steps"
                    }]
            }],
        measures: [{
                fn: "count"
            }]
    },
    from: "2026-01-01",
    to: "2026-04-01",
    format: "csv"
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

**request:** `Paid.CreateSignalSummaryExportRequest` 
    
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

<details><summary><code>client.signals.<a href="/src/api/resources/signals/client/Client.ts">getSignalSummaryExport</a>({ ...params }) -> Paid.SignalSummaryExport</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns one export with its status and the shape it ran. While it is succeeded and unexpired, each read issues a fresh short-lived download link.
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
await client.signals.getSignalSummaryExport({
    id: "sse_5pZa1Kd8Nqx"
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

**request:** `Paid.GetSignalSummaryExportRequest` 
    
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

<details><summary><code>client.signals.<a href="/src/api/resources/signals/client/Client.ts">getSignalSummary</a>({ ...params }) -> Paid.SignalSummaryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Counts signals into period buckets. Use it to chart signal volume over time, split by signal name or by a signal-payload key such as team_id.

Signals count against their effective timestamp in UTC. This is the same basis billing uses, so these figures reconcile with an invoice.

The endpoint reads a pre-aggregated hourly rollup, not the raw signals. An hour is therefore the finest interval. One request may span at most 250 periods.

A grouped request keeps the 100 groups with the most signals. It sums the rest under the key "other". Each period total stays complete, but a group inside "other" loses its own figure. Read groups.truncated to learn how many groups lost it. Zero means every group kept its own figure.

Results are paged with limit and cursor. A page is never truncated in silence.

To download the series as a file, call this endpoint over HTTP with format=csv. It returns the same points as a text/csv table with a single header row. A CSV cannot carry a cursor, so a result that does not fit one page returns 400 rather than a file that is missing rows.

For a wide per-customer spreadsheet over arbitrary payload fields, use the batch export at /signals/summary/batch instead.
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
await client.signals.getSignalSummary({
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    interval: "day",
    groupBy: "signalName",
    limit: 1000
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

**request:** `Paid.GetSignalSummaryRequest` 
    
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

## credits
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

<details><summary><code>client.credits.<a href="/src/api/resources/credits/client/Client.ts">getCreditTransactionSummary</a>({ ...params }) -> Paid.CreditTransactionSummaryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Aggregate credit ledger transactions of one type into period buckets grouped by a dimension, for charting credit consumption over time. Accepts the same filters as the transaction list and reads the same ledger, so bucket totals always match summing that list over the same filters and the same `type` — pass this endpoint's effective `type` (it defaults to `spend`) to the list, which has no default and otherwise returns every type.
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
await client.credits.getCreditTransactionSummary({
    createdAtFrom: "createdAtFrom",
    groupBy: "eventName",
    interval: "day"
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

**request:** `Paid.GetCreditTransactionSummaryRequest` 
    
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

## checkouts
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

Archive a checkout by ID so it can no longer be paid. A completed (paid) checkout can't be archived and returns 409.
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

## customer-portals
<details><summary><code>client.customerPortals.<a href="/src/api/resources/customerPortals/client/Client.ts">createCustomerPortal</a>({ ...params }) -> Paid.CustomerPortal</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deprecated — the customer portal is being retired, and this endpoint will be removed in a future release. It keeps working for existing integrations meanwhile: it creates a portal session for the customer and returns a short-lived URL to the customer portal. Contact Paid before building anything new on it.
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

## value-receipts
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

Deprecated — use POST /value-receipts. Returns the receipt this customer already has for the date range (200), and creates one only if there is none (201), so calling twice does not give the customer two receipts. A receipt does not change after it is created, so a repeated call reports the same figures. Create a new receipt to report the period again with newer data.
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

Deprecated. A value receipt is immutable from creation, so it cannot be re-populated. A receipt you own answers 409, and one that does not exist or belongs to another organization answers 404. To get current data, create a new receipt for the period with `POST /value-receipts`.
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

Deprecated. A value receipt is immutable from creation, so it is already sealed and this call has nothing to do. It answers 200 for any receipt the organization owns.
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

Restore an archived value receipt. A receipt with no content, or one that failed to build, stays archived and answers 409. So does one whose period another value receipt now covers.
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

Make a value receipt publicly accessible via URL. An archived receipt is rejected with 409 — unarchive it first. So is one with no content, which has nothing to show.
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

## delivered-value
<details><summary><code>client.deliveredValue.<a href="/src/api/resources/deliveredValue/client/Client.ts">getDeliveredValue</a>({ ...params }) -> Paid.DeliveredValueResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the value delivered to a customer over a period, computed live from your active value model on every call — per value metric: its definition, a display-ready calculation, the measured unit total, monetary total, and signal counts, plus a per-event signal breakdown. The same data a value receipt presents, without creating one — built for value dashboards and reporting. Figures always reflect the currently active value model. Shortly after you publish a model change, totals can still be priced under the previous model's rates.
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
await client.deliveredValue.getDeliveredValue({
    externalCustomerId: "acme-corp",
    startDate: "2026-08-01",
    endDate: "2026-08-31"
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

**request:** `Paid.GetDeliveredValueRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DeliveredValue.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.deliveredValue.<a href="/src/api/resources/deliveredValue/client/Client.ts">getDeliveredValueSummary</a>({ ...params }) -> Paid.DeliveredValueSummaryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Aggregates delivered value into period buckets for charting value over time, grouped by value metric, by a signal-payload key (for example, value delivered per team_id), or by the formula condition band that priced each row (for example, value delivered per workflow complexity). Any grouping can be narrowed to a single value metric, which is also what lets a dimension grouping state a unit total. Reads the same rows as GET /delivered-value, so summing every bucket's monetaryTotal matches that endpoint's total for the same customer and window. Figures always reflect the currently active value model. Shortly after you publish a model change, totals can still be priced under the previous model's rates. Grouping by band reads a figure recorded when the row was priced, so value delivered before this grouping existed reports under the "none" band until a value-model backfill re-derives it.
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
await client.deliveredValue.getDeliveredValueSummary({
    externalCustomerId: "acme-corp",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    groupBy: "valueMetric",
    interval: "month"
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

**request:** `Paid.GetDeliveredValueSummaryRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DeliveredValue.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## webhooks
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
    webhookName: "billing-invoice-paid"
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
    webhookName: "billing-invoice-paid"
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

## pricing
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

## costs
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

## analytics
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

Limits: 30 seconds of execution time and 10,000 result rows (truncation is flagged via `meta.truncated`). Queries exceeding the 4 GB memory allowance return HTTP 422 with code `QUERY_MEMORY_LIMIT_EXCEEDED`. Prefer aggregates and a `created_at` date filter on large tables — this endpoint is for interactive analytics, not bulk export.
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

Lists the JSON paths (and their observed types) present in the `data` payload of your signals within a time window (default: last 30 days), grouped by signal name. Use the returned paths in queries against `fact_signal`, e.g. `WHERE data.<path>::String = '...'`. Keys declared as grouping dimensions are marked `declared` with their `slot` and listed first. Where available, each path also carries `firstSeen`, `lastSeen` and a `signals` count; these span all time, and the window only selects which paths and types are returned.
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

## custom-views-experimental
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

Returns the view's name, status, query ids, and the author render bundle for the owning organization. Only PUBLISHED views are returned; a DRAFT returns 404 (use getCustomViewAuthoring to read a DRAFT). Used by the trusted preview/embed frame to render the sandbox; the per-customer data is fetched separately via /:displayId/data.
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

Partially updates a view. Omitted fields are left unchanged. For REVISIONS, prefer the incremental fields — `bundleEdits` (exact search-and-replace on the stored render bundle) and `queryUpserts`/`queryRemovals` (per-query changes) — so you transmit only what changed instead of re-sending the whole payload. The full-replacement fields remain for rewrites: `renderBundle`, and `queries` (a FULL replacement of the query list — never drop queries the user didn't ask to remove). Replacement and incremental forms of the same aspect cannot be combined. The resulting SQL and bundle pass the same validation as createCustomView (SELECT-only, size cap, self-contained, paid:data listener). Works on DRAFT or PUBLISHED views — published embeds pick the change up on their next load. If the queries or hierarchy setting change during validation, returns 409 CUSTOM_VIEW_UPDATE_CONFLICT; fetch the current authoring definition and reapply your changes before retrying.
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

<details><summary><code>client.customViewsExperimental.<a href="/src/api/resources/customViewsExperimental/client/Client.ts">getCustomViewCustomerUnits</a>({ ...params }) -> Paid.ViewCustomerUnitsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

⚠️ **Experimental** — this endpoint may change or be removed without notice and is not subject to v2 backwards-compatibility guarantees. Do not build production-critical integrations against it yet.

Lists active customer units for a published customer-scoped view with hierarchyEnabled set to true. Hierarchy eligibility is independent of the requested page or usage; requires credit hierarchies to be enabled for the organization.
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
await client.customViewsExperimental.getCustomViewCustomerUnits({
    displayId: "displayId",
    customerId: "cus_acme"
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

**request:** `Paid.GetCustomViewCustomerUnitsRequest` 
    
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

Runs every stored query of the view on the read-only analytics database and returns the result sets keyed by query id. For a customer-scoped view (the default), the query is scoped to the caller's organization AND the given `customerId` (both enforced as ClickHouse row filters) — `customerId` is required. For an organization-scoped view, the data is org-wide (scoped only to the caller's organization) and `customerId` is ignored. The scope is enforced by the database — it cannot be widened by the stored SQL. If the view declares filters, pass per-request values as `filter_<name>` query parameters (e.g. `filter_region=eu`); undeclared names or disallowed values are rejected with 400. Filters narrow data within the scope — never widen it. Only PUBLISHED views are served by default; a DRAFT returns 404. To check a saved DRAFT's real data before publishing, pass `includeDraft=true`. Embeds and share links never serve a DRAFT.
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

## value-models
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

Uploads a new value model version. Validates the content, creates a new version, archives the previous active version, and syncs to ClickHouse. This updates how value is calculated going forward — new signals are valued under the new model. It does NOT re-rate historical signals; run POST /api/v2/value-models/backfill to re-rate history as a separate, explicit action. Any unpublished draft saved in the Paid app is discarded. Send expectedActiveVersion to get a 409 instead of overwriting a version published since you read it.
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

Manually triggers a recalculation of all ClickHouse rows against the current value model. Returns 422 when the backfill would scan more signals than the ceiling allows — that is deterministic, so retrying without narrowing the scope will not help.
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

## value-metrics
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

Adds one value metric — its unit, formula, signal binding and optional monetary conversion — to the value model. The signal must already exist: an event name your organization has sent, or one referenced by usage pricing on an active product. Publishes a new value model version that values NEW signals going forward; it does NOT recalculate historical delivered value. Re-rating history is a separate, explicit action (POST /api/v2/value-models/backfill).
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

## payment-methods
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

## payments
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

## payment-allocations
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

Allocates a payment across one or more invoice lines of posted invoices, in the payment's currency. When an invoice becomes fully paid, its credit entitlements are processed. Returns 409 when a concurrent allocation has already spent the balance.
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

## amendments
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

## analytics-experimental
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

Limits: 30 seconds of execution time and 10,000 result rows (truncation is flagged via `meta.truncated`). Queries exceeding the 4 GB memory allowance return HTTP 422 with code `QUERY_MEMORY_LIMIT_EXCEEDED`. Prefer aggregates and a `created_at` date filter on large tables — this endpoint is for interactive analytics, not bulk export.
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

Lists the JSON paths (and their observed types) present in the `data` payload of your signals within a time window (default: last 30 days), grouped by signal name. Use the returned paths in queries against `fact_signal`, e.g. `WHERE data.<path>::String = '...'`. Keys declared as grouping dimensions are marked `declared` with their `slot` and listed first. Where available, each path also carries `firstSeen`, `lastSeen` and a `signals` count; these span all time, and the window only selects which paths and types are returned.
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
