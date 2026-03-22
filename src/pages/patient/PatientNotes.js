import React, { useEffect, useState } from 'react';
import { notesAPI } from '../../services/api';
import { RiFileTextLine } from 'react-icons/ri';

export default function PatientNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const r = await notesAPI.getAll(); setNotes(r.data || []); } catch { }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-stone-800">Therapist Notes</h1>
        <p className="text-stone-500 text-sm mt-1">Notes your therapist has shared with you from your sessions</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-28 bg-white rounded-2xl border border-stone-100 animate-pulse" />)}</div>
      ) : notes.length === 0 ? (
        <div className="card p-16 text-center">
          <RiFileTextLine className="text-5xl text-stone-200 mx-auto mb-4" />
          <h3 className="font-display font-semibold text-stone-600">No notes shared yet</h3>
          <p className="text-stone-400 text-sm mt-1">Your therapist's session notes will appear here once they share them with you</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map(n => (
            <div key={n._id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-sage-600 font-semibold mb-1">From your therapist</p>
                  <h3 className="font-display font-semibold text-stone-800 text-lg">{n.title || 'Session Note'}</h3>
                </div>
                <span className="text-xs bg-sage-50 text-sage-700 border border-sage-200 px-2.5 py-1 rounded-full font-semibold flex-shrink-0">Session</span>
              </div>
              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-wrap">{n.content}</p>
              <p className="text-xs text-stone-400 mt-4 pt-4 border-t border-stone-100">
                {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
