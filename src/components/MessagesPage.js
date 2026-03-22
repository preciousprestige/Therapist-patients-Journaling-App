import React, { useEffect, useState, useRef } from 'react';
import { messageAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RiSendPlaneFill } from 'react-icons/ri';

export default function MessagesPage({ role }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const r = role === 'therapist' ? await usersAPI.getMyPatients() : await usersAPI.getTherapists();
        setConversations(r.data || []);
        if (r.data?.length > 0) setSelectedUser(r.data[0]);
      } catch { }
      setLoading(false);
    };
    load();
  }, [role]);

  useEffect(() => {
    if (!selectedUser) return;
    const load = async () => {
      try {
        const r = await messageAPI.getConversation(selectedUser._id);
        setMessages(r.data || []);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      } catch { }
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;
    setSending(true);
    try {
      await messageAPI.send({ receiverId: selectedUser._id, content: text.trim() });
      setText('');
      const r = await messageAPI.getConversation(selectedUser._id);
      setMessages(r.data || []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch { }
    setSending(false);
  };

  const emptyLabel = role === 'therapist' ? 'No patients assigned yet' : 'No therapist assigned yet';

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-7rem)]">
      <h1 className="font-display text-2xl font-bold text-stone-800 mb-4">Messages</h1>
      <div className="card flex h-[calc(100%-4rem)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-stone-100 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-stone-50 rounded-xl animate-pulse" />)}</div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center"><p className="text-stone-400 text-sm">{emptyLabel}</p></div>
          ) : conversations.map(c => (
            <button key={c._id} onClick={() => setSelectedUser(c)}
              className={`w-full flex items-center gap-3 p-4 text-left border-b border-stone-50 transition-colors ${selectedUser?._id === c._id ? 'bg-sage-50' : 'hover:bg-stone-50'}`}>
              <div className="w-9 h-9 rounded-full bg-warm-100 flex items-center justify-center text-warm-700 font-bold font-display flex-shrink-0">
                {c.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 text-sm truncate">{c.name}</p>
                <p className="text-xs text-stone-400 capitalize">{c.role}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3 bg-white">
                <div className="w-9 h-9 rounded-full bg-warm-100 flex items-center justify-center text-warm-700 font-bold font-display">
                  {selectedUser.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{selectedUser.name}</p>
                  <p className="text-xs text-stone-400 capitalize">{selectedUser.role}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-stone-400 text-sm">No messages yet. Say hello! 👋</p>
                  </div>
                ) : messages.map((msg, i) => {
                  const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe ? 'bg-sage-600 text-white rounded-br-sm' : 'bg-white text-stone-700 border border-stone-100 rounded-bl-sm shadow-sm'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-sage-200' : 'text-stone-400'}`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-100 flex gap-3">
                <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." className="input-field flex-1" />
                <button type="submit" disabled={sending || !text.trim()}
                  className="w-10 h-10 bg-sage-600 hover:bg-sage-700 disabled:bg-sage-300 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <RiSendPlaneFill className="text-lg" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-stone-400 text-sm">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
