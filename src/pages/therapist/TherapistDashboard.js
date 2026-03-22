import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI, journalAPI, notesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RiUserHeartLine, RiBookOpenLine, RiFileTextLine, RiMessage2Line } from 'react-icons/ri';

const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', low: '😔', terrible: '😢' };

export default function TherapistDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [recentJournals, setRecentJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, j] = await Promise.all([usersAPI.getMyPatients(), journalAPI.getAll()]);
        setPatients(p.data || []);
        setRecentJournals((j.data || []).slice(0, 5));
      } catch { }
      setLoading(false);
    };
    load();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-800">{greeting()}, {user?.name?.split(' ')[0]} 🌿</h1>
        <p className="text-stone-500 text-sm mt-1">{new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'My Patients', value: patients.length, icon: RiUserHeartLine, color: 'bg-sage-50 text-sage-600', to: '/therapist/patients' },
          { label: 'Journal Entries', value: recentJournals.length, icon: RiBookOpenLine, color: 'bg-warm-50 text-warm-600', to: '/therapist/patients' },
          { label: 'Session Notes', value: '—', icon: RiFileTextLine, color: 'bg-blush-50 text-blush-600', to: '/therapist/notes' },
          { label: 'Messages', value: '—', icon: RiMessage2Line, color: 'bg-stone-50 text-stone-600', to: '/therapist/messages' },
        ].map(item => (
          <Link key={item.label} to={item.to} className="card p-4 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <item.icon className="text-lg" />
            </div>
            <p className="font-display text-2xl font-bold text-stone-800">{loading ? '—' : item.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{item.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Patients */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-stone-800">My Patients</h2>
            <Link to="/therapist/patients" className="text-xs text-sage-600 hover:underline font-semibold">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-stone-50 rounded-xl animate-pulse" />)}</div>
          ) : patients.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">No patients assigned yet</p>
          ) : (
            <div className="space-y-2">
              {patients.slice(0, 5).map(p => (
                <Link key={p._id} to={`/therapist/patients/${p._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-sage-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-warm-100 flex items-center justify-center text-warm-700 font-bold text-sm font-display flex-shrink-0">
                    {p.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-stone-400 truncate">{p.email}</p>
                  </div>
                  <span className="text-stone-300 text-lg">›</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Journal Activity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-stone-800">Recent Journal Activity</h2>
          </div>
          {loading ? (
            <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 bg-stone-50 rounded-xl animate-pulse" />)}</div>
          ) : recentJournals.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-8">No journal entries yet</p>
          ) : (
            <div className="space-y-2">
              {recentJournals.map(j => (
                <div key={j._id} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-800 text-sm truncate">{j.patient?.name || 'Unknown'}</p>
                      <p className="text-xs text-stone-500 truncate mt-0.5">{j.title || j.content?.slice(0, 60) || '—'}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-base">{MOOD_EMOJI[j.mood] || '📓'}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">{j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-PH') : '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
