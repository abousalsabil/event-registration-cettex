
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import RegistrationForm from './components/RegistrationForm';

const App: React.FC = () => {
  return (
    <main className="bg-dark-purple text-gray-100 min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl text-center bg-black/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-neon-green/30 shadow-2xl shadow-neon-green/20 animate-fade-in-up">
          <header className="mb-6">
            <p className="text-gray-400 mb-4">Sous l’égide du Ministère de l’Industrie des Mines et de l’Energie</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold my-4 font-orbitron text-white" style={{ textShadow: '0 0 10px #39FF14' }}>
              Cérémonie de Lancement
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-300">
              Infrastructure d'Appui à la Compétitivité Verte et Digitale du Textile-Habillement en Tunisie
            </h2>
          </header>

          <div className="my-8 border-t border-b border-neon-green/30 py-4 flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <CalendarIcon />
              <p className="text-base sm:text-lg"><span className="font-bold">Date:</span> 10 Décembre 2025</p>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon />
              <p className="text-base sm:text-lg"><span className="font-bold">Lieu:</span> Siège du CETTEX</p>
            </div>
          </div>

          <section className="mt-8">
            <p className="text-gray-400 mb-2">Organisé par le Centre Technique du Textile « CETTEX » avec le concours de la GIZ</p>
            <RegistrationForm />
          </section>
        </div>
      </div>
    </main>
  );
};

const CalendarIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-green">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
);

const MapPinIcon: React.FC = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neon-green">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>
   </svg>
);

export default App;
