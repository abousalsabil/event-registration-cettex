
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import RegistrationForm from './components/RegistrationForm';
import Logo from './components/Logo';
import Interactive3DMesh from './components/Interactive3DMesh';
import VolumetricBackground from './components/VolumetricBackground';

const App: React.FC = () => {
  return (
    <main 
      className="bg-cettex-gray text-cettex-gray-dark min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(248, 250, 252, 0.7), rgba(248, 250, 252, 0.7)), url('/Gemini_Generated_Image_xqo4lqxqo4lqxqo4.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
      role="main"
      aria-label="CETTEX Event Registration Platform"
    >
      {/* Volumetric Background Animation - Top Right Quarter */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 z-15 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <Suspense fallback={null}>
            <VolumetricBackground position={[0, 0, 0]} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 5]} color="#22d3ee" intensity={0.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Foreground 3D Animation - Top Left Quarter */}
      <div className="fixed top-0 left-0 w-1/2 h-1/2 z-20 pointer-events-none">
        <Canvas camera={{ position: [3, 3, 6], fov: 60 }}>
          <Suspense fallback={null}>
            <Interactive3DMesh 
              position={[0, 0, 0]} 
              scale={0.6}
              interactive={false}
            />
            <ambientLight intensity={0.6} />
            <pointLight position={[5, 5, 5]} color="#22d3ee" intensity={1.2} />
            <pointLight position={[-3, -3, 3]} color="#1e3a8a" intensity={0.8} />
          </Suspense>
        </Canvas>
      </div>

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
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8 lg:p-12"
        role="region"
        aria-live="polite"
      >
        <div className="w-full max-w-5xl text-center bg-transparent backdrop-blur-none p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl border border-cettex-cyan/10 shadow-2xl shadow-cettex-navy/5 animate-fade-in-up">
          <header className="mb-8 md:mb-10 flex flex-col items-center" role="banner">
            <Logo
              size="lg"
              className="mb-6 animate-float"
              priority={true}
            />
            <p className="text-white mb-6 leading-relaxed text-base sm:text-lg md:text-xl max-w-3xl bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="sr-only">Sous l'égide du Ministère de l'Industrie des Mines et de l'Energie</span>
              Sous l'égide du Ministère de l'Industrie des Mines et de l'Energie
            </p>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold my-6 text-white leading-tight bg-black/40 backdrop-blur-sm rounded-lg px-6 py-4 drop-shadow-lg"
              aria-describedby="event-subtitle"
            >
              Cérémonie de Lancement
            </h1>
            <h2
              id="event-subtitle"
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white leading-tight max-w-4xl bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3"
              role="doc-subtitle"
            >
              Infrastructure d'Appui à la Compétitivité Verte et Digitale du Textile-Habillement en Tunisie
            </h2>
          </header>

          <div
            className="my-8 md:my-10 border-t border-b border-cettex-cyan/30 py-6 md:py-8 flex flex-col lg:flex-row justify-center items-center space-y-4 lg:space-y-0 lg:space-x-12"
            role="contentinfo"
            aria-label="Event Details"
          >
            <div className="flex items-center space-x-3 text-white bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
              <CalendarIcon />
              <p className="text-base sm:text-lg md:text-xl font-medium">
                <span className="text-cettex-cyan font-bold" aria-label="Date">Date:</span> 10 Décembre 2025
              </p>
            </div>
            <div className="flex items-center space-x-3 text-white bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
              <MapPinIcon />
              <p className="text-base sm:text-lg md:text-xl font-medium">
                <span className="text-cettex-cyan font-bold" aria-label="Location">Lieu:</span> Siège du CETTEX
              </p>
            </div>
          </div>

          <section className="mt-8 md:mt-10" aria-labelledby="registration-heading">
            <p className="text-white mb-8 leading-relaxed text-base sm:text-lg md:text-xl max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3">
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
    className="text-cettex-cyan shrink-0"
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
    className="text-cettex-cyan shrink-0"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default App;
