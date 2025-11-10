export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface CustomerData {
  externalId: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  billingAddress?: Address;
  metadata?: Record<string, any>;
}

export interface CompleteCustomerData {
  externalId: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  billingAddress: Required<Address>;
  metadata: Record<string, any>;
}

export interface ContactData {
  customerExternalId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  billingAddress?: Address;
  salutation?: "Mr" | "Mrs" | "Ms" | "Dr" | "Prof";
}

export interface OrderConfig {
  customerId: string;
  customerExternalId: string;
  billingContactId?: string;
  agentExternalId: string;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  currency?: string;
  orderLines?: OrderLineConfig[];
}

export interface OrderLineConfig {
  agentExternalId: string;
  name?: string;
  description?: string;
}

/**
 * Note: orderLines is not required because if agentExternalId is provided,
 * order lines can be derived from that agent.
 */
export interface CompleteOrderConfig {
  customerId: string;
  customerExternalId: string;
  billingContactId?: string;
  agentExternalId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  currency: string;
  orderLines: OrderLineConfig[];
}

export interface OrderOptions {
  /**
   * Whether to auto-activate orders after creation
   * @default true
   */
  autoActivate?: boolean;

  /**
   * Duration in days for order end date (if not specified)
   * @default 365
   */
  defaultDurationDays?: number;
}

export interface CustomerCreationResult {
  id: string;
  externalId: string;
}

export interface ContactCreationResult {
  id: string;
}

export interface OrderCreationResult {
  id: string;
  creationState?: string;
}

export interface ProvisioningConfig {
  /**
   * Customer data (externalId required)
   */
  customer: CustomerData;

  /**
   * Contact data (optional, will use customer email if not provided)
   */
  contact?: Partial<ContactData>;

  /**
   * Agent external ID for order creation (optional)
   * If not provided, no order will be created
   */
  agentExternalId?: string;

  /**
   * Options for order creation
   */
  orderOptions?: OrderOptions;
}

export interface ProvisioningResult {
  customer: CustomerCreationResult;
  contact: ContactCreationResult;
  order?: OrderCreationResult;
}

