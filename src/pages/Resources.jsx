import React from 'react';
import { Link } from 'react-router-dom';

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white p-4">
      <h1 className="text-3xl font-bold text-purple-300 mb-4">Helpful Resources</h1>

      <ul className="space-y-3 text-left">
        <li><strong>National Helpline:</strong> 123-456-7890</li>
        <li>
          <strong>Mindfulness Exercises:</strong>{' '}
          <a href="https://www.headspace.com/" target="_blank" rel="noreferrer" className="underline">
            Headspace
          </a>
        </li>
        <li><strong>Suicide Prevention:</strong> 1-800-273-TALK</li>
        <li>
          <strong>Contact your Therapist:</strong>{' '}
          <Link to="/contact" className="underline">Here</Link>
        </li>
      </ul>

      <Link to="/home" className="mt-6 px-4 py-2 bg-purple-700 rounded-lg hover:scale-105 transition-transform">
        Back to Home
      </Link>
    </div>
  );
}
