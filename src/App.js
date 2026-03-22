import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Layout from './components/Layout';

import TherapistDashboard from './pages/therapist/TherapistDashboard';
import TherapistPatients from './pages/therapist/TherapistPatients';
import TherapistPatientDetail from './pages/therapist/TherapistPatientDetail';
import TherapistNotes from './pages/therapist/TherapistNotes';
import TherapistMessages from './pages/therapist/TherapistMessages';
import TherapistSettings from './pages/therapist/TherapistSettings';

import PatientDashboard from './pages/patient/PatientDashboard';
import PatientJournal from './pages/patient/PatientJournal';
import PatientMood from './pages/patient/PatientMood';
import PatientMoodChart from './pages/patient/PatientMoodChart';
import PatientNotes from './pages/patient/PatientNotes';
import PatientMessages from './pages/patient/PatientMessages';
import PatientSettings from './pages/patient/PatientSettings';
import PatientChooseTherapist from './pages/patient/PatientChooseTherapist';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-amber-50/30">
      <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'therapist') return <Navigate to="/therapist/dashboard" replace />;
  return <Navigate to="/patient/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<RoleRedirect />} />

      <Route path="/therapist" element={<ProtectedRoute roles={['therapist']}><Layout role="therapist" /></ProtectedRoute>}>
        <Route path="dashboard" element={<TherapistDashboard />} />
        <Route path="patients" element={<TherapistPatients />} />
        <Route path="patients/:id" element={<TherapistPatientDetail />} />
        <Route path="notes" element={<TherapistNotes />} />
        <Route path="messages" element={<TherapistMessages />} />
        <Route path="settings" element={<TherapistSettings />} />
      </Route>

      <Route path="/patient" element={<ProtectedRoute roles={['patient']}><Layout role="patient" /></ProtectedRoute>}>
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="journal" element={<PatientJournal />} />
        <Route path="mood" element={<PatientMood />} />
        <Route path="mood-trends" element={<PatientMoodChart />} />
        <Route path="notes" element={<PatientNotes />} />
        <Route path="messages" element={<PatientMessages />} />
        <Route path="therapist" element={<PatientChooseTherapist />} />
        <Route path="settings" element={<PatientSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
