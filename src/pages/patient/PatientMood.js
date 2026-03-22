import React, { useEffect, useState } from 'react';
import { moodAPI } from '../../services/api';

const MOODS = [
  { key: 'great', emoji: '😄', label: 'Great', desc: 'Feeling amazing!', color: 'border-emerald-300 bg-emerald-50', selectedColor: 'border-emerald-500 bg-emerald-100' },
  { key: 'good', emoji: '🙂', label: 'Good', desc: 'Pretty good today', color: 'border-sage-300 bg-sage-50', selectedColor: 'border-sage-500 bg-sage-100' },
  { key: 'okay', emoji: '😐', label: 'Okay', desc: 'Just getting by', color: 'border-amber-300 bg-amber-50', selectedColor: 'border-amber-500 bg-amber-100' },
  { key: 'low', emoji: '😔', label: 'Low', desc: 'Struggling a bit', color: 'border-orange-300 bg-orange-50', selectedColor: 'border-orange-500 bg-orange-100' },
  { key: 'terrible', emoji: '😢', label: 'Terrible', desc: 'Really difficult day', color: 'border-blush-300 bg-blush-50', selectedColor: 'border-blush-500 bg-blush-100' },
];

const MOOD_HISTORY_COLOR = { great: 'bg-emerald-400', good: 'bg-sage-400', okay: 'bg-amber-400', low: 'bg-orange-400', terrible: 'bg-blush-400' };

export default function PatientMood() {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const r = await moodAPI.getAll(); setHistory(r.data || []); } catch { }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await moodAPI.create({ mood: selected, note });
      setSaved(true); setSelected(''); setNote('');
      load();
      setTimeout(() => setSaved(false), 3000);
    } catch { }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-800">Mood Check-in</h1>
        <p className="text-stone-500 text-sm mt-1">How are you feeling today? Check in regularly to track your wellbeing.</p>
      </div>

      {/* Check-in form */}
      <div className="card p-6 mb-6">
        {saved ? (
          <div className="text-center py-6">
            <span className="text-5xl">✨</span>
            <p className="font-display font-semibold text-stone-800 text-lg mt-3">Check-in recorded!</p>
            <p className="text-stone-500 text-sm mt-1">Thank you for checking in. Your therapist can see this.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <p className="font-semibold text-stone-700 mb-3">How are you feeling right now?</p>
              <div className="grid grid-cols-5 gap-2">
                {MOODS.map(m => (
                  <button key={m.key} type="button" onClick={() => setSelected(m.key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${selected === m.key ? m.selectedColor + ' shadow-sm' : m.color + ' hover:shadow-sm'}`}>
                    <span className="text-3xl">{m.emoji}</span>
                    <span className="text-xs font-semibold text-stone-700">{m.label}</span>
                  </button>
                ))}
              </div>
              {selected && (
                <p className="text-sm text-stone-500 mt-2 text-center italic">
                  {MOODS.find(m => m.key === selected)?.desc}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Add a note <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="What's contributing to how you feel? Any thoughts you want to capture..."
                className="input-field resize-none" rows={3} />
            </div>

            <button type="submit" disabled={saving || !selected}
              className="w-full bg-sage-600 hover:bg-sage-700 disabled:bg-sage-200 disabled:text-sage-400 text-white font-semibold py-3 rounded-xl transition-colors">
              {saving ? 'Saving...' : 'Submit Check-in'}
            </button>
          </form>
        )}
      </div>

      {/* History */}
      <div className="card p-5">
        <h2 className="font-display font-semibold text-stone-800 mb-4">Check-in History</h2>
        {loading ? (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-12 bg-stone-50 rounded-xl animate-pulse" />)}</div>
        ) : history.length === 0 ? (
          <p className="text-stone-400 text-sm text-center py-8">No check-ins yet. Submit your first one above!</p>
        ) : (
          <div className="space-y-2">
            {history.map(h => (
              <div key={h._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${MOOD_HISTORY_COLOR[h.mood] || 'bg-stone-300'}`} />
                <span className="text-xl">{MOODS.find(m => m.key === h.mood)?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 text-sm capitalize">{h.mood}</p>
                  {h.note && <p className="text-xs text-stone-500 truncate italic">"{h.note}"</p>}
                </div>
                <p className="text-xs text-stone-400 flex-shrink-0">
                  {h.createdAt ? new Date(h.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
