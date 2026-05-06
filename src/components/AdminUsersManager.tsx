'use client';

import { useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
  password_hash?: boolean;
  twofa_enabled?: boolean;
}

interface AdminUsersManagerProps {
  userEmail?: string;
}

export function AdminUsersManager({ userEmail }: AdminUsersManagerProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordTargetEmail, setPasswordTargetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { 'x-user-email': userEmail || '' },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error('Load users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail || '',
        },
        body: JSON.stringify({ email: newEmail, role: newRole }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ User added successfully');
        setNewEmail('');
        setNewRole('admin');
        loadUsers();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Failed to add user');
      console.error('Add user error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveUser = async (email: string) => {
    if (!confirm(`Remove admin: ${email}?`)) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail || '',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('✅ User removed');
        loadUsers();
      } else {
        const data = await response.json();
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Failed to remove user');
      console.error('Remove user error:', err);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      const response = await fetch('/api/admin/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': userEmail || '',
        },
        body: JSON.stringify({ targetEmail: passwordTargetEmail, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Password set for ${passwordTargetEmail}`);
        setPasswordModalOpen(false);
        setNewPassword('');
        loadUsers();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage('❌ Failed to set password');
      console.error('Set password error:', err);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-light text-gray-900">Gestione Admin Utenti (Superadmin Only)</h2>

      {/* ADD NEW ADMIN */}
      <div className="border border-gray-200 rounded-lg p-8">
        <h3 className="text-xl font-light mb-4">Aggiungi Nuovo Admin</h3>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="email"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Admin'}
            </button>
          </div>
        </form>
        {message && (
          <div className="mt-4 p-3 rounded-lg bg-gray-100 text-sm">
            {message}
          </div>
        )}
      </div>

      {/* LIST ADMINS */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xl font-light">Admin Utenti ({users.length})</h3>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No admin users</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Role</th>
                <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Created</th>
                <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-light text-gray-600">🔐 Password</th>
                <th className="px-6 py-3 text-left text-sm font-light text-gray-600">2FA</th>
                <th className="px-6 py-3 text-left text-sm font-light text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.created_at).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs rounded ${
                      user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.password_hash ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Set</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Not set</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.twofa_enabled ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">✓ Enabled</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Disabled</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => {
                        setPasswordTargetEmail(user.email);
                        setPasswordModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Set PSW
                    </button>
                    {user.email !== userEmail && (
                      <button
                        onClick={() => handleRemoveUser(user.email)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-light text-gray-900 mb-4">Imposta Password 🔐</h3>
            <p className="text-gray-600 text-sm mb-6">Imposta una nuova password per: <strong>{passwordTargetEmail}</strong></p>

            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuova Password (min 8 caratteri)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Inserisci password"
                  minLength={8}
                  required
                  disabled={passwordLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={passwordLoading || newPassword.length < 8}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? '⏳ Impostazione...' : 'Imposta'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalOpen(false);
                    setNewPassword('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400"
                >
                  Annulla
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              La password sarà richiesta al prossimo accesso admin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
