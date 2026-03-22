import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import { RiUserHeartLine, RiSearchLine } from 'react-icons/ri';

export default function TherapistPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try { const r = await usersAPI.getMyPatients(); setPatients(r.data || []); } catch { }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-stone-800">My Patients</h1>
        <p className="text-stone-500 text-sm mt-1">Patients assigned to you</p>
      </div>

      <div className="relative mb-4">
        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." className="input-field pl-9" />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-stone-100 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <RiUserHeartLine className="text-4xl text-stone-300 mx-auto mb-3" />
          <p className="font-semibold text-stone-600">No patients found</p>
          <p className="text-sm text-stone-400 mt-1">Patients will appear here once assigned to you</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <Link key={p._id} to={`/therapist/patients/${p._id}`}
              className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-warm-100 flex items-center justify-center text-warm-700 font-bold font-display text-lg flex-shrink-0">
                {p.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800">{p.name}</p>
                <p className="text-sm text-stone-400">{p.email}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs bg-sage-50 text-sage-700 border border-sage-200 px-2.5 py-1 rounded-full font-semibold">View Profile →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
