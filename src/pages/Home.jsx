import React, { useState } from 'react';
import AddReflection from '../components/AddReflection';
import ReflectionCard from '../components/ReflectionCard';
import { Link } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';

export default function Home() {
  const [reflections, setReflections] = useState([]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white">

      {/* Background Particles */}
      <ParticlesBackground />

      {/* Glass Container */}
      <div className="mt-24 mb-16 p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl max-w-4xl w-[90%] text-center space-y-6 border border-purple-500">

        <h1 className="text-4xl sm:text-5xl font-bold text-purple-300">
          Patient Reflection Journal
        </h1>

        <p className="text-white/70 text-lg">
          Track your thoughts, prioritize your wellness.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/contact" 
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white shadow-lg hover:scale-105 transition-transform"
          >
            Contact a Therapist
          </Link>

          <Link 
            to="/therapist" 
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white shadow-lg hover:scale-105 transition-transform"
          >
            Therapist Portal
          </Link>
        </div>

      </div>

      {/* Reflections Grid */}
      <div className="max-w-6xl w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {reflections.length === 0 ? (
          <p className="text-center col-span-full text-white/60 italic">
            No reflections yet. Click below to start.
          </p>
        ) : (
          reflections.map((r, idx) => (
            <ReflectionCard key={idx} {...r} />
          ))
        )}
      </div>

      {/* Floating Add Reflection Button */}
      <AddReflection onAdd={(entry) => setReflections([entry, ...reflections])} />

    </div>
  );
}
