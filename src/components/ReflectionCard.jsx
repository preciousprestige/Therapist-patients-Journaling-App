import React from 'react';

export default function ReflectionCard({ moodSummary, emoji, note, timestamp }) {
  return (
    <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl border border-purple-500 text-white space-y-2 shadow-lg">
      <p className="text-lg">{emoji} {moodSummary}</p>
      <p className="text-sm italic text-white/70">"{note}"</p>
      <p className="text-xs text-right text-white/50">{timestamp}</p>
    </div>
  );
}
