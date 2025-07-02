import React, { useState } from 'react';

export default function AddReflection({ onAdd }) {
  const [text, setText] = useState('');
  const [mood, setMood] = useState('🙂'); // Default mood

  const handleSubmit = (e) => {
    e.preventDefault();

    // Placeholder AI note logic
    const aiNote = `AI Summary: Based on your reflection, you're feeling ${mood}.`;

    const newReflection = {
      text,
      mood,
      aiNote,
      date: new Date().toLocaleString(),
    };

    onAdd(newReflection);
    setText('');
    setMood('🙂');
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-6 right-6 p-4 bg-white/10 backdrop-blur rounded-xl shadow-lg flex flex-col space-y-4 max-w-sm w-[90%] border border-purple-500">

      <textarea
        placeholder="Write your reflection..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 rounded bg-white/10 text-white border border-purple-500 focus:outline-none"
        required
      />

      {/* Mood Selection */}
      <div className="flex justify-around text-2xl">
        {['😄', '🙂', '😐', '☹️', '😢'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMood(m)}
            className={`transition transform ${mood === m ? 'scale-125' : 'opacity-50'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <button type="submit" className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:scale-105 transition">
        Add Reflection
      </button>

    </form>
  );
}
