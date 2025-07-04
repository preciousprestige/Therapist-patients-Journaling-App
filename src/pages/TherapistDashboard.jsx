import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';
import ChatBox from '../components/ChatBox';

export default function TherapistDashboard() {
  const [therapist, setTherapist] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  const [patients] = useState([
    { name: 'John D.', risk: 9, note: "Feeling overwhelmed...", lastActive: "2 hours ago" },
    { name: 'Sarah M.', risk: 5, note: "Tired but okay", lastActive: "1 day ago" },
    { name: 'David L.', risk: 2, note: "Feeling better today", lastActive: "3 days ago" },
    { name: 'Emily P.', risk: 8, note: "Panic attacks increasing", lastActive: "4 hours ago" },
    { name: 'Carlos B.', risk: 4, note: "Mood dropping", lastActive: "2 days ago" },
  ]);

  const highRisk = patients.filter(p => p.risk >= 7);
  const moderateRisk = patients.filter(p => p.risk >= 4 && p.risk <= 6);
  const lowRisk = patients.filter(p => p.risk <= 3);

  useEffect(() => {
    const savedTherapist = JSON.parse(localStorage.getItem('aid_therapist'));
    if (savedTherapist) {
      setTherapist(savedTherapist);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-purple-900 via-purple-950 to-black text-white">
      
      <ParticlesBackground />

      <h1 className="text-3xl sm:text-4xl font-bold text-purple-300 mt-10 mb-2">
        Therapist Dashboard
      </h1>

      {therapist && (
        <p className="text-purple-200 mb-6 text-center">
          Welcome, {therapist.fullName} ({therapist.email})
        </p>
      )}

      <div className="w-[90%] max-w-5xl space-y-8">

        {highRisk.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-red-500 mb-2">🔴 High Risk ({highRisk.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {highRisk.map((p, idx) => (
                <PatientCard key={idx} patient={p} onChat={() => setActiveChat(p.name)} />
              ))}
            </div>
          </div>
        )}

        {moderateRisk.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-yellow-400 mb-2">🟡 Moderate Risk ({moderateRisk.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {moderateRisk.map((p, idx) => (
                <PatientCard key={idx} patient={p} onChat={() => setActiveChat(p.name)} />
              ))}
            </div>
          </div>
        )}

        {lowRisk.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-green-400 mb-2">🟢 Low Risk ({lowRisk.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {lowRisk.map((p, idx) => (
                <PatientCard key={idx} patient={p} onChat={() => setActiveChat(p.name)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {activeChat && (
        <ChatBox
          user={activeChat}
          pov="therapist"
          storageKey={`chat_${activeChat}`}
          onClose={() => setActiveChat(null)}
        />
      )}

      <Link to="/login" className="fixed top-4 right-4 text-purple-300 underline text-sm">Logout</Link>
    </div>
  );
}

function PatientCard({ patient, onChat }) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-purple-500 text-center">
      <h3 className="font-bold text-lg">{patient.name}</h3>
      <p className={`font-semibold ${patient.risk >= 7 ? 'text-red-400' : patient.risk >= 4 ? 'text-yellow-300' : 'text-green-300'}`}>
        Risk: {patient.risk}/10
      </p>
      <p className="text-sm mt-2">{patient.note}</p>
      <p className="text-xs text-purple-300 mt-1">Last Active: {patient.lastActive}</p>
      <div className="flex space-x-2 justify-center mt-3">
        <button className="px-3 py-1 bg-purple-700 rounded">📞 Call</button>
        <button className="px-3 py-1 bg-purple-700 rounded" onClick={onChat}>💬 Chat</button>
        <button className="px-3 py-1 bg-purple-700 rounded">📧 Email</button>
      </div>
    </div>
  );
}
