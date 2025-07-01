import React, { useState } from 'react';

export default function AddReflection({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !text) return;
    onAdd({ title, mood, preview: text });
    setTitle('');
    setMood('');
    setText('');
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-20">
      <button
        onClick={() => setOpen(!open)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        {open ? 'Close' : 'Add Reflection'}
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 backdrop-blur-md bg-white/10 p-6 rounded-xl shadow-lg w-80 space-y-4"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mood (optional)"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <textarea
            placeholder="Your Reflection"
            rows="4"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            Submit Reflection
          </button>
        </form>
      )}
    </div>
  );
}
