import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { RiUserLine, RiLockLine, RiCheckLine } from 'react-icons/ri';

export default function TherapistSettings() {
  const { user, login } = useAuth();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState({ current: '', newPw: '', confirm: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true); setProfileMsg(''); setProfileErr('');
    try {
      const res = await api.put(`/users/${user._id}`, { name: profile.name, email: profile.email });
      // Update local storage
      const updated = { ...user, name: res.data.name, email: res.data.email };
      localStorage.setItem('user', JSON.stringify(updated));
      window.location.reload(); // refresh to reflect new name in sidebar
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Failed to update profile');
    }
    setSavingProfile(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwMsg(''); setPwErr('');
    if (password.newPw.length < 6) return setPwErr('Password must be at least 6 characters');
    if (password.newPw !== password.confirm) return setPwErr('Passwords do not match');
    setSavingPw(true);
    try {
      await api.put(`/users/${user._id}`, { password: password.newPw });
      setPwMsg('Password updated successfully');
      setPassword({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      setPwErr(err.response?.data?.message || 'Failed to update password');
    }
    setSavingPw(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-stone-800">Settings</h1>
        <p className="text-stone-500 text-sm mt-1">Manage your account details</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center text-warm-700 font-bold font-display text-2xl flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-display font-semibold text-stone-800 text-lg">{user?.name}</p>
          <p className="text-stone-400 text-sm">{user?.email}</p>
          <span className="text-xs bg-sage-50 text-sage-700 border border-sage-200 px-2.5 py-0.5 rounded-full font-semibold capitalize mt-1 inline-block">{user?.role}</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-sage-50 rounded-lg flex items-center justify-center">
            <RiUserLine className="text-sage-600" />
          </div>
          <h2 className="font-display font-semibold text-stone-800">Profile Information</h2>
        </div>

        {profileMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">
            <RiCheckLine /> {profileMsg}
          </div>
        )}
        {profileErr && (
          <div className="bg-blush-50 border border-blush-200 text-blush-700 text-sm px-4 py-3 rounded-xl mb-4">{profileErr}</div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full Name</label>
            <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              placeholder="Your full name" className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Email Address</label>
            <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              placeholder="your@email.com" className="input-field" required />
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" disabled={savingProfile} className="btn-primary">
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-sage-50 rounded-lg flex items-center justify-center">
            <RiLockLine className="text-sage-600" />
          </div>
          <h2 className="font-display font-semibold text-stone-800">Change Password</h2>
        </div>

        {pwMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">
            <RiCheckLine /> {pwMsg}
          </div>
        )}
        {pwErr && (
          <div className="bg-blush-50 border border-blush-200 text-blush-700 text-sm px-4 py-3 rounded-xl mb-4">{pwErr}</div>
        )}

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">New Password</label>
            <input type="password" value={password.newPw} onChange={e => setPassword(p => ({ ...p, newPw: e.target.value }))}
              placeholder="At least 6 characters" className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">Confirm New Password</label>
            <input type="password" value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))}
              placeholder="Repeat new password" className="input-field" required />
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" disabled={savingPw} className="btn-primary">
              {savingPw ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
