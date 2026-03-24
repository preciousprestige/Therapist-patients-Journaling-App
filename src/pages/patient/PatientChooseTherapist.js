import React, { useEffect, useState } from 'react';
import { usersAPI } from '../../services/api';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RiUserHeartLine, RiCheckLine } from 'react-icons/ri';

export default function PatientChooseTherapist() {
  const { user } = useAuth();
  const [therapists, setTherapists] = useState([]);
  const [current, setCurrent] = useState(user?.therapist || null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const r = await usersAPI.getTherapists();
        setTherapists(r.data || []);
      } catch { }
      setLoading(false);
    };
    load();
  }, []);

  const handleSelect = async (therapistId) => {
    setSaving(therapistId); setSuccess('');
    try {
      await api.put('/users/choose-therapist', { therapistId });
      setCurrent(therapistId);
      const updated = { ...user, therapist: therapistId };
      localStorage.setItem('user', JSON.stringify(updated));
      setSuccess(therapistId);
      setTimeout(() => setSuccess(''), 3000);
    } catch { }
    setSaving('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-800">Choose Your Therapist</h1>
        <p className="text-stone-500 text-sm mt-1">Select the therapist you'd like to work with</p>
      </div>

      {current && (
        <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <RiCheckLine className="text-sage-600 text-lg flex-shrink-0" />
          <p className="text-sage-700 text-sm font-semibold">You have a therapist assigned. You can change anytime below.</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-stone-100 animate-pulse" />)}</div>
      ) : therapists.length === 0 ? (
        <div className="card p-12 text-center">
          <RiUserHeartLine className="text-5xl text-stone-200 mx-auto mb-4" />
          <p className="font-semibold text-stone-600">No therapists available yet</p>
          <p className="text-stone-400 text-sm mt-1">Check back later</p>
        </div>
      ) : (
        <div className="space-y-3">
          {therapists.map(t => {
            const isSelected = current === t._id || current?._id === t._id;
            const isSaving = saving === t._id;
            const isSuccess = success === t._id;
            return (
              <div key={t._id} className={`card p-5 flex items-center gap-4 transition-all ${isSelected ? 'border-sage-300 bg-sage-50' : 'hover:shadow-md'}`}>
                <div className="w-12 h-12 rounded-full bg-warm-100 flex items-center justify-center text-warm-700 font-bold font-display text-lg flex-shrink-0">
                  {t.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-stone-800">{t.name}</p>
                  <p className="text-sm text-stone-400">{t.email}</p>
                  {isSelected && <span className="text-xs text-sage-600 font-semibold">✓ Your current therapist</span>}
                </div>
                <button
                  onClick={() => handleSelect(t._id)}
                  disabled={isSelected || isSaving}
                  className={`flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                    isSelected ? 'bg-sage-100 text-sage-600 cursor-default' :
                    isSuccess ? 'bg-emerald-100 text-emerald-600' :
                    'bg-sage-600 hover:bg-sage-700 text-white'
                  }`}>
                  {isSaving ? 'Selecting...' : isSelected ? 'Selected ✓' : isSuccess ? 'Done!' : 'Select'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
