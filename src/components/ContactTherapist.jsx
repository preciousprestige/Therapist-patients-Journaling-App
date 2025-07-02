import React, { useState } from 'react';
import { FaMale, FaFemale } from 'react-icons/fa';
import ParticlesBackground from './ParticlesBackground';

const therapists = {
  male: [
    { name: "Dr. Toochi onyebuchi", img: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Mr. Dogo gabriel", img: "https://randomuser.me/api/portraits/men/46.jpg" },
  ],
  female: [
    { name: "Dr. Jenifer udeali", img: "https://randomuser.me/api/portraits/women/45.jpg" },
    { name: "Ms. Blossom success joseph", img: "https://randomuser.me/api/portraits/women/46.jpg" },
  ],
};

export default function ContactTherapist() {
  const [gender, setGender] = useState(null);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white">
      
      <ParticlesBackground />

      <div className="mt-24 mb-16 p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl max-w-3xl w-[90%] text-center space-y-6 border border-purple-500">
        
        <h1 className="text-4xl sm:text-5xl font-bold text-purple-300">
          Contact a Therapist
        </h1>

        <p className="text-white/70 text-lg">
          Select a therapist based on your preference.
        </p>

        {/* Gender Selection */}
        <div className="flex justify-center gap-10 mt-6">
          <button 
            onClick={() => setGender('male')}
            className={`text-5xl p-4 rounded-full transition transform hover:scale-110 ${gender === 'male' ? 'bg-purple-700' : 'bg-white/10'}`}
          >
            <FaMale />
          </button>

          <button 
            onClick={() => setGender('female')}
            className={`text-5xl p-4 rounded-full transition transform hover:scale-110 ${gender === 'female' ? 'bg-purple-700' : 'bg-white/10'}`}
          >
            <FaFemale />
          </button>
        </div>

        {/* Therapist List */}
        {gender && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {therapists[gender].map((t, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-purple-500 shadow-lg flex flex-col items-center space-y-4 hover:scale-105 transition">
                <img src={t.img} alt={t.name} className="w-24 h-24 rounded-full object-cover border-2 border-purple-500" />
                <h2 className="text-xl font-semibold">{t.name}</h2>
                <button className="px-4 py-1 rounded bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white hover:scale-105 transition">
                  Request Session
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
