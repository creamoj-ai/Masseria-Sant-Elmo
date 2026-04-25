# Masseria Sant Elmo - Next Steps (Prompt 2 + 3)

## 📋 Status
- ✅ Repo clonato e sincronizzato
- ✅ Memory file aggiornato: `C:\Users\itjob\.claude\projects\C--Users-itjob\memory\masseria-sant-elmo.md`
- ✅ Telegram webhook base completato (Prompt 1)
- ⏳ **Prossimo**: Implementare Prompt 2 + Prompt 3

---

## 🎯 Prompt 2: Il "Cervello" CRM (Integrazione Supabase)

### Comando
```
/avvisa @nome_cliente [messaggio]
/avvisa @fornitore [messaggio]
```

### Implementazione Required
1. **Database**: Aggiungere colonne a tabella `clients`
   - `slug` (VARCHAR 255 UNIQUE) - per fast lookup (es: mario-rossi, caffetteria-leopardi)
   - `tipo` (VARCHAR 50) - cliente | fornitore | altro

2. **Handler nel Telegram webhook**
   - Parse comando: `/avvisa @nome [messaggio]`
   - Lookup in `clients` per slug/nome
   - Recupera `phone` number
   - Chiama `sendSMS(phone, message)`
   - Log in `communication_log`

3. **Error Handling**
   - Nome non trovato → messaggio Telegram
   - SMS fallito → log e notifica

### Files da Modificare
- `src/lib/telegram.ts` - Aggiungere `parseAvvisaCommand()`
- `src/app/api/telegram/webhook/route.ts` - Aggiungere handler per `/avvisa`
- `supabase-schema.sql` - Aggiungere colonne a `clients`

---

## 💳 Prompt 3: Il Flusso di Pagamento (Stripe + SMS)

### Comando
```
/pagamento @cliente [importo] [descrizione]
```

### Implementazione Required
1. **Database**: Creare tabella `logs_pagamenti`
   - id, contact_id, importo, descrizione
   - stripe_payment_link (URL)
   - status_pagamento
   - timestamp_creazione, timestamp_pagamento
   - stripe_session_id

2. **Handler nel Telegram webhook**
   - Parse comando: `/pagamento @nome [importo] [descrizione]`
   - Lookup cliente in `clients`
   - Genera Stripe Payment Link
   - Componi SMS: "Masseria Sant Elmo: Ciao [Nome], ecco il link per il pagamento di [descrizione] di €[importo]: [URL_STRIPE]"
   - Chiama `sendSMS(phone, message)`
   - Log in `logs_pagamenti`

3. **Stripe Integration**
   - Libreria: già installato `stripe` npm package
   - Creare funzione `generatePaymentLink(amount, description, metadata)`
   - Webhook per conferma pagamento

### Files da Modificare
- `src/lib/stripe.ts` - NUOVO FILE: `generatePaymentLink()`, `handlePaymentWebhook()`
- `src/lib/telegram.ts` - Aggiungere `parsePagamentoCommand()`
- `src/app/api/telegram/webhook/route.ts` - Aggiungere handler per `/pagamento`
- `src/app/api/stripe/webhook.ts` - NUOVO FILE: webhook handler
- `supabase-schema.sql` - Aggiungere tabella `logs_pagamenti`

---

## 🔐 Environment Variables (Vercel)

```
# Telegram
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_WEBHOOK_SECRET=xxx
TELEGRAM_AUTHORIZED_CHAT_ID=xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Twilio SMS
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+39xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## 📋 Deployment Checklist

- [ ] Run SQL migration: Add `slug` e `tipo` colonne a `clients`
- [ ] Run SQL migration: Creare tabella `logs_pagamenti`
- [ ] Implementare `/avvisa` handler in webhook
- [ ] Implementare `/pagamento` handler in webhook
- [ ] Test locale: `npm run dev`
- [ ] Push to GitHub
- [ ] Vercel redeploy
- [ ] Test Telegram bot con comandi reali
- [ ] Setup Stripe webhook in production

---

## 🚀 Next Chat
**Goal**: Implementare completamente Prompt 2 + 3, testare end-to-end, deploy live.

**Token Budget**: Salvato per nuova sessione! 🎉
