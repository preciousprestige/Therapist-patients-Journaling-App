import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messageAPI, usersAPI } from '../services/api';
import {
  RiDashboardLine, RiUserHeartLine, RiBookOpenLine, RiEmotionLine,
  RiFileTextLine, RiMessage2Line, RiLogoutBoxLine, RiMenuLine,
  RiCloseLine, RiLeafLine, RiSettings3Line, RiLineChartLine, RiUserSearchLine
} from 'react-icons/ri';

const NAV = {
  therapist: [
    { to: '/therapist/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
    { to: '/therapist/patients', icon: RiUserHeartLine, label: 'My Patients' },
    { to: '/therapist/notes', icon: RiFileTextLine, label: 'Session Notes' },
    { to: '/therapist/messages', icon: RiMessage2Line, label: 'Messages', badge: true },
    { to: '/therapist/settings', icon: RiSettings3Line, label: 'Settings' },
  ],
  patient: [
    { to: '/patient/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
    { to: '/patient/journal', icon: RiBookOpenLine, label: 'My Journal' },
    { to: '/patient/mood', icon: RiEmotionLine, label: 'Mood Check-in' },
    { to: '/patient/mood-trends', icon: RiLineChartLine, label: 'Mood Trends' },
    { to: '/patient/notes', icon: RiFileTextLine, label: 'Therapist Notes' },
    { to: '/patient/messages', icon: RiMessage2Line, label: 'Messages', badge: true },
    { to: '/patient/therapist', icon: RiUserSearchLine, label: 'My Therapist' },
    { to: '/patient/settings', icon: RiSettings3Line, label: 'Settings' },
  ],
};

export default function Layout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navItems = NAV[role] || [];

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const contacts = role === 'therapist'
          ? await usersAPI.getMyPatients()
          : await usersAPI.getTherapists();
        let total = 0;
        for (const contact of (contacts.data || []).slice(0, 5)) {
          const msgs = await messageAPI.getConversation(contact._id);
          const unread = (msgs.data || []).filter(m =>
            (m.sender?._id !== user?._id && m.sender !== user?._id) && !m.read
          ).length;
          total += unread;
        }
        setUnreadCount(total);
      } catch { }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [role, user]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-sage-600 rounded-xl flex items-center justify-center">
            <RiLeafLine className="text-white text-lg" />
          </div>
          <div>
            <p className="font-display font-semibold text-stone-800 text-base leading-none">MindBridge</p>
            <p className="text-xs text-stone-400 mt-0.5">Journaling & Therapy</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-warm-100 flex items-center justify-center text-warm-700 font-bold text-sm font-display">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-800 truncate">{user?.name}</p>
            <p className="text-xs text-sage-600 font-medium capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}>
            <Icon className="text-lg flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && unreadCount > 0 && (
              <span className="w-5 h-5 bg-blush-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-stone-100">
        <button onClick={handleLogout} className="sidebar-link w-full text-blush-500 hover:bg-blush-50 hover:text-blush-600">
          <RiLogoutBoxLine className="text-lg" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-amber-50/20 overflow-hidden">
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-stone-100 flex-shrink-0">
        <SidebarContent />
      </aside>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-white flex flex-col shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600">
              <RiCloseLine className="text-xl" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-stone-100">
          <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg hover:bg-stone-100">
            <RiMenuLine className="text-xl text-stone-600" />
          </button>
          <span className="font-display font-semibold text-stone-800">MindBridge</span>
          {unreadCount > 0 && (
            <span className="ml-auto w-5 h-5 bg-blush-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
