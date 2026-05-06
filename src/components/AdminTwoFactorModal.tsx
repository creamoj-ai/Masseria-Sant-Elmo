'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface AdminTwoFactorModalProps {
  userEmail: string;
  phoneNumber?: string;
  onTwoFAVerified: () => void;
}

export function AdminTwoFactorModal({ userEmail, phoneNumber, onTwoFAVerified }: AdminTwoFactorModalProps) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'sending' | 'verifying'>('sending');

  // Send OTP via SMS
  const handleSendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, phone: phoneNumber }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to send OTP');
        toast.error('Errore invio codice OTP');
        return;
      }

      toast.success('✓ Codice OTP inviato');
      setStep('verifying');
    } catch (err) {
      console.error('❌ Send OTP error:', err);
      setError('Errore durante invio codice');
      toast.error('Errore durante invio codice');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'OTP non valido');
        toast.error('Codice OTP non valido');
        return;
      }

      toast.success('✓ 2FA confermato!');
      onTwoFAVerified();
    } catch (err) {
      console.error('❌ OTP verification error:', err);
      setError('Errore durante verifica');
      toast.error('Errore durante verifica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-light text-gray-900 mb-2">Autenticazione 2FA 🔒</h2>
        <p className="text-gray-600 text-sm mb-6">
          Verifica il tuo identità tramite codice OTP inviato via SMS
        </p>

        {step === 'sending' ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Riceverai un codice a 6 cifre su: <strong>{phoneNumber}</strong>
            </p>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? '⏳ Invio in corso...' : 'Invia Codice OTP'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Codice OTP (6 cifre)
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                  setError('');
                }}
                placeholder="000000"
                maxLength={6}
                required
                disabled={loading}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? '⏳ Verifica in corso...' : 'Verifica Codice'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('sending');
                setOtp('');
              }}
              className="w-full text-sm text-gray-600 hover:text-gray-900"
            >
              Non hai ricevuto il codice? Reinvia
            </button>
          </form>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          Il codice scade dopo 10 minuti. Massimo 3 tentativi.
        </p>
      </div>
    </div>
  );
}
