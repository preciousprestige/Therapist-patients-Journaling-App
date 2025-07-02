import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Trusted Contact
  const [contactName, setContactName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactAddress, setContactAddress] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem('aid_visited');
    if (hasVisited) {
      navigate('/login');  // Skip Welcome if already registered
    }
  }, [navigate]);

  const handleGoogleSignIn = () => {
    alert('Google Sign-In coming soon');
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const data = {
      fullName,
      email,
      password,
      trustedContact: {
        contactName,
        relationship,
        contactEmail,
        contactNumber,
        contactAddress,
      },
    };

    console.log('Patient Registered:', data);
    localStorage.setItem('aid_visited', 'true');
    // Optional: Save to backend/localStorage
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white p-4">

      <h1 className="text-3xl font-bold text-purple-300 mb-6">Patient Registration</h1>

      <button
        onClick={handleGoogleSignIn}
        className="mb-4 w-full max-w-md px-4 py-2 rounded-lg bg-white text-black hover:scale-105 transition-transform shadow-lg"
      >
        Register with Google
      </button>

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

        <h2 className="text-purple-300 font-bold mt-4">Trusted Contact (For SOS)</h2>

        <input
          type="text"
          placeholder="Name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
          required
        />

        <input
          type="text"
          placeholder="Relationship (e.g., Friend, Parent)"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
          required
        />

        <input
          type="email"
          placeholder="Contact Email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
          required
        />

        <input
          type="tel"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Home Address"
          value={contactAddress}
          onChange={(e) => setContactAddress(e.target.value)}
          className="w-full p-2 rounded bg-white/10 backdrop-blur text-white border border-purple-500 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-red-500 to-purple-700 text-white hover:scale-105 transition-transform"
        >
          Complete Registration
        </button>

      </form>

      <Link to="/" className="mt-6 text-purple-300 underline">Back to Login</Link>

    </div>
  );
}
