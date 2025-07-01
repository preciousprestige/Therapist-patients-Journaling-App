import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TherapistPortal from './pages/TherapistPortal';
import ContactTherapist from './components/ContactTherapist';
import ParticlesBackground from './components/ParticlesBackground';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-purple-950 text-white">
        
        <ParticlesBackground />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactTherapist />} />
          <Route path="/therapist" element={<TherapistPortal />} />
        </Routes>
        
      </div>
    </Router>
  );
}
