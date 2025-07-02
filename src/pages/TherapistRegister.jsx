import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TherapistRegister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Handle therapist registration logic (API call or storage)
    console.log({ fullName, email, password });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white p-4">

      <h1 className="text-3xl font-bold text-purple-300 mb-6">Therapist Registration</h1>

      <form onSubmit={handleRegister} className="space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl max-w-md w-full border border-purple-500">
        
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
          required
        />

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
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white hover:scale-105 transition-transform"
        >
          Register
        </button>

      </form>

      <Link to="/" className="mt-6 text-purple-300 underline">Back to Login</Link>

    </div>
  );
}
