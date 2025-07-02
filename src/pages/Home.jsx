import React, { useState, useEffect } from 'react';
import ReflectionCard from '../components/ReflectionCard';
import { Link } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';

export default function Home() {
  const [reflections, setReflections] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reflectionsPerPage = 5;
  const [note, setNote] = useState('');
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const indexOfLast = currentPage * reflectionsPerPage;
  const indexOfFirst = indexOfLast - reflectionsPerPage;
  const currentReflections = reflections.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reflections.length / reflectionsPerPage);

  const crisisKeywords = /(hopeless|suicidal|overwhelmed|worthless|panic attack|can't cope|heart racing|can't breathe)/i;

  const getAISummary = (text) => {
    const lowerText = text.toLowerCase();
    if (/(joy|happy|grateful|excited|content)/.test(lowerText)) {
      return { summary: 'You seem joyful and positive!', emoji: '😊' };
    } else if (/(sad|lonely|hopeless|depressed)/.test(lowerText)) {
      return { summary: 'You seem down or reflective.', emoji: '😢' };
    } else if (/(angry|frustrated|irritated|annoyed)/.test(lowerText)) {
      return { summary: 'There might be some anger showing.', emoji: '😡' };
    } else if (/(stressed|anxious|overwhelmed|worried)/.test(lowerText)) {
      return { summary: 'There could be stress or anxiety building.', emoji: '😫' };
    } else if (/(calm|peaceful|relaxed|okay)/.test(lowerText)) {
      return { summary: 'You seem calm and grounded.', emoji: '😌' };
    } else {
      return { summary: 'Mood not easily detected.', emoji: '❓' };
    }
  };

  const handleAddReflection = () => {
    if (!note) return;

    const aiSummary = getAISummary(note);
    const isCrisis = crisisKeywords.test(note);

    const newReflection = {
      moodSummary: aiSummary.summary,
      emoji: aiSummary.emoji,
      note,
      timestamp: new Date().toLocaleString(),
      crisis: isCrisis,
    };

    setReflections([newReflection, ...reflections]);
    setNote('');

    if (isCrisis) {
      setTimeout(() => {
        setShowCrisisAlert(true);
      }, 100);
    }
  };

  // Auto-hide alert after 8 seconds
  useEffect(() => {
    if (showCrisisAlert) {
      const timer = setTimeout(() => {
        setShowCrisisAlert(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showCrisisAlert]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white">

      <ParticlesBackground />

      {/* Contact Therapist Button - Top Left */}
      <Link
        to="/contact"
        className="fixed left-4 top-4 sm:left-6 sm:top-6 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white shadow-lg hover:scale-105 transition-transform z-20"
      >
        Contact Therapist
      </Link>

      {/* Discreet Crisis Alert */}
      {showCrisisAlert && (
        <div className="fixed right-4 top-4 sm:right-6 sm:top-6 bg-red-700/90 text-white px-4 py-2 rounded-lg shadow-lg z-30 flex items-center space-x-3 animate-pulse">
          <span className="text-2xl">🚨</span>
          <span className="text-sm hidden sm:inline">Speak to your therapist | Call for help</span>
          <div className="flex space-x-2 ml-2">
            <Link to="/contact" className="underline text-white text-xs">Therapist</Link>
            <Link to="/resources" className="underline text-white text-xs">Resources</Link>
          </div>
        </div>
      )}

      {/* Reflection Input Container */}
      <div className="mt-24 p-6 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-[85%] text-center border border-purple-500 space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-4">
          How are you feeling today?
        </h1>

        <textarea
          placeholder="Share your feelings..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2 h-24 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none mb-4"
        />

        <button
          onClick={handleAddReflection}
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white hover:scale-105 transition-transform"
        >
          Add Reflection
        </button>
      </div>

      {/* Reflections Grid */}
      <div className="mt-8 w-[90%] max-w-5xl p-4 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-500 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center items-center overflow-y-auto max-h-[60vh]">
        {currentReflections.length === 0 ? (
          <p className="col-span-full text-white/60 italic text-center">
            No reflections yet. Start expressing yourself.
          </p>
        ) : (
          currentReflections.map((r, idx) => (
            <ReflectionCard key={idx} {...r} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="fixed bottom-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-6 h-6 rounded-full text-sm ${
                currentPage === i + 1 ? 'bg-purple-700' : 'bg-white/10'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
