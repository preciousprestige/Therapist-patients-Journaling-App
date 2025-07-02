import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';

export default function TherapistPortal() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white">
        <ParticlesBackground />

        <div className="p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-[90%] text-center space-y-6 border border-purple-500">
          <h1 className="text-3xl sm:text-4xl font-bold text-purple-300">
            Therapist Login
          </h1>
          <p className="text-white/70">Access patient reflections securely.</p>

          <button
            onClick={() => setAuthenticated(true)}
            className="px-6 py-2 mt-4 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white shadow-lg hover:scale-105 transition-transform"
          >
            Simulate Login
          </button>

          <Link to="/" className="block mt-4 text-purple-300 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white">

      {/* Floating particles */}
      <ParticlesBackground />

      {/* Glass morphism container */}
      <div className="mt-24 mb-16 p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl max-w-4xl w-[90%] text-center space-y-6 border border-purple-500">

        <h1 className="text-4xl sm:text-5xl font-bold text-purple-300">
          Therapist Portal
        </h1>

        <p className="text-white/70 text-lg">
          View patient reflections and wellness progress.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/" 
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white shadow-lg hover:scale-105 transition-transform"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Placeholder for reflections list */}
      <div className="max-w-6xl w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        <p className="text-center col-span-full text-white/60 italic">
          No patient reflections yet. This will show submitted journals.
        </p>
      </div>

    </div>
  );
}
