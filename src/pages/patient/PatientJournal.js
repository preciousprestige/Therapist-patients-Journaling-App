import React, { useEffect, useState } from 'react';
import { journalAPI } from '../../services/api';
import { RiAddLine, RiBookOpenLine, RiDeleteBinLine, RiEditLine } from 'react-icons/ri';

const MOODS = [
  { key: 'great', emoji: '😄', label: 'Great' },
  { key: 'good', emoji: '🙂', label: 'Good' },
  { key: 'okay', emoji: '😐', label: 'Okay' },
  { key: 'low', emoji: '😔', label: 'Low' },
  { key: 'terrible', emoji: '😢', label: 'Terrible' },
];

const MOOD_COLOR = {
  great: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  good: 'bg-sage-50 text-sage-700 border-sage-200',
  okay: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-orange-50 text-orange-700 border-orange-200',
  terrible: 'bg-blush-50 text-blush-700 border-blush-200',
};

const EMPTY_FORM = { title: '', content: '', mood: 'okay' };

export default function PatientJournal() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list | write | read
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try { const r = await journalAPI.getAll(); setEntries(r.data || []); } catch { }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY_FORM); setError(''); setView('write'); };
  const openEdit = (e) => { setEditing(e); setForm({ title: e.title, content: e.content, mood: e.mood }); setError(''); setView('write'); };
  const openRead = (e) => { setSelected(e); setView('read'); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.content.trim()) return setError('Please write something before saving.');
    setSaving(true); setError('');
    try {
      if (editing) await journalAPI.update(editing._id, form);
      else await journalAPI.create(form);
      setView('list'); load();
    } catch (err) { setError(err.response?.data?.message || 'Failed to save entry'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this journal entry?')) return;
    try { await journalAPI.delete(id); load(); setView('list'); } catch { }
  };

  // ── List View ────────────────────────────────────────────────────────────────
  if (view === 'list') return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">My Journal</h1>
          <p className="text-stone-500 text-sm mt-1">Your private space to write and reflect</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-1.5"><RiAddLine />New Entry</button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-stone-100 animate-pulse" />)}</div>
      ) : entries.length === 0 ? (
        <div className="card p-16 text-center">
          <RiBookOpenLine className="text-5xl text-stone-200 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-stone-600 text-lg">Your journal is empty</h3>
          <p className="text-stone-400 text-sm mt-1 mb-6">Writing helps. Start with how you're feeling today.</p>
          <button onClick={openNew} className="btn-primary">Write your first entry</button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry._id} onClick={() => openRead(entry)}
              className="card p-5 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-display font-semibold text-stone-800 truncate flex-1">
                  {entry.title || 'Untitled Entry'}
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border flex-shrink-0 ${MOOD_COLOR[entry.mood] || 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                  {MOODS.find(m => m.key === entry.mood)?.emoji} {entry.mood}
                </span>
              </div>
              <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{entry.content}</p>
              <p className="text-xs text-stone-400 mt-3">
                {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('en-PH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Read View ────────────────────────────────────────────────────────────────
  if (view === 'read' && selected) return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => setView('list')} className="text-stone-400 hover:text-stone-600 text-sm mb-6 flex items-center gap-1">← Back to Journal</button>
      <div className="card p-8">
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${MOOD_COLOR[selected.mood] || 'bg-stone-50 text-stone-500 border-stone-200'}`}>
            {MOODS.find(m => m.key === selected.mood)?.emoji} {selected.mood}
          </span>
          <div className="flex gap-2">
            <button onClick={() => openEdit(selected)} className="p-2 text-stone-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors"><RiEditLine /></button>
            <button onClick={() => handleDelete(selected._id)} className="p-2 text-stone-400 hover:text-blush-600 hover:bg-blush-50 rounded-lg transition-colors"><RiDeleteBinLine /></button>
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-stone-800 mt-3 mb-1">{selected.title || 'Untitled Entry'}</h1>
        <p className="text-xs text-stone-400 mb-6">
          {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
        </p>
        <div className="prose prose-stone max-w-none">
          <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
        </div>
      </div>
    </div>
  );

  // ── Write View ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => setView('list')} className="text-stone-400 hover:text-stone-600 text-sm mb-6 flex items-center gap-1">← Back</button>
      <div className="card p-8">
        <h2 className="font-display text-xl font-bold text-stone-800 mb-6">{editing ? 'Edit Entry' : 'New Journal Entry'}</h2>

        {error && <div className="bg-blush-50 border border-blush-200 text-blush-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Title <span className="text-stone-400 font-normal">(optional)</span></label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Give your entry a title..." className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">How are you feeling?</label>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map(m => (
                <button key={m.key} type="button" onClick={() => setForm(p => ({ ...p, mood: m.key }))}
                  className={`mood-btn ${form.mood === m.key ? 'selected' : ''}`}>
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-stone-600">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Write freely... <span className="text-blush-400">*</span></label>
            <textarea required value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="What's on your mind today? There are no rules here — just write." className="input-field resize-none" rows={12} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setView('list')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-warm">
              {saving ? 'Saving...' : editing ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
