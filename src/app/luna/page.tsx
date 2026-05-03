'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Luna() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'luna', content: 'Ciao! Sono LUNA, l\'assistente virtuale di Essenze di Natura. Come posso aiutarti a organizzare il tuo evento esclusivo? 💫' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate LUNA response
    setTimeout(() => {
      const responses: {[key: string]: string} = {
        'matrimonio': 'Per un matrimonio indimenticabile, offriamo pacchetti da €3.500 a €12.000+. Posso aiutarti a scegliere le opzioni giuste per il tuo grande giorno! 💍',
        'prezzo': 'I nostri prezzi partono da €1.500 e dipendono dal tipo di evento. Vuoi esplorare le diverse opzioni?',
        'data': 'Posso prenotare per te! Qual è la data desiderata? Lavoriamo da marzo a ottobre.',
        'ospiti': 'Possiamo ospitare fino a 400 persone. Quanti ospiti stai pianificando?',
        'default': 'Ottima domanda! Puoi contattare il nostro team per dettagli specifici: +39 373 790 2538'
      };

      let response = responses['default'];
      for (const [key, value] of Object.entries(responses)) {
        if (input.toLowerCase().includes(key)) {
          response = value;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'luna', content: response }]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-panna text-verde-salvia-dark flex flex-col">
      {/* HERO SECTION */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-verde-salvia/5 to-panna">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-7xl mb-6">✨</div>
          <h1 className="text-5xl md:text-6xl font-light leading-tight text-verde-salvia mb-6" style={{fontFamily: 'var(--font-playfair)'}}>
            Ciao, sono LUNA
          </h1>
          <p className="text-xl font-light text-verde-salvia-dark/70">
            Il tuo assistente virtuale per organizzare eventi straordinari
          </p>
        </div>
      </section>

      {/* CHAT SECTION */}
      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-panna">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 h-96 overflow-y-auto mb-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-6 py-3 rounded-lg font-light text-sm ${
                    msg.role === 'user'
                      ? 'bg-verde-salvia text-panna'
                      : 'bg-panna-dark/10 text-verde-salvia-dark border border-oro-vintage/30'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Dimmi come posso aiutarti... (es: matrimonio, prezzi, data)"
              className="flex-1 bg-white border border-verde-salvia/30 rounded-lg px-4 py-3 text-sm font-light focus:outline-none focus:border-verde-salvia transition"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-verde-salvia text-panna font-light text-sm hover:bg-verde-salvia-dark transition rounded-lg"
            >
              Invia
            </button>
          </form>

          <div className="mt-8 p-6 bg-panna-dark/5 rounded-lg">
            <p className="text-xs uppercase tracking-widest text-verde-salvia/60 font-light mb-4">Domande frequenti:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Quali sono i vostri prezzi?',
                'Che date sono disponibili?',
                'Quanti ospiti potete ospitare?',
                'Offrite servizi di catering?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q);
                    setMessages(prev => [...prev, { role: 'user', content: q }]);
                  }}
                  className="text-left p-3 bg-white border border-oro-vintage/30 rounded text-xs text-verde-salvia-dark font-light hover:border-oro-vintage/60 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA BACK */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 text-center bg-panna-dark/5">
        <Link href="/" className="text-sm font-light text-verde-salvia hover:text-oro-vintage transition">
          ← Torna alla home
        </Link>
      </section>
    </div>
  );
}
