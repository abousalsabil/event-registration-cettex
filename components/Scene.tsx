/// <reference types="@react-three/fiber" />
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const Scene: React.FC = () => {
  return (
    <>
      {/* Ambient lighting for subtle illumination */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} color="#22d3ee" intensity={0.8} />
      
      {/* Main 3D interwoven wireframe structure */}
      <InterwovenWireframe position={[0, 0, 0]} />
      
      {/* Subtle background stars for depth */}
      <Stars 
        radius={80} 
        depth={40} 
        count={2000} 
        factor={2} 
        saturation={0} 
        fade 
        speed={0.5} 
      />
    </>
  );
};

interface InterwovenWireframeProps {
  position: [number, number, number];
}

const InterwovenWireframe: React.FC<InterwovenWireframeProps> = ({ position }) => {
  const meshRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  // Create interwoven wireframe geometry using custom shaders
  const wireframeGeometry = useMemo(() => {
    const geometry = new THREE.TorusKnotGeometry(2, 0.3, 128, 32);
    return geometry;
  }, []);

  // Custom shader for data flow effect
  const wireframeMaterial = useMemo(() => {
    const vertexShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        
        // Add subtle pulsing to the vertices
        vec3 pos = position;
        pos += normal * sin(time + position.y * 2.0) * 0.02;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Create flowing light effect along the wireframe
        float flow = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
        float wave = sin(vPosition.y * 3.0 + time) * 0.3 + 0.7;
        
        vec3 color = mix(color1, color2, flow * wave);
        
        // Add pulsating effect
        float pulse = sin(time * 3.0) * 0.1 + 0.9;
        color *= pulse;
        
        gl_FragColor = vec4(color, 0.8);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#22d3ee') }, // CETTEX cyan
        color2: { value: new THREE.Color('#1e3a8a') }, // CETTEX navy
      },
      transparent: true,
      wireframe: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      // Smooth Y-axis rotation
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      
      // Update shader time
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      
      // Subtle scale pulsing
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Main interwoven structure */}
      <mesh geometry={wireframeGeometry} material={wireframeMaterial} />
      
      {/* Additional overlapping structures for depth */}
      <mesh 
        geometry={wireframeGeometry} 
        material={wireframeMaterial.clone()}
        scale={[1.1, 1.1, 1.1]}
        rotation={[Math.PI * 0.25, Math.PI * 0.25, 0]}
      />
      
      {/* Inner detail structure */}
      <mesh 
        geometry={wireframeGeometry} 
        material={wireframeMaterial.clone()}
        scale={[0.7, 0.7, 0.7]}
        rotation={[Math.PI * 0.5, 0, Math.PI * 0.25]}
      />
      
      {/* Connection points (small spheres at intersections) */}
      <ConnectionPoints geometry={wireframeGeometry} />
    </group>
  );
};

// Component for connection points
const ConnectionPoints: React.FC<{ geometry: THREE.BufferGeometry }> = ({ geometry }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  
  // Generate connection points based on geometry
  const connectionPoints = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    
    // Create connection points at key intersections
    for (let i = 0; i < 20; i++) {
      const theta = (i / 20) * Math.PI * 2;
      const phi = (i / 20) * Math.PI;
      
      const x = Math.sin(phi) * Math.cos(theta) * 2.5;
      const y = Math.cos(phi) * 2.5;
      const z = Math.sin(phi) * Math.sin(theta) * 2.5;
      
      positions.push(x, y, z);
      
      // Color gradient from cyan to navy
      const color = new THREE.Color().setHSL(0.55 + i * 0.02, 0.8, 0.6);
      colors.push(color.r, color.g, color.b);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geometry;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Pulsating effect for connection points
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2.0) * 0.2;
    }
  });

  return (
    <points ref={pointsRef} geometry={connectionPoints}>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export default Scene;