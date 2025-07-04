import React, { useState, useRef } from 'react';
import { FiMinimize2, FiMaximize2, FiX } from 'react-icons/fi';

export default function ChatBox({ user, storageKey = 'chat_messages', pov = 'patient', onClose }) {
  const [size, setSize] = useState('medium');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const boxRef = useRef();

  const handleSend = () => {
    if (!input.trim()) return;
    
    const sender = pov === 'patient' ? 'You' : 'Therapist';
    const newMessages = [...messages, { sender, text: input }];
    
    setMessages(newMessages);
    localStorage.setItem(storageKey, JSON.stringify(newMessages));
    setInput('');
  };

  const toggleSize = () => {
    setSize(size === 'medium' ? 'large' : 'medium');
  };

  const containerStyles = `
    fixed bottom-4 right-4 z-50
    ${size === 'medium' ? 'w-72 h-80' : 'w-[28rem] h-[32rem]'}
    bg-white/10 backdrop-blur-md border border-purple-500 rounded-3xl shadow-2xl
    flex flex-col overflow-hidden text-white
  `;

  return (
    <div ref={boxRef} className={containerStyles}>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-purple-700/60">
        <h2 className="font-bold">Chat with {user}</h2>
        <div className="flex space-x-2">
          <button onClick={toggleSize}>
            {size === 'medium' ? <FiMaximize2 /> : <FiMinimize2 />}
          </button>
          <button onClick={onClose}><FiX /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
        {messages.length === 0 ? (
          <p className="text-sm text-white/70 italic">No messages yet.</p>
        ) : (
          messages.map((msg, i) => {
            const isMine = 
              (pov === 'patient' && msg.sender === 'You') ||
              (pov === 'therapist' && msg.sender === 'Therapist');

            return (
              <div
                key={i}
                className={`
                  p-2 max-w-[70%] rounded-lg bg-white/10 backdrop-blur
                  ${isMine ? 'ml-auto text-right bg-purple-500/30' : 'mr-auto text-left bg-purple-700/30'}
                `}
              >
                <span className="font-bold">{msg.sender}:</span> {msg.text}
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-2 border-t border-purple-500 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white rounded-lg hover:scale-105 transition-transform"
        >
          Send
        </button>
      </div>
    </div>
  );
}
