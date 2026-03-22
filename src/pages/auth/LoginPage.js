import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RiLeafLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'therapist' ? '/therapist/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex w-1/2 bg-sage-700 flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 70C23.4 70 10 56.6 10 40S23.4 10 40 10s30 13.4 30 30-13.4 30-30 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <RiLeafLine className="text-white text-xl" />
            </div>
            <span className="font-display font-semibold text-white text-xl">MindBridge</span>
          </div>
          <h1 className="font-display text-5xl font-bold text-white leading-tight mb-6">
            A safe space<br />
            <span className="text-sage-200 italic">to heal & grow.</span>
          </h1>
          <p className="text-sage-200 text-lg leading-relaxed">
            Journal your thoughts, track your mood, and stay connected with your therapist — all in one calm, private space.
          </p>
        </div>
        <div className="relative space-y-3">
          {[
            { emoji: '📓', text: 'Private journaling with mood tracking' },
            { emoji: '💬', text: 'Secure messaging with your therapist' },
            { emoji: '📋', text: 'View session notes from your therapist' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-3 text-sage-100 text-sm">
              <span>{item.emoji}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8 bg-amber-50/30">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <RiLeafLine className="text-sage-600 text-xl" />
            <span className="font-display font-semibold text-stone-800 text-lg">MindBridge</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-stone-800 mb-2">Welcome back</h2>
          <p className="text-stone-500 text-sm mb-8">Sign in to continue your journey</p>

          {error && <div className="bg-blush-50 border border-blush-200 text-blush-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email address</label>
              <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-sage-600 hover:bg-sage-700 disabled:bg-sage-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-sage-600 hover:text-sage-700 font-semibold">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
