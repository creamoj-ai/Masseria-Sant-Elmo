'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface AdminPasswordModalProps {
  userEmail: string;
  onPasswordVerified: () => void;
}

export function AdminPasswordModal({ userEmail, onPasswordVerified }: AdminPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Password incorretta');
        toast.error('Password non valida');
        return;
      }

      toast.success('Accesso admin confermato! 🔐');
      onPasswordVerified();
    } catch (err) {
      console.error('❌ Password verification error:', err);
      setError('Errore durante la verifica');
      toast.error('Errore durante la verifica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-2xl font-light text-gray-900 mb-2">Accesso Admin Protetto 🔐</h2>
        <p className="text-gray-600 text-sm mb-6">Inserisci la password admin per continuare</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Admin
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Inserisci password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                disabled={loading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                title={showPassword ? 'Nascondi' : 'Mostra'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? '⏳ Verifica in corso...' : 'Verifica Password'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Per motivi di sicurezza, gli accessi admin richiedono autenticazione a due fattori.
        </p>
      </div>
    </div>
  );
}
