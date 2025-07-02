import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PinUnlock() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const savedPin = localStorage.getItem('aid_pin') || '1234';  // Default for testing

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === savedPin) {
      navigate('/home');
    } else {
      setError('Incorrect PIN. Try again.');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('aid_pin');
    localStorage.removeItem('aid_user');
    localStorage.removeItem('aid_visited');
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white p-4">

      <h1 className="text-3xl font-bold text-purple-300 mb-6">Enter PIN to Continue</h1>

      <form onSubmit={handleUnlock} className="space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl max-w-md w-full border border-purple-500">

        <input
          type="password"
          placeholder="Enter your PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none text-center"
          maxLength={6}
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white hover:scale-105 transition-transform"
        >
          Unlock
        </button>
      </form>

      <button
        onClick={handleReset}
        className="mt-6 text-purple-300 underline text-sm"
      >
        Reset & Re-register
      </button>
    </div>
  );
}
