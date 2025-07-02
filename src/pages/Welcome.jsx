import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const isRegistered = localStorage.getItem('aid_registered');
    const hasPin = localStorage.getItem('aid_pin');

    const timer = setTimeout(() => {
      if (isRegistered && hasPin) {
        navigate('/pin');
      } else {
        navigate('/register');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl">
      Welcome to a SafeSpace 💭
    </div>
  );
}
