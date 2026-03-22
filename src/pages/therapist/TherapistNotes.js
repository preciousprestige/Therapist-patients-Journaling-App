import React, { useEffect, useState } from 'react';
import { notesAPI, usersAPI } from '../../services/api';
import { RiFileTextLine, RiAddLine } from 'react-icons/ri';

export default function TherapistNotes() {
  const [notes, setNotes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ patientId: '', title: '', content: '', isPrivate: false });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    try {
      const [n, p] = await Promise.all([notesAPI.getAll(), usersAPI.getMyPatients()]);
      setNotes(n.data || []); setPatients(p.data || []);
    } catch { }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await notesAPI.create(form);
      setModal(false); setForm({ patientId: '', title: '', content: '', isPrivate: false }); load();
    } catch { }
    setSaving(false);
  };

  const filtered = filter === 'all' ? notes : notes.filter(n => n.patient?._id === filter);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-800">Session Notes</h1>
          <p className="text-stone-500 text-sm mt-1">Your notes across all patients</p>
        </div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-1.5"><RiAddLine />New Note</button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => setFilter('all')} className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${filter === 'all' ? 'bg-sage-600 text-white border-sage-600' : 'bg-white text-stone-600 border-stone-200 hover:border-sage-300'}`}>All Patients</button>
        {patients.map(p => (
          <button key={p._id} onClick={() => setFilter(p._id)} className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${filter === p._id ? 'bg-sage-600 text-white border-sage-600' : 'bg-white text-stone-600 border-stone-200 hover:border-sage-300'}`}>{p.name}</button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-stone-100 animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <RiFileTextLine className="text-4xl text-stone-300 mx-auto mb-3" />
            <p className="font-semibold text-stone-600">No session notes yet</p>
            <p className="text-sm text-stone-400 mt-1">Add your first session note</p>
          </div>
        ) : filtered.map(n => (
          <div key={n._id} className="card p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs text-sage-600 font-semibold mb-1">{n.patient?.name || '—'}</p>
                <h3 className="font-display font-semibold text-stone-800">{n.title || 'Session Note'}</h3>
              </div>
              {n.isPrivate && <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full flex-shrink-0">Private</span>}
            </div>
            <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">{n.content}</p>
            <p className="text-xs text-stone-400 mt-3">{n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="font-display font-semibold text-stone-800 text-lg mb-4">New Session Note</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Patient <span className="text-blush-400">*</span></label>
                <select value={form.patientId} onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))} className="input-field" required>
                  <option value="">Select patient</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Session Mar 22" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Notes <span className="text-blush-400">*</span></label>
                <textarea required value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Write session notes..." className="input-field" rows={5} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPrivate} onChange={e => setForm(p => ({ ...p, isPrivate: e.target.checked }))} />
                <span className="text-sm text-stone-600">Private note (patient cannot see this)</span>
              </label>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Note'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
