
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import RegistrationForm from './components/RegistrationForm';
import Logo from './components/Logo';

const App: React.FC = () => {
  return (
    <main 
      className="bg-dark-purple text-gray-100 min-h-screen relative overflow-hidden"
      role="main"
      aria-label="CETTEX Event Registration Platform"
    >
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 75 }}
          aria-label="3D Background Scene"
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8"
        role="region"
        aria-live="polite"
      >
        <div className="w-full max-w-4xl text-center bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-neon-green/40 shadow-2xl shadow-neon-green/30 animate-fade-in-up">
          <header className="mb-6 flex flex-col items-center" role="banner">
            <Logo
              size="lg"
              className="mb-4 animate-float"
              priority={true}
            />
            <p className="text-gray-300 mb-4 leading-relaxed">
              <span className="sr-only">Sous l'égide du Ministère de l'Industrie des Mines et de l'Energie</span>
              Sous l'égide du Ministère de l'Industrie des Mines et de l'Energie
            </p>
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold my-4 font-orbitron text-white drop-shadow-lg"
              style={{ 
                textShadow: '0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 30px #39FF14',
                filter: 'drop-shadow(0 0 8px rgba(57, 255, 20, 0.5))'
              }}
              aria-describedby="event-subtitle"
            >
              Cérémonie de Lancement
            </h1>
            <h2 
              id="event-subtitle"
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-200 leading-tight"
              role="doc-subtitle"
            >
              Infrastructure d'Appui à la Compétitivité Verte et Digitale du Textile-Habillement en Tunisie
            </h2>
          </header>

          <div 
            className="my-8 border-t border-b border-neon-green/40 py-6 flex flex-col md:flex-row justify-around items-center space-y-4 md:space-y-0"
            role="contentinfo"
            aria-label="Event Details"
          >
            <div className="flex items-center space-x-3 text-white">
              <CalendarIcon />
              <p className="text-base sm:text-lg font-medium">
                <span className="text-neon-green font-bold" aria-label="Date">Date:</span> 10 Décembre 2025
              </p>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <MapPinIcon />
              <p className="text-base sm:text-lg font-medium">
                <span className="text-neon-green font-bold" aria-label="Location">Lieu:</span> Siège du CETTEX
              </p>
            </div>
          </div>

          <section className="mt-8" aria-labelledby="registration-heading">
            <p className="text-gray-300 mb-6 leading-relaxed">
              Organisé par le Centre Technique du Textile « CETTEX » avec le concours de la GIZ
            </p>
            <h3 id="registration-heading" className="sr-only">
              Formulaire d'inscription
            </h3>
            <RegistrationForm />
          </section>
        </div>
      </div>
    </main>
  );
};

const CalendarIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-neon-green shrink-0"
    aria-hidden="true"
    focusable="false"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
);

const MapPinIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-neon-green shrink-0"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default App;
