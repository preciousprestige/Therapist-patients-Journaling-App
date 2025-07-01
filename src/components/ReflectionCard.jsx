import React, { useState } from 'react';

export default function ReflectionCard({ title, mood, preview }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="backdrop-blur-md bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg hover:scale-105 transition-transform cursor-pointer overflow-hidden"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold gradient-text">{title}</h3>
        <span className="text-sm text-white/60 italic">{mood}</span>
      </div>

      {!expanded ? (
        <p className="text-white/70 text-sm line-clamp-2">{preview}</p>
      ) : (
        <p className="text-white/70 text-sm mt-2">{preview}</p>
      )}
    </div>
  );
}
