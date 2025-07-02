import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem('aid_visited');
    const timer = setTimeout(() => {
      if (hasVisited) {
        navigate('/login');
      } else {
        navigate('/register');
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white overflow-hidden relative">
      <ParticlesBackground />

      <h1 className="text-7xl sm:text-9xl font-extrabold text-purple-300 animate-fadeIn opacity-0">
        aid
      </h1>

      <style>
        {`
          @keyframes fadeIn {
            to { opacity: 1; transform: scale(1.05); }
          }
          .animate-fadeIn {
            animation: fadeIn 2s forwards;
          }
        `}
      </style>
    </div>
  );
}
