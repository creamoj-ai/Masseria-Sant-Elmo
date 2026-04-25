'use client';

import { useState, useEffect } from 'react';

interface ChatMessage {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  message: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
  type: 'client' | 'supplier';
  avatar?: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  type: 'client' | 'supplier';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
}

export function WhatsAppChat() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'client' | 'supplier'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Mock contacts data
  const allContacts: Contact[] = [
    {
      id: '1',
      name: 'Marco Rossi',
      phone: '+39 333 1234567',
      type: 'client',
      lastMessage: 'Confermato per sabato! 🎉',
      lastMessageTime: '5 min fa',
      unreadCount: 2,
      avatar: '👤'
    },
    {
      id: '2',
      name: 'Sofia Bianchi',
      phone: '+39 333 9876543',
      type: 'client',
      lastMessage: 'Hai gli oli disponibili?',
      lastMessageTime: '1 ora fa',
      unreadCount: 0,
      avatar: '👩'
    },
    {
      id: '3',
      name: 'Caffetteria Leopardi',
      phone: '+39 392 5555555',
      type: 'supplier',
      lastMessage: 'Pronto per lunedì',
      lastMessageTime: '2 ore fa',
      unreadCount: 1,
      avatar: '🏪'
    },
    {
      id: '4',
      name: 'Florist Studio',
      phone: '+39 392 6666666',
      type: 'supplier',
      lastMessage: 'Nuova collezione disponibile',
      lastMessageTime: '1 giorno fa',
      unreadCount: 0,
      avatar: '🌸'
    },
    {
      id: '5',
      name: 'Giovanni Verdi',
      phone: '+39 333 4444444',
      type: 'client',
      lastMessage: 'Grazie mille!',
      lastMessageTime: '2 giorni fa',
      unreadCount: 0,
      avatar: '👨'
    },
  ];

  // Mock messages data
  const mockMessages: ChatMessage[] = [
    { id: '1', contactId: '1', contactName: 'Marco Rossi', contactPhone: '+39 333 1234567', message: 'Ciao! Vorrei prenotare per sabato', timestamp: '10:30', isSent: false, isRead: true, type: 'client' },
    { id: '2', contactId: '1', contactName: 'Marco Rossi', contactPhone: '+39 333 1234567', message: 'Perfetto! Ti aspettiamo!', timestamp: '10:35', isSent: true, isRead: true, type: 'client' },
    { id: '3', contactId: '1', contactName: 'Marco Rossi', contactPhone: '+39 333 1234567', message: 'Confermato per sabato! 🎉', timestamp: '10:40', isSent: false, isRead: true, type: 'client' },
  ];

  const filteredContacts = allContacts.filter(contact => {
    const matchesFilter = filterType === 'all' || contact.type === filterType;
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contact.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    if (selectedContact) {
      setMessages(mockMessages.filter(m => m.contactId === selectedContact.id));
    }
  }, [selectedContact]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: ChatMessage = {
      id: String(messages.length + 1),
      contactId: selectedContact.id,
      contactName: selectedContact.name,
      contactPhone: selectedContact.phone,
      message: messageInput,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isRead: false,
      type: selectedContact.type,
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: String(messages.length + 2),
        contactId: selectedContact.id,
        contactName: selectedContact.name,
        contactPhone: selectedContact.phone,
        message: '👍 Ricevuto! Grazie!',
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
        isSent: false,
        isRead: true,
        type: selectedContact.type,
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 2000);
  };

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '✅', '⚠️', '💰', '📅', '🍽️', '🌿', '✨'];

  const getTotalUnread = () => {
    return filteredContacts.reduce((sum, contact) => sum + contact.unreadCount, 0);
  };

  const getContactTypeLabel = (type: string) => {
    return type === 'client' ? '👤 Cliente' : '🏪 Fornitore';
  };

  const getContactTypeColor = (type: string) => {
    return type === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';
  };

  return (
    <div className="h-screen flex bg-white">
      {/* LEFT SIDEBAR - CONTACTS */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* HEADER */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-light mb-4">💬 WhatsApp</h1>
          <input
            type="text"
            placeholder="Cerca contatto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* FILTERS */}
        <div className="p-4 border-b border-gray-200 flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-light transition ${
              filterType === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tutti
          </button>
          <button
            onClick={() => setFilterType('client')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-light transition ${
              filterType === 'client'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👤 Clienti
          </button>
          <button
            onClick={() => setFilterType('supplier')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-light transition ${
              filterType === 'supplier'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🏪 Fornitori
          </button>
        </div>

        {/* CONTACTS LIST */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              <p className="text-sm">Nessun contatto trovato</p>
            </div>
          ) : (
            filteredContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition ${
                  selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{contact.avatar}</span>
                    <div>
                      <p className="font-light text-sm text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.phone}</p>
                    </div>
                  </div>
                  {contact.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-light">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600 truncate flex-1">{contact.lastMessage}</p>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-light ${getContactTypeColor(contact.type)}`}>
                    {getContactTypeLabel(contact.type)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{contact.lastMessageTime}</p>
              </button>
            ))
          )}
        </div>

        {/* FOOTER STATS */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <p className="text-lg font-light text-gray-900">{filteredContacts.length}</p>
              <p className="text-xs text-gray-600">Contatti</p>
            </div>
            <div>
              <p className="text-lg font-light text-green-600">{getTotalUnread()}</p>
              <p className="text-xs text-gray-600">Non letti</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - CHAT */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col">
          {/* CHAT HEADER */}
          <div className="border-b border-gray-200 p-6 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedContact.avatar}</span>
              <div>
                <h2 className="text-lg font-light text-gray-900">{selectedContact.name}</h2>
                <p className="text-sm text-gray-600">{selectedContact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-light ${getContactTypeColor(selectedContact.type)}`}>
                {getContactTypeLabel(selectedContact.type)}
              </span>
              <button className="p-2 hover:bg-white rounded-lg transition">
                ☎️
              </button>
              <button className="p-2 hover:bg-white rounded-lg transition">
                ℹ️
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-sm">Nessun messaggio. Inizia la conversazione!</p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-lg ${
                      msg.isSent
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm font-light break-words">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.isSent ? 'text-green-100' : 'text-gray-600'}`}>
                      {msg.timestamp} {msg.isSent && (msg.isRead ? '✓✓' : '✓')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* EMOJI PICKER */}
          {showEmojiPicker && (
            <div className="border-t border-gray-200 p-4 bg-gray-50 grid grid-cols-6 gap-2">
              {emojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMessageInput(messageInput + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-2xl hover:scale-125 transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* INPUT AREA */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="px-3 py-2 text-xl hover:bg-gray-100 rounded-lg transition"
              >
                😊
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Scrivi un messaggio..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-light hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📤
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Usa Enter per inviare</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="text-4xl mb-4">💬</p>
            <p className="text-lg font-light">Seleziona un contatto per iniziare</p>
          </div>
        </div>
      )}
    </div>
  );
}
