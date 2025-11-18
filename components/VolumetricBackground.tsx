/// <reference types="@react-three/fiber" />
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VolumetricBackgroundProps {
  position?: [number, number, number];
}

const VolumetricBackground: React.FC<VolumetricBackgroundProps> = ({ position = [0, 0, 0] }) => {
  const meshRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  // Create volumetric particle system
  const particleSystem = useMemo(() => {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Create particles in a large volume
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position particles in a large sphere
      const radius = Math.random() * 20 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi);
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Create gradient from blue to cyan
      const colorPosition = Math.random();
      const blueToCyanGradient = new THREE.Color().lerpColors(
        new THREE.Color('#1e3a8a'), // CETTEX navy
        new THREE.Color('#22d3ee'), // CETTEX cyan
        colorPosition
      );
      
      colors[i3] = blueToCyanGradient.r;
      colors[i3 + 1] = blueToCyanGradient.g;
      colors[i3 + 2] = blueToCyanGradient.b;
      
      // Large particle size but low opacity later
      sizes[i] = Math.random() * 3 + 2; // 2-5 pixels
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, []);

  // Custom shader material for volumetric effect
  const particleMaterial = useMemo(() => {
    const vertexShader = `
      attribute float size;
      uniform float time;
      varying vec3 vColor;
      varying float vOpacity;
      
      void main() {
        vColor = color;
        
        vec3 pos = position;
        
        // Add subtle warping effect
        pos.x += sin(pos.y * 0.1 + time * 0.5) * 0.5;
        pos.y += cos(pos.x * 0.1 + time * 0.3) * 0.3;
        pos.z += sin(pos.x * 0.05 + time * 0.2) * 0.2;
        
        // Calculate opacity based on distance and time
        float distance = length(position) / 15.0;
        vOpacity = (1.0 - distance) * 0.3;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform float time;
      varying vec3 vColor;
      varying float vOpacity;
      
      void main() {
        // Create soft particle edges
        vec2 center = gl_PointCoord - vec2(0.5);
        float distance = length(center);
        
        if (distance > 0.5) discard;
        
        // Soft edge with glowing effect
        float alpha = (1.0 - distance * 2.0) * vOpacity;
        alpha *= 0.6 + 0.4 * sin(time + distance * 10.0);
        
        gl_FragColor = vec4(vColor, alpha);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      // Slow rotation of the entire particle system
      meshRef.current.rotation.y += delta * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.03) * 0.05;
      
      // Update shader time
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      
      // Very subtle drift movement
      const driftX = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
      const driftY = Math.cos(state.clock.elapsedTime * 0.008) * 0.1;
      meshRef.current.position.set(driftX, driftY, 0);
    }
  });

  return (
    <points ref={meshRef} position={position} geometry={particleSystem}>
      <shaderMaterial ref={materialRef} args={[particleMaterial]} />
    </points>
  );
};

export default VolumetricBackground;