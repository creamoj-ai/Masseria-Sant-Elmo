/**
 * Stripe Integration for Payment Links
 * Generates payment links for direct payment from SMS/Telegram
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_API_URL = 'https://api.stripe.com/v1';

if (!STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY not configured in environment variables');
}

/**
 * Check if Stripe is properly configured
 */
export function isStripeConfigured(): boolean {
  return !!STRIPE_SECRET_KEY;
}

/**
 * Generate a Stripe Payment Link for direct payments
 * @param amount - Amount in EUR (e.g., 150 = €150.00)
 * @param description - Payment description (e.g., "Soggiorno")
 * @param clientMetadata - Optional metadata to attach (client_id, name, etc.)
 * @returns Payment link object with URL or error
 */
export async function generatePaymentLink(
  amount: number,
  description: string,
  clientMetadata?: { client_id?: string; client_name?: string; slug?: string }
): Promise<{
  success: boolean;
  url?: string;
  paymentIntentId?: string;
  error?: string;
}> {
  try {
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe API key not configured');
    }

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount: must be greater than 0');
    }

    if (!description || description.trim() === '') {
      throw new Error('Description is required');
    }

    // Convert amount to cents (Stripe uses cents)
    const amountCents = Math.round(amount * 100);

    // Prepare payment link request
    const params = new URLSearchParams();
    params.append('line_items[0][price_data][currency]', 'eur');
    params.append('line_items[0][price_data][product_data][name]', description);
    params.append('line_items[0][price_data][unit_amount]', amountCents.toString());
    params.append('line_items[0][quantity]', '1');

    // Add metadata if provided
    if (clientMetadata?.client_id) {
      params.append('metadata[client_id]', clientMetadata.client_id);
    }
    if (clientMetadata?.client_name) {
      params.append('metadata[client_name]', clientMetadata.client_name);
    }
    if (clientMetadata?.slug) {
      params.append('metadata[slug]', clientMetadata.slug);
    }

    // Make request to Stripe
    const response = await fetch(`${STRIPE_API_URL}/payment_links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = (await response.json()) as {
      id?: string;
      url?: string;
      error?: { message: string };
      message?: string;
    };

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || data.message || 'Unknown Stripe error';
      throw new Error(errorMsg);
    }

    if (!data.url) {
      throw new Error('No payment URL returned from Stripe');
    }

    return {
      success: true,
      url: data.url,
      paymentIntentId: data.id,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to generate Stripe payment link:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Format payment notification message for SMS
 * @param clientName - Client name (optional)
 * @param amount - Amount in EUR
 * @param description - Payment description
 * @param paymentUrl - Stripe payment link URL
 */
export function formatPaymentSMS(
  clientName: string | undefined,
  amount: number,
  description: string,
  paymentUrl: string
): string {
  const greeting = clientName ? `Ciao ${clientName},` : 'Ciao,';
  return `${greeting}\n\nPagamento di €${amount.toFixed(2)} per ${description}\n\n${paymentUrl}`;
}
