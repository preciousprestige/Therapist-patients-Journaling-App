import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { RiLeafLine } from 'react-icons/ri';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await authAPI.register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-amber-50/30">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-sage-600 rounded-xl flex items-center justify-center">
            <RiLeafLine className="text-white" />
          </div>
          <span className="font-display font-semibold text-stone-800 text-lg">MindBridge</span>
        </div>

        <div className="card p-8">
          <h2 className="font-display text-2xl font-bold text-stone-800 mb-1">Create account</h2>
          <p className="text-stone-500 text-sm mb-6">Join MindBridge to begin your journey</p>

          {error && <div className="bg-blush-50 border border-blush-200 text-blush-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full Name</label>
              <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="At least 6 characters" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {['patient', 'therapist'].map(r => (
                  <button key={r} type="button" onClick={() => setForm(p => ({ ...p, role: r }))}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all capitalize ${form.role === r ? 'bg-sage-600 text-white border-sage-600' : 'bg-white text-stone-600 border-stone-200 hover:border-sage-300'}`}>
                    {r === 'patient' ? '🧘 Patient' : '🩺 Therapist'}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-sage-600 hover:bg-sage-700 disabled:bg-sage-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-sage-600 hover:text-sage-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
