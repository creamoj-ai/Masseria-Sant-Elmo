import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromPhone) {
  console.warn('⚠️ Twilio credentials not configured in environment variables');
}

// Lazy initialization to avoid errors at build time
let client: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!client && accountSid && authToken) {
    try {
      client = twilio(accountSid, authToken);
    } catch (error) {
      console.error('Failed to initialize Twilio client:', error);
      return null;
    }
  }
  return client;
}

/**
 * Normalize phone number to E.164 format (+39123456789)
 * Accepts formats like: 3737902538, +393737902538, 00393737902538, +39 373 790 2538
 */
export function normalizePhoneNumber(phone: string): string {
  // Remove all whitespace and special chars except digits and +
  let cleaned = phone.replace(/[\s\-()]/g, '');

  // Handle Italian numbers (common case)
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.substring(2);
  } else if (!cleaned.startsWith('+') && cleaned.length === 10) {
    // 10-digit Italian number without country code (3737902538)
    cleaned = '+39' + cleaned;
  } else if (!cleaned.startsWith('+') && cleaned.length === 11 && cleaned.startsWith('3')) {
    // 11-digit Italian number without +39 (393737902538)
    cleaned = '+39' + cleaned.substring(1);
  }

  return cleaned;
}

/**
 * Validate phone number format (basic E.164 check)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  // E.164 format: +[1-9]{1,15} digits
  return /^\+[1-9]\d{1,14}$/.test(normalized);
}

/**
 * Send SMS via Twilio
 * @param to - Recipient phone number (will be normalized)
 * @param body - Message text (max 160 characters)
 * @returns Object with success status and message/error details
 */
export async function sendSMS(to: string, body: string): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: string;
}> {
  try {
    // Get Twilio client (lazy initialization)
    const twilioClient = getTwilioClient();
    if (!twilioClient) {
      throw new Error('Twilio client not initialized - missing credentials');
    }

    // Validate inputs
    if (!to || !body) {
      throw new Error('Missing required parameters: to, body');
    }

    // Normalize and validate phone number
    const normalizedTo = normalizePhoneNumber(to);
    if (!isValidPhoneNumber(normalizedTo)) {
      throw new Error(`Invalid phone number format: ${to}`);
    }

    // Validate message length (SMS has 160 char limit for single messages)
    if (body.length > 160) {
      console.warn(`⚠️ Message exceeds 160 characters (${body.length}). Will be split into multiple SMS.`);
    }

    // Send SMS
    const message = await twilioClient.messages.create({
      body: body.substring(0, 160), // Twilio will handle longer messages
      from: fromPhone!,
      to: normalizedTo,
    });

    console.log(`✅ SMS sent successfully. SID: ${message.sid}`);

    return {
      success: true,
      messageId: message.sid,
      cost: message.price ? `${Math.abs(parseFloat(message.price))} ${message.priceUnit}` : 'Unknown',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to send SMS:', errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verify Twilio credentials are configured
 */
export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && fromPhone);
}
