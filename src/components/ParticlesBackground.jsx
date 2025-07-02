import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function ParticlesBackground() {
  
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: 'transparent' },
        particles: {
          color: { value: ['#ffffff', '#ff4d4d', '#b388ff'] },
          links: { enable: true, color: '#fff' },
          move: { enable: true, speed: 1 },
          size: { value: 3 },
          number: { value: 50 },
          opacity: { value: 0.7 },
        },
      }}
      className="absolute inset-0 z-0"
    />
  );
}
