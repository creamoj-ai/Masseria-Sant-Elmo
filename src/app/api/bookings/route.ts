import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET(req: NextRequest) {
  try {
    console.log('📡 GET /api/bookings - Connecting to Supabase...');
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('bookings')
      .select('*, clients(*), events(*)')
      .order('created_at', { ascending: false })
      .timeout(5000); // 5 second timeout

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json({ error: error.message, bookings: [] }, { status: 500 });
    }

    console.log('✅ Bookings loaded:', data?.length || 0);
    return NextResponse.json({ bookings: data || [] });
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json({ error: String(error), bookings: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseClient();
  try {
    const body = await req.json();
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      event_type, 
      event_date, 
      guest_count,
      notes 
    } = body;

    // 1. Create/update client
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .upsert(
        {
          email,
          first_name,
          last_name,
          phone,
          event_type,
          notes: `Prenotazione iniziale: ${notes}`,
        },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (clientError) throw clientError;

    // 2. Create event
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .insert({
        client_id: clientData.id,
        event_name: `${event_type} - ${first_name} ${last_name}`,
        event_type,
        event_date,
        guest_count,
        status: 'pending',
      })
      .select()
      .single();

    if (eventError) throw eventError;

    // 3. Create booking
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        event_id: eventData.id,
        client_id: clientData.id,
        event_date,
        guest_count,
        booking_status: 'pending',
        deposit_required: 1000.00,
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 4. TODO: Send confirmation email
    console.log('Email to be sent:', email, first_name);

    // Generate user-friendly booking ID
    const userFriendlyId = `MASSERIA-${String(bookingData.id).padStart(6, '0')}`;

    return NextResponse.json({
      success: true,
      bookingId: userFriendlyId,
      booking_id: bookingData.id,
      client_id: clientData.id,
      message: 'Prenotazione creata con successo!',
    });
  } catch (error) {
    console.error('Booking error:', error);

    // Determine specific error message based on error type
    let errorMessage = 'Errore durante la creazione della prenotazione.';

    if (error instanceof Error) {
      if (error.message.includes('clients_email_key')) {
        errorMessage = 'Questa email è già registrata. Accedi o contattaci.';
      } else if (error.message.includes('clients')) {
        errorMessage = 'Errore nei dati cliente. Verifica i campi.';
      } else if (error.message.includes('events')) {
        errorMessage = 'Errore nella creazione dell\'evento.';
      } else if (error.message.includes('bookings')) {
        errorMessage = 'Errore nella creazione della prenotazione.';
      } else if (error.message.includes('PGRST')) {
        errorMessage = 'Errore di connessione al database.';
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        code: 'BOOKING_ERROR'
      },
      { status: 500 }
    );
  }
}
