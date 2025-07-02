import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import TherapistPortal from './pages/TherapistPortal';
import ContactTherapist from './components/ContactTherapist';
import Login from './pages/Login';
import PinUnlock from './pages/PinUnlock';
import Resources from './pages/Resources';
import Register from './pages/Register';
import TherapistRegister from './pages/TherapistRegister';
import Welcome from './pages/Welcome';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pin" element={<PinUnlock />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<ContactTherapist />} />
        <Route path="/therapist-login" element={<TherapistPortal />} />
        <Route path="/therapist-register" element={<TherapistRegister />} />
      </Routes>
    </BrowserRouter>
  );
}
