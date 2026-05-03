import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendSMS, normalizePhoneNumber, isValidPhoneNumber, isTwilioConfigured } from '@/lib/twilio';
import {
  sendTelegramMessage,
  parseSmsCommand,
  parseAvvisaCommand,
  formatSmsStatusMessage,
  verifyTelegramWebhook,
  isAuthorizedUser,
  getHelpText,
} from '@/lib/telegram';

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Handle Telegram webhook updates
 * Telegram sends POST requests to this endpoint when users message the bot
 */
export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();
  try {
    // Verify Telegram webhook authenticity (optional but recommended)
    const telegramSecret = request.headers.get('x-telegram-bot-api-secret-token');
    if (!verifyTelegramWebhook(telegramSecret)) {
      console.warn('⚠️ Invalid Telegram webhook secret');
      return NextResponse.json({ ok: true }); // Still return 200 to prevent Telegram retries
    }

    // Parse webhook body
    const body = (await request.json()) as {
      update_id?: number;
      message?: {
        message_id: number;
        chat: { id: number; first_name?: string; last_name?: string; username?: string };
        text?: string;
        date: number;
      };
    };

    // Verify this is a message update
    if (!body.message?.text) {
      return NextResponse.json({ ok: true });
    }

    const message = body.message;
    const chatId = message.chat.id;
    const userText = message.text || '';

    console.log(`📨 Telegram message from ${chatId}: ${userText}`);

    // ============================================
    // SECURITY: Verify user is authorized
    // ============================================
    if (!isAuthorizedUser(chatId)) {
      console.warn(`⚠️ Unauthorized access attempt from chat ID: ${chatId}`);
      // Don't respond to unauthorized users (silent rejection)
      return NextResponse.json({ ok: true });
    }

    // ============================================
    // COMMAND HANDLING
    // ============================================

    // /help command
    if (userText === '/help' || userText === '/start') {
      const response = await sendTelegramMessage(chatId, getHelpText(), 'Markdown');
      if (!response.success) {
        console.error('Failed to send help message:', response.error);
      }
      return NextResponse.json({ ok: true });
    }

    // /sms command
    if (userText.startsWith('/sms ')) {
      return handleSmsCommand(chatId, userText, supabase);
    }

    // /avvisa command
    if (userText.startsWith('/avvisa ')) {
      return handleAvvisaCommand(chatId, userText, supabase);
    }


    // Unknown command - send help
    await sendTelegramMessage(chatId, 'Comando non riconosciuto. Digita /help per vedere i comandi disponibili.');

    return NextResponse.json({ ok: true });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Telegram webhook error:', errorMsg);

    // Always return 200 OK to Telegram (prevents webhook retries)
    return NextResponse.json({ ok: true });
  }
}

/**
 * Handle /sms command
 * Format: /sms +39123456789 Message text
 */
async function handleSmsCommand(chatId: number, userText: string, supabase: ReturnType<typeof getSupabaseClient>) {
  try {
    // Verify Twilio is configured
    if (!isTwilioConfigured()) {
      await sendTelegramMessage(
        chatId,
        '❌ Il servizio SMS non è configurato. Contatta l\'amministratore.'
      );
      return NextResponse.json({ ok: true });
    }

    // Parse command
    const parsed = parseSmsCommand(userText);
    if (!parsed || parsed.error) {
      await sendTelegramMessage(
        chatId,
        parsed?.error || '❌ Formato non valido.\n\nUso: `/sms +39123456789 Testo messaggio`',
        'Markdown'
      );
      return NextResponse.json({ ok: true });
    }

    const phone = parsed.phone!;
    const message = parsed.message!;

    // Validate phone number
    if (!isValidPhoneNumber(phone)) {
      await sendTelegramMessage(
        chatId,
        `❌ Numero di telefono non valido: ${phone}\n\nFormato richiesto: +39123456789 (internazionale)`
      );
      return NextResponse.json({ ok: true });
    }

    // Security: Whitelist only Italian numbers (+39) to prevent accidental international charges
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone.startsWith('+39')) {
      await sendTelegramMessage(
        chatId,
        '⚠️ Al momento sono consentiti solo numeri italiani (+39).\n\nContatta l\'amministratore per abilitare altri paesi.'
      );
      return NextResponse.json({ ok: true });
    }

    // Validate message length (SMS limit)
    if (message.length > 160) {
      await sendTelegramMessage(
        chatId,
        `⚠️ Messaggio troppo lungo (${message.length} caratteri).\n\nLimite SMS: 160 caratteri.\n\nMessaggio accorciato a 160 caratteri.`
      );
    }

    // ============================================
    // SEND SMS
    // ============================================
    const smsResult = await sendSMS(normalizedPhone, message);

    if (!smsResult.success) {
      // Log failed attempt
      try {
        await supabase.from('communication_log').insert({
          client_id: null,
          communication_type: 'sms',
          subject: 'Telegram Bot - Manual SMS',
          message: message,
          status: 'failed',
          metadata: {
            telegram_chat_id: chatId,
            recipient_phone: normalizedPhone,
            error: smsResult.error,
          },
        });
      } catch (logError) {
        console.error('Failed to log SMS error:', logError);
      }

      // Notify user
      const errorMsg = formatSmsStatusMessage('error', {
        phone: normalizedPhone,
        error: smsResult.error,
      });
      await sendTelegramMessage(chatId, errorMsg);
      return NextResponse.json({ ok: true });
    }

    // ============================================
    // LOG SUCCESSFUL SMS
    // ============================================
    try {
      // Try to find client by phone number
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', normalizedPhone)
        .single();

      await supabase.from('communication_log').insert({
        client_id: client?.id || null,
        communication_type: 'sms',
        subject: 'Telegram Bot - Manual SMS',
        message: message,
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata: {
          telegram_chat_id: chatId,
          recipient_phone: normalizedPhone,
          twilio_message_id: smsResult.messageId,
        },
      });
    } catch (logError) {
      console.error('Failed to log SMS success:', logError);
      // Don't fail the SMS send if logging fails
    }

    // ============================================
    // NOTIFY USER OF SUCCESS
    // ============================================
    const successMsg = formatSmsStatusMessage('success', {
      phone: normalizedPhone,
      messageId: smsResult.messageId,
      characterCount: message.length,
    });
    await sendTelegramMessage(chatId, successMsg);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ SMS command error:', errorMsg);

    // Notify user
    await sendTelegramMessage(chatId, '❌ Errore durante l\'invio SMS. Riprova più tardi.');

    // Always return 200 OK to Telegram
    return NextResponse.json({ ok: true });
  }
}

