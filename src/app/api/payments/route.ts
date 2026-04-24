import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking_id, amount, email, event_type } = body;

    // Validate booking exists
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, events(*)')
      .eq('id', booking_id)
      .single();

    if (!booking) {
      return NextResponse.json(
        { error: 'Prenotazione non trovata' },
        { status: 404 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in cents
      currency: 'eur',
      metadata: {
        booking_id,
        event_type,
        client_email: email,
      },
      receipt_email: email,
    });

    // Save payment record
    await supabase.from('payments').insert({
      booking_id,
      stripe_payment_intent_id: paymentIntent.id,
      amount,
      status: 'pending',
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Errore nella creazione del pagamento' },
      { status: 500 }
    );
  }
}
