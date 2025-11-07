/**
 * Shared types for Paid SDK integrations
 * These types provide simplified interfaces for common operations
 */

import type { PaidClient } from "../Client.js";

/**
 * Address information for customers and contacts
 */
export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

/**
 * Customer data with optional fields
 */
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

/**
 * Complete customer data with all required fields (after defaults applied)
 */
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

/**
 * Contact data with optional fields
 */
export interface ContactData {
  customerExternalId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  billingAddress?: Address;
  salutation?: "Mr" | "Mrs" | "Ms" | "Dr" | "Prof";
}

/**
 * Order configuration with optional fields
 */
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

/**
 * Order line configuration
 */
export interface OrderLineConfig {
  agentExternalId: string;
  name?: string;
  description?: string;
}

/**
 * Complete order configuration with all required fields (after defaults applied)
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
  orderLines: Required<OrderLineConfig>[];
}

/**
 * Options for helper functions
 */
export interface HelperOptions {
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

/**
 * Result from customer creation
 */
export interface CustomerCreationResult {
  id: string;
  externalId: string;
}

/**
 * Result from contact creation
 */
export interface ContactCreationResult {
  id: string;
}

/**
 * Result from order creation
 */
export interface OrderCreationResult {
  id: string;
  creationState?: string;
}
