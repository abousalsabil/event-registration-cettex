/// <reference types="@react-three/fiber" />
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Interactive3DMesh from './Interactive3DMesh';

interface Interactive3DDemoProps {
  title?: string;
  description?: string;
  showTitle?: boolean;
  position?: [number, number, number];
}

const Interactive3DDemo: React.FC<Interactive3DDemoProps> = ({ 
  title = "Smart Textile Network",
  description = "Experience the interconnected structure of our smart textile infrastructure",
  showTitle = true,
  position = [0, 0, 0]
}) => {
  return (
    <div className="w-full h-96 relative">
      {/* Title and Description */}
      {showTitle && (
        <div className="absolute top-4 left-4 z-10 text-white">
          <h3 className="text-xl sm:text-2xl font-bold text-cettex-navy mb-2">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-cettex-gray-dark max-w-xs">
            {description}
          </p>
        </div>
      )}
      
      {/* 3D Canvas */}
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 50 }}
        className="rounded-lg"
      >
        <Suspense fallback={null}>
          <Interactive3DMesh 
            position={position}
            scale={1}
            interactive={true}
          />
          
          {/* Ambient lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} color="#22d3ee" intensity={1} />
          <pointLight position={[-5, -5, -5]} color="#1e3a8a" intensity={0.8} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Interactive3DDemo;