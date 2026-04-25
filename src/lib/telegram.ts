/**
 * Telegram Bot API helpers
 * Uses fetch API to communicate with Telegram Bot API
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

if (!TELEGRAM_BOT_TOKEN) {
  console.warn('⚠️ TELEGRAM_BOT_TOKEN not configured in environment variables');
}

/**
 * Send a message to Telegram user
 * @param chatId - Telegram chat ID (destination)
 * @param text - Message text
 * @param parseMode - 'HTML', 'Markdown', or undefined (default: plain text)
 */
export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  parseMode?: 'HTML' | 'Markdown'
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      throw new Error('Telegram bot token not configured');
    }

    if (!chatId || !text) {
      throw new Error('Missing required parameters: chatId, text');
    }

    const url = `${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        ...(parseMode && { parse_mode: parseMode }),
      }),
    });

    const data = (await response.json()) as {
      ok?: boolean;
      result?: { message_id: number };
      description?: string;
    };

    if (!data.ok) {
      throw new Error(data.description || 'Unknown Telegram API error');
    }

    return {
      success: true,
      messageId: data.result?.message_id.toString(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to send Telegram message:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Parse /sms command from message text
 * Format: /sms +39123456789 Message text here
 * @param text - Raw message text from Telegram
 * @returns Parsed command object or null if invalid
 */
export function parseSmsCommand(text: string): {
  phone?: string;
  message?: string;
  error?: string;
} | null {
  // Regex pattern: /sms [space] [phone] [space] [message]
  const pattern = /^\/sms\s+(\+?[\d\s\-()]+)\s+(.+)$/i;
  const match = text.match(pattern);

  if (!match) {
    return null;
  }

  const phone = match[1]?.trim() || '';
  const message = match[2]?.trim() || '';

  if (!phone || !message) {
    return {
      error: 'Invalid format. Use: /sms [phone] [message]',
    };
  }

  return {
    phone,
    message,
  };
}

/**
 * Format SMS status message for Telegram
 */
export function formatSmsStatusMessage(status: 'success' | 'error', details: {
  phone?: string;
  messageId?: string;
  error?: string;
  characterCount?: number;
}): string {
  if (status === 'success') {
    return `✅ SMS inviato con successo!\n\n📱 Destinatario: ${details.phone}\n📊 Caratteri: ${details.characterCount}\n🔖 ID: ${details.messageId?.slice(0, 8)}...`;
  }

  return `❌ Errore nell'invio SMS\n\n📱 Destinatario: ${details.phone}\n⚠️ Errore: ${details.error}`;
}

/**
 * Verify Telegram webhook authenticity
 * Checks if request came from official Telegram servers
 * @param secretToken - Value from X-Telegram-Bot-Api-Secret-Token header
 * @returns true if token matches configured secret
 */
export function verifyTelegramWebhook(secretToken: string | null): boolean {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

  // If no secret configured, skip verification
  if (!expectedSecret) {
    return true;
  }

  return secretToken === expectedSecret;
}

/**
 * Check if user is authorized to use the bot
 * @param chatId - Telegram chat ID from update
 * @returns true if authorized
 */
export function isAuthorizedUser(chatId: number): boolean {
  const authorizedChatId = process.env.TELEGRAM_AUTHORIZED_CHAT_ID;

  if (!authorizedChatId) {
    console.warn('⚠️ TELEGRAM_AUTHORIZED_CHAT_ID not configured - all users will be authorized');
    return true;
  }

  return chatId.toString() === authorizedChatId;
}

/**
 * Get help text for Telegram bot
 */
export function getHelpText(): string {
  return `🤖 *Masseria Sant'Elmo - Telecomando*

*Comandi disponibili:*

/sms [numero] [messaggio]
Invia un SMS a un numero di telefono

Esempio:
\`/sms +393737902538 Ciao! Confermiamo per domani?\`

/help
Mostra questo messaggio

*Attenzione:* Solo gli utenti autorizzati possono usare questo bot.`;
}
