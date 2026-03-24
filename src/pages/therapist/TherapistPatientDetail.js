import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { journalAPI, notesAPI, moodAPI, carePackageAPI } from '../../services/api';
import { RiGiftLine, RiCheckLine } from 'react-icons/ri';

const MOOD_EMOJI = { great: '😄', good: '🙂', okay: '😐', low: '😔', terrible: '😢' };
const MOOD_COLOR = { great: 'bg-emerald-50 text-emerald-700', good: 'bg-sage-50 text-sage-700', okay: 'bg-amber-50 text-amber-700', low: 'bg-orange-50 text-orange-700', terrible: 'bg-blush-50 text-blush-700' };

export default function TherapistPatientDetail() {
  const { id } = useParams();
  const [journals, setJournals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('journals');
  const [noteModal, setNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', content: '', isPrivate: false });
  const [saving, setSaving] = useState(false);
  const [careModal, setCareModal] = useState(false);
  const [careMessage, setCareMessage] = useState('');
  const [sendingCare, setSendingCare] = useState(false);
  const [careSuccess, setCareSuccess] = useState('');

  const PRESET_MESSAGES = [
    "Great progress this week! You should be proud of the work you've been doing. Keep it up! 🌟",
    "I've noticed your mood has been improving — that's wonderful to see. You're doing amazing! 💪",
    "Thank you for being so open and honest in our sessions. Your courage to heal is truly inspiring. 🌿",
    "You've come so far. Remember to be kind to yourself today. You deserve rest and peace. 🌸",
  ];

  const load = async () => {
    try {
      const [j, n, m] = await Promise.all([
        journalAPI.getPatientJournals(id),
        notesAPI.getPatientNotes(id),
        moodAPI.getPatientMoods(id),
      ]);
      setJournals(j.data || []);
      setNotes(n.data || []);
      setMoods(m.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleSaveNote = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await notesAPI.create({ ...noteForm, patientId: id });
      setNoteModal(false); setNoteForm({ title: '', content: '', isPrivate: false }); load();
    } catch { }
    setSaving(false);
  };

  const handleSendCare = async () => {
    if (!careMessage.trim()) return;
    setSendingCare(true);
    try {
      await carePackageAPI.send({ patientId: id, message: careMessage });
      setCareSuccess('Care package sent! 🎁');
      setCareModal(false); setCareMessage('');
      setTimeout(() => setCareSuccess(''), 3000);
    } catch { }
    setSendingCare(false);
  };

  const TABS = [
    { key: 'journals', label: `Journals (${journals.length})` },
    { key: 'notes', label: `My Notes (${notes.length})` },
    { key: 'mood', label: `Mood (${moods.length})` },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/therapist/patients" className="text-stone-400 hover:text-stone-600 text-sm">← Back</Link>
          <span className="text-stone-300">/</span>
          <h1 className="font-display text-xl font-bold text-stone-800">Patient Detail</h1>
        </div>
        <div className="flex items-center gap-2">
          {careSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold">
              <RiCheckLine /> {careSuccess}
            </span>
          )}
          <button onClick={() => setCareModal(true)}
            className="flex items-center gap-2 bg-warm-500 hover:bg-warm-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
            <RiGiftLine /> Send Care Package
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t.key ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Journals Tab */}
      {tab === 'journals' && (
        <div className="space-y-3">
          {loading ? [1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-stone-100 animate-pulse" />) :
          journals.length === 0 ? <div className="card p-10 text-center"><p className="text-stone-400">No journal entries yet</p></div> :
          journals.map(j => (
            <div key={j._id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display font-semibold text-stone-800">{j.title || 'Untitled Entry'}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${MOOD_COLOR[j.mood] || 'bg-stone-50 text-stone-600'}`}>
                  {MOOD_EMOJI[j.mood]} {j.mood}
                </span>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">{j.content}</p>
              <p className="text-xs text-stone-400 mt-3">{j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Notes Tab */}
      {tab === 'notes' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setNoteModal(true)} className="btn-primary">+ Add Session Note</button>
          </div>
          <div className="space-y-3">
            {loading ? [1,2].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-stone-100 animate-pulse" />) :
            notes.length === 0 ? <div className="card p-10 text-center"><p className="text-stone-400">No session notes yet</p></div> :
            notes.map(n => (
              <div key={n._id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-semibold text-stone-800">{n.title || 'Session Note'}</h3>
                  {n.isPrivate && <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">Private</span>}
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{n.content}</p>
                <p className="text-xs text-stone-400 mt-3">{n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mood Tab */}
      {tab === 'mood' && (
        <div className="space-y-3">
          {loading ? [1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-2xl border border-stone-100 animate-pulse" />) :
          moods.length === 0 ? <div className="card p-10 text-center"><p className="text-stone-400">No mood check-ins yet</p></div> :
          moods.map(m => (
            <div key={m._id} className="card p-4 flex items-center gap-4">
              <span className="text-3xl">{MOOD_EMOJI[m.mood]}</span>
              <div className="flex-1">
                <p className="font-semibold capitalize text-sm text-stone-700">{m.mood}</p>
                {m.note && <p className="text-xs text-stone-500 mt-0.5">{m.note}</p>}
              </div>
              <p className="text-xs text-stone-400">{m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-PH') : '—'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      {noteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={() => setNoteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="font-display font-semibold text-stone-800 text-lg mb-4">Add Session Note</h3>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Title</label>
                <input value={noteForm.title} onChange={e => setNoteForm(p => ({ ...p, title: e.target.value }))} placeholder="Session date or topic" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Notes <span className="text-blush-400">*</span></label>
                <textarea required value={noteForm.content} onChange={e => setNoteForm(p => ({ ...p, content: e.target.value }))} placeholder="Write your session notes here..." className="input-field" rows={5} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={noteForm.isPrivate} onChange={e => setNoteForm(p => ({ ...p, isPrivate: e.target.checked }))} className="rounded" />
                <span className="text-sm text-stone-600">Private note (patient cannot see this)</span>
              </label>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setNoteModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Note'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Care Package Modal */}
      {careModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={() => setCareModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-warm-100 rounded-xl flex items-center justify-center">
                <RiGiftLine className="text-warm-600 text-xl" />
              </div>
              <h3 className="font-display font-semibold text-stone-800 text-lg">Send Care Package</h3>
            </div>

            <p className="text-sm text-stone-500 mb-4">Choose a preset message or write your own. The patient will see this on their dashboard.</p>

            {/* Preset messages */}
            <div className="space-y-2 mb-4">
              {PRESET_MESSAGES.map((msg, i) => (
                <button key={i} onClick={() => setCareMessage(msg)}
                  className={`w-full text-left text-sm p-3 rounded-xl border transition-all ${careMessage === msg ? 'border-warm-400 bg-warm-50 text-warm-800' : 'border-stone-200 hover:border-warm-300 text-stone-600'}`}>
                  {msg}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Or write a custom message</label>
              <textarea value={careMessage} onChange={e => setCareMessage(e.target.value)}
                placeholder="Write a personal message for your patient..."
                className="input-field resize-none" rows={3} />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => { setCareModal(false); setCareMessage(''); }} className="btn-secondary">Cancel</button>
              <button onClick={handleSendCare} disabled={sendingCare || !careMessage.trim()}
                className="flex items-center gap-2 bg-warm-500 hover:bg-warm-600 disabled:bg-warm-200 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                <RiGiftLine /> {sendingCare ? 'Sending...' : 'Send Care Package'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
