import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { journalAPI, moodAPI, notesAPI, carePackageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RiGiftLine, RiCheckLine } from 'react-icons/ri';

const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', low: '😔', terrible: '😢' };

export default function PatientDashboard() {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [moods, setMoods] = useState([]);
  const [notes, setNotes] = useState([]);
  const [carePackages, setCarePackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [j, m, n, cp] = await Promise.all([
          journalAPI.getAll(), moodAPI.getAll(), notesAPI.getAll(), carePackageAPI.getMy()
        ]);
        setJournals(j.data || []); setMoods(m.data || []);
        setNotes(n.data || []); setCarePackages(cp.data || []);
      } catch { }
      setLoading(false);
    };
    load();
  }, []);

  const unreadPackages = carePackages.filter(p => !p.read);

  const handleReadPackage = async (id) => {
    try {
      await carePackageAPI.markRead(id);
      setCarePackages(prev => prev.map(p => p._id === id ? { ...p, read: true } : p));
    } catch { }
  };

  const upcomingAppts = [];
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-800">{greeting()}, {user?.name?.split(' ')[0]} 🌸</h1>
        <p className="text-stone-500 text-sm mt-1">{new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Care Package Notifications */}
      {unreadPackages.length > 0 && (
        <div className="mb-6 space-y-3">
          {unreadPackages.map(pkg => (
            <div key={pkg._id} className="bg-gradient-to-r from-warm-50 to-amber-50 border border-warm-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-warm-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <RiGiftLine className="text-warm-600 text-2xl" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-stone-800 text-base">🎁 Care Package from {pkg.therapist?.name || 'Your Therapist'}</p>
                  <p className="text-stone-600 text-sm mt-1 leading-relaxed">{pkg.message}</p>
                  <p className="text-xs text-stone-400 mt-2">{pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
                </div>
                <button onClick={() => handleReadPackage(pkg._id)}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-warm-700 bg-warm-100 hover:bg-warm-200 px-3 py-1.5 rounded-lg transition-colors">
                  <RiCheckLine /> Mark read
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick access */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { to: '/patient/journal', emoji: '📓', label: 'My Journal', count: journals.length, desc: 'entries', color: 'bg-warm-50 border-warm-100' },
          { to: '/patient/mood', emoji: '🌡️', label: 'Mood Tracker', count: moods.length, desc: 'check-ins', color: 'bg-sage-50 border-sage-100' },
          { to: '/patient/notes', emoji: '📋', label: 'Therapist Notes', count: notes.length, desc: 'notes', color: 'bg-blush-50 border-blush-100' },
          { to: '/patient/messages', emoji: '💬', label: 'Messages', count: '—', desc: 'with therapist', color: 'bg-stone-50 border-stone-100' },
        ].map(item => (
          <Link key={item.to} to={item.to} className={`card border p-4 hover:shadow-md transition-shadow ${item.color}`}>
            <span className="text-2xl">{item.emoji}</span>
            <p className="font-display font-bold text-stone-800 text-xl mt-2">{loading ? '—' : item.count}</p>
            <p className="text-xs text-stone-500">{item.desc}</p>
            <p className="font-semibold text-stone-700 text-sm mt-1">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent journal entries */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-stone-800">Recent Journal Entries</h2>
          <Link to="/patient/journal" className="text-xs text-sage-600 hover:underline font-semibold">View all</Link>
        </div>
        {loading ? (
          <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-16 bg-stone-50 rounded-xl animate-pulse" />)}</div>
        ) : journals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-stone-400 text-sm">No journal entries yet</p>
            <Link to="/patient/journal" className="text-sage-600 text-sm font-semibold hover:underline mt-1 inline-block">Write your first entry →</Link>
          </div>
        ) : journals.slice(0, 3).map(j => (
          <div key={j._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors">
            <span className="text-xl mt-0.5">{MOOD_EMOJI[j.mood] || '📓'}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 text-sm truncate">{j.title || 'Untitled Entry'}</p>
              <p className="text-xs text-stone-500 truncate">{j.content?.slice(0, 80)}</p>
              <p className="text-xs text-stone-400 mt-0.5">{j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-PH') : '—'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Past care packages */}
      {carePackages.filter(p => p.read).length > 0 && (
        <div className="card p-5">
          <h2 className="font-display font-semibold text-stone-800 mb-3">Past Care Packages 🎁</h2>
          <div className="space-y-2">
            {carePackages.filter(p => p.read).slice(0, 3).map(pkg => (
              <div key={pkg._id} className="p-3 bg-stone-50 rounded-xl">
                <p className="text-sm text-stone-600 italic">"{pkg.message}"</p>
                <p className="text-xs text-stone-400 mt-1">From {pkg.therapist?.name} · {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString('en-PH') : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
