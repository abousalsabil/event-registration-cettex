/// <reference types="@react-three/fiber" />
import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Interactive3DMeshProps {
  position?: [number, number, number];
  scale?: number;
  interactive?: boolean;
}

const Interactive3DMesh: React.FC<Interactive3DMeshProps> = ({ 
  position = [0, 0, 0], 
  scale = 1,
  interactive = false 
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  // Create interwoven network geometry
  const networkGeometry = useMemo(() => {
    // Create a more complex interwoven structure
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.2, 200, 32);
    return geometry;
  }, []);

  // Enhanced shader for more pronounced data flow
  const networkMaterial = useMemo(() => {
    const vertexShader = `
      uniform float time;
      uniform float hoverEffect;
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normal;
        
        // Enhanced vertex displacement based on hover state
        vec3 pos = position;
        float displacement = sin(time + position.y * 4.0) * 0.03 * hoverEffect;
        pos += normal * displacement;
        
        // Add more complex movement for interactivity
        pos.x += sin(position.z * 3.0 + time * 2.0) * 0.02 * hoverEffect;
        pos.z += cos(position.x * 3.0 + time * 2.0) * 0.02 * hoverEffect;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform float hoverEffect;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        // Multi-layered flowing effects
        float flow1 = sin(vUv.x * 15.0 + time * 3.0) * 0.5 + 0.5;
        float flow2 = cos(vPosition.y * 5.0 + time * 2.5) * 0.5 + 0.5;
        float flow3 = sin(vPosition.z * 8.0 + time * 1.5) * 0.5 + 0.5;
        
        // Enhanced movement with hover effect
        float intensity = (flow1 * flow2 * flow3);
        intensity += hoverEffect * 0.3;
        
        // Color transitions between three brand colors
        vec3 color = mix(color1, color2, intensity);
        color = mix(color, color3, sin(time + vPosition.x) * 0.5 + 0.5);
        
        // Enhanced pulsating effect
        float pulse = sin(time * 4.0) * 0.2 + 0.8;
        pulse += hoverEffect * 0.4;
        
        // Lighting calculation
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float lighting = max(0.3, dot(vNormal, lightDir));
        
        gl_FragColor = vec4(color * lighting * pulse, 0.9);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        hoverEffect: { value: 0 },
        color1: { value: new THREE.Color('#22d3ee') }, // CETTEX cyan
        color2: { value: new THREE.Color('#67e8f9') }, // Light cyan
        color3: { value: new THREE.Color('#1e3a8a') }, // CETTEX navy
      },
      transparent: true,
      wireframe: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Animation and interaction
  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      // Base rotation
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      
      // Hover-based scaling
      const targetScale = hovered ? 1.2 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Update shader uniforms
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.hoverEffect.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.hoverEffect.value,
        hovered ? 1.0 : 0.0,
        0.1
      );
      
      // Enhanced rotation when hovered
      if (hovered) {
        meshRef.current.rotation.y += delta * 0.6;
        meshRef.current.rotation.z += delta * 0.2;
      }
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group 
      ref={meshRef} 
      position={position} 
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Main network structure */}
      <mesh geometry={networkGeometry} material={networkMaterial} />
      
      {/* Secondary overlapping structure */}
      <mesh 
        geometry={networkGeometry} 
        material={networkMaterial.clone()}
        scale={[1.1, 1.1, 1.1]}
        rotation={[Math.PI * 0.5, Math.PI * 0.3, 0]}
      />
      
      {/* Inner core structure */}
      <mesh 
        geometry={networkGeometry} 
        material={networkMaterial.clone()}
        scale={[0.8, 0.8, 0.8]}
        rotation={[0, Math.PI * 0.25, Math.PI * 0.5]}
      />
      
      {/* Connection nodes */}
      <NetworkNodes geometry={networkGeometry} />
      
      {/* Interactive controls (only if enabled) */}
      {interactive && (
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      )}
    </group>
  );
};

// Enhanced network nodes component
const NetworkNodes: React.FC<{ geometry: THREE.BufferGeometry }> = ({ geometry }) => {
  const nodesRef = useRef<THREE.Points>(null!);
  const [hovered, setHovered] = useState(false);
  
  // Generate strategic connection points
  const nodePositions = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    
    // Create nodes at key network intersections
    for (let i = 0; i < 32; i++) {
      const theta = (i / 32) * Math.PI * 2;
      const phi = Math.acos(1 - 2 * (i / 32));
      
      const radius = 2.2 + Math.sin(i * 0.5) * 0.3;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      positions.push(x, y, z);
      
      // Color gradient based on position
      const color = new THREE.Color().setHSL(0.55 + i * 0.01, 0.9, 0.7);
      colors.push(color.r, color.g, color.b);
    }
    
    const nodesGeometry = new THREE.BufferGeometry();
    nodesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    nodesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return nodesGeometry;
  }, []);

  useFrame((state) => {
    if (nodesRef.current) {
      const material = nodesRef.current.material as THREE.PointsMaterial;
      const time = state.clock.elapsedTime;
      
      // Pulsating effect with data flow
      material.opacity = 0.4 + Math.sin(time * 3.0) * 0.3;
      material.size = 0.06 + Math.sin(time * 2.0) * 0.02;
      
      // Rotation matching main mesh
      nodesRef.current.rotation.y = time * 0.4;
    }
  });

  return (
    <points 
      ref={nodesRef} 
      geometry={nodePositions}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
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

export default Interactive3DMesh;