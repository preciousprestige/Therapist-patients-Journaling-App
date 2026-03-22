import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { journalAPI, moodAPI, notesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', low: '😔', terrible: '😢' };

export default function PatientDashboard() {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [moods, setMoods] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [j, m, n] = await Promise.all([journalAPI.getAll(), moodAPI.getAll(), notesAPI.getAll()]);
        setJournals(j.data || []); setMoods(m.data || []); setNotes(n.data || []);
      } catch { }
      setLoading(false);
    };
    load();
  }, []);

  const latestMood = moods[0];
  const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-800">{greeting()}, {user?.name?.split(' ')[0]} 🌸</h1>
        <p className="text-stone-500 text-sm mt-1">{new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Current mood banner */}
      {latestMood && (
        <div className="bg-gradient-to-r from-sage-50 to-warm-50 border border-sage-100 rounded-2xl p-4 mb-6 flex items-center gap-4">
          <span className="text-4xl">{MOOD_EMOJI[latestMood.mood]}</span>
          <div>
            <p className="text-xs text-stone-400 font-semibold uppercase tracking-wide">Last Check-in</p>
            <p className="font-display font-semibold text-stone-800 capitalize">{latestMood.mood}</p>
            {latestMood.note && <p className="text-xs text-stone-500 mt-0.5 italic">"{latestMood.note}"</p>}
          </div>
          <Link to="/patient/mood" className="ml-auto text-xs btn-primary">Check in now</Link>
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
      <div className="card p-5">
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
    </div>
  );
}
