import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TherapistPortal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const stored = localStorage.getItem('aid_therapist');
    if (!stored) {
      alert('No therapist registered. Please register first.');
      return;
    }

    const therapist = JSON.parse(stored);

    if (email === therapist.email && password === therapist.password) {
      console.log('Therapist authenticated');
      navigate('/therapist-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white p-4">

      <h1 className="text-3xl font-bold text-purple-300 mb-6">Therapist Login</h1>

      <form onSubmit={handleLogin} className="space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl max-w-md w-full border border-purple-500">

        <input
          type="email"
          placeholder="Email Address"
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
  );
}
