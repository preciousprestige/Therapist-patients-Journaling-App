import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.toLowerCase().includes('therapist')) {
      navigate('/therapist');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white">
      <ParticlesBackground />
      <div className="p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-[90%] text-center space-y-6 border border-purple-500">
        <h1 className="text-4xl font-bold text-purple-300">Welcome Back</h1>
        <p className="text-white/70 text-lg">Login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
            required
          />

          <button 
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white hover:scale-105 transition-transform"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
