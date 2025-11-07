/**
 * Invoice helpers for Paid SDK
 * Simplifies invoice payment and billing status operations
 */

export interface PayInvoiceConfig {
    apiUrl: string;
    apiKey: string;
    organizationId: string;
}

export interface BillingStatus {
    customerId: string;
    hasUnpaidInvoices: boolean;
    daysPastDue: number;
    totalOutstanding: number;
    unpaidInvoicesCount: number;
    totalInvoices: number;
    hasActiveOrders: boolean;
}

interface InvoiceData {
    paymentStatus: "pending" | "paid" | "overdue" | "partiallyPaid";
    dueDate: string;
    amountDue: number;
}

export interface PayInvoiceRequest {
    invoiceId: string;
    confirmationToken: string;
    returnUrl?: string;
}

export interface PayInvoiceResult {
    success: boolean;
    data?: any;
}

export interface CustomerInvoicesResult {
    data: any[];
}

/**
 * Pay an invoice with a payment confirmation token
 *
 * This helper processes payment for an existing invoice using a Stripe confirmation token.
 *
 * @param config - API configuration with organization context
 * @param request - Payment request details
 * @returns Payment result
 *
 * @example
 * ```typescript
 * const result = await payInvoice(
 *   {
 *     apiUrl: 'https://api.agentpaid.io',
 *     apiKey: process.env.PAID_API_KEY,
 *     organizationId: 'org_123'
 *   },
 *   {
 *     invoiceId: 'inv_123',
 *     confirmationToken: 'pm_tok_xxx',
 *     returnUrl: 'https://example.com/thanks'
 *   }
 * );
 * ```
 */
export async function payInvoice(
    config: PayInvoiceConfig,
    request: PayInvoiceRequest
): Promise<PayInvoiceResult> {
    const { invoiceId, confirmationToken, returnUrl } = request;

    if (!invoiceId || !confirmationToken) {
        throw new Error("invoiceId and confirmationToken are required");
    }

    try {
        const response = await fetch(
            `${config.apiUrl}/api/organizations/${config.organizationId}/invoices/${invoiceId}/pay`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${config.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    confirmationToken,
                    ...(returnUrl && { returnUrl }),
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to pay invoice: ${errorText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error("Error paying invoice:", error);
        throw error;
    }
}

/**
 * Get customer invoices
 *
 * Fetches all invoices for a customer by their external ID.
 *
 * @param config - API configuration with organization context
 * @param customerExternalId - Customer's external ID
 * @returns Customer invoices
 *
 * @example
 * ```typescript
 * const result = await getCustomerInvoices(
 *   {
 *     apiUrl: 'https://api.agentpaid.io',
 *     apiKey: process.env.PAID_API_KEY,
 *     organizationId: 'org_123'
 *   },
 *   'user-123'
 * );
 *
 * console.log(`Found ${result.data.length} invoices`);
 * ```
 */
export async function getCustomerInvoices(
    config: PayInvoiceConfig,
    customerExternalId: string
): Promise<CustomerInvoicesResult> {
    if (!customerExternalId) {
        throw new Error("customerExternalId is required");
    }

    try {
        const url = `${config.apiUrl}/api/organizations/${config.organizationId}/customer/external/${customerExternalId}/invoices`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${config.apiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch customer invoices: ${errorText}`);
        }

        const data = await response.json();
        return { data: data.data || data || [] };
    } catch (error) {
        console.error("Error fetching customer invoices:", error);
        throw error;
    }
}
