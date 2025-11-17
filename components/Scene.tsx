/// <reference types="@react-three/fiber" />
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Stars } from '@react-three/drei';
import * as THREE from 'three';

const Scene: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#39FF14" intensity={1.5} />
      <pointLight position={[-10, -10, -10]} color="#6a0dad" intensity={1} />
      
      <RotatingMesh position={[-2, 0, 0]} rotationSpeed={0.2} />
      <RotatingMesh position={[2, 0, 0]} rotationSpeed={-0.3} args={[1.2, 1]}/>

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
};


interface RotatingMeshProps {
    position: [number, number, number];
    rotationSpeed: number;
    args?: [number, number];
}

const RotatingMesh: React.FC<RotatingMeshProps> = ({ position, rotationSpeed, args=[1, 1] }) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * rotationSpeed * 0.5;
            meshRef.current.rotation.y += delta * rotationSpeed;
        }
    });

    return (
        <Icosahedron ref={meshRef} args={args} position={position}>
            <meshStandardMaterial 
                color="#39FF14" 
                wireframe={true}
                emissive="#39FF14"
                emissiveIntensity={0.5}
            />
        </Icosahedron>
    )
}

export default Scene;