/**
 * Handle /avvisa command
 * Format: /avvisa @slug Message text
 */
async function handleAvvisaCommand(chatId: number, userText: string, supabase: ReturnType<typeof getSupabaseClient>) {
  try {
    // Verify Twilio is configured
    if (!isTwilioConfigured()) {
      await sendTelegramMessage(
        chatId,
        '❌ Il servizio SMS non è configurato. Contatta l\'amministratore.'
      );
      return NextResponse.json({ ok: true });
    }

    // Parse command
    const parsed = parseAvvisaCommand(userText);
    if (!parsed || parsed.error) {
      await sendTelegramMessage(
        chatId,
        parsed?.error || '❌ Formato non valido.\n\nUso: `/avvisa @slug Testo messaggio`',
        'Markdown'
      );
      return NextResponse.json({ ok: true });
    }

    const slug = parsed.slug!;
    const message = parsed.message!;

    // ============================================
    // LOOKUP CLIENT BY SLUG
    // ============================================
    const { data: client, error: lookupError } = await supabase
      .from('clients')
      .select('id, phone, name')
      .eq('slug', slug)
      .single();

    if (lookupError || !client) {
      await sendTelegramMessage(
        chatId,
        `❌ Cliente con slug "@${slug}" non trovato nel database.`
      );
      return NextResponse.json({ ok: true });
    }

    if (!client.phone) {
      await sendTelegramMessage(
        chatId,
        `⚠️ Cliente "@${slug}" non ha un numero di telefono registrato.`
      );
      return NextResponse.json({ ok: true });
    }

    // Validate message length (SMS limit)
    if (message.length > 160) {
      await sendTelegramMessage(
        chatId,
        `⚠️ Messaggio troppo lungo (${message.length} caratteri).\n\nLimite SMS: 160 caratteri.\n\nMessaggio accorciato a 160 caratteri.`
      );
    }

    // ============================================
    // SEND SMS
    // ============================================
    const smsResult = await sendSMS(client.phone, message);

    if (!smsResult.success) {
      // Log failed attempt
      try {
        await supabase.from('communication_log').insert({
          client_id: client.id,
          communication_type: 'sms',
          subject: `Telegram Bot - /avvisa @${slug}`,
          message: message,
          status: 'failed',
          metadata: {
            telegram_chat_id: chatId,
            recipient_phone: client.phone,
            error: smsResult.error,
          },
        });
      } catch (logError) {
        console.error('Failed to log SMS error:', logError);
      }

      // Notify user
      const errorMsg = formatSmsStatusMessage('error', {
        phone: client.phone,
        error: smsResult.error,
      });
      await sendTelegramMessage(chatId, errorMsg);
      return NextResponse.json({ ok: true });
    }

    // ============================================
    // LOG SUCCESSFUL SMS
    // ============================================
    try {
      await supabase.from('communication_log').insert({
        client_id: client.id,
        communication_type: 'sms',
        subject: `Telegram Bot - /avvisa @${slug}`,
        message: message,
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata: {
          telegram_chat_id: chatId,
          recipient_phone: client.phone,
          twilio_message_id: smsResult.messageId,
        },
      });
    } catch (logError) {
      console.error('Failed to log SMS success:', logError);
    }

    // ============================================
    // NOTIFY USER OF SUCCESS
    // ============================================
    const successMsg = `✅ SMS inviato con successo!\n\n👤 Cliente: ${client.name} (@${slug})\n📱 Numero: ${client.phone}\n📊 Caratteri: ${message.length}\n🔖 ID: ${smsResult.messageId?.slice(0, 8)}...`;
    await sendTelegramMessage(chatId, successMsg);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ /avvisa command error:', errorMsg);

    // Notify user
    await sendTelegramMessage(chatId, '❌ Errore durante l\'invio SMS. Riprova più tardi.');

    // Always return 200 OK to Telegram
    return NextResponse.json({ ok: true });
  }
}


/**
 * Handle GET requests (optional: for webhook setup validation)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'Telegram webhook is active',
    timestamp: new Date().toISOString(),
  });
}
