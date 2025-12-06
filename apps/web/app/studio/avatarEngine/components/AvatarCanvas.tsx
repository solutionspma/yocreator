'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useHelper } from '@react-three/drei';
import { useAvatarStore } from '../store';
import * as THREE from 'three';

// Humanoid mesh with morph targets
function HumanoidAvatar() {
  const { avatar, ui } = useAvatarStore();
  const meshRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  // Calculate body proportions from morphs
  const bodyProps = useMemo(() => {
    const gender = avatar.macro.gender / 100;
    const muscle = avatar.macro.muscle / 100;
    const weight = avatar.macro.weight / 100;
    const height = 1.4 + (avatar.macro.height / 100) * 0.6; // 1.4m to 2.0m
    
    // Torso
    const shoulderWidth = 0.35 + gender * 0.15 + muscle * 0.1;
    const chestDepth = 0.18 + muscle * 0.08 + weight * 0.05;
    const waistWidth = 0.25 + weight * 0.15 - gender * 0.05;
    const hipWidth = 0.3 + (1 - gender) * 0.1 + weight * 0.08;
    
    // Head
    const headSize = 0.18 + (avatar.face.headWidth / 100 - 0.5) * 0.04;
    
    // Limbs
    const armLength = 0.55 + (avatar.arms.armLength / 100 - 0.5) * 0.15;
    const legLength = 0.7 + (avatar.legs.legLength / 100 - 0.5) * 0.2;
    
    return { gender, muscle, weight, height, shoulderWidth, chestDepth, waistWidth, hipWidth, headSize, armLength, legLength };
  }, [avatar.macro, avatar.face, avatar.arms, avatar.legs]);

  // Skin color from materials
  const skinColor = useMemo(() => new THREE.Color(avatar.materials.skinTone), [avatar.materials.skinTone]);

  return (
    <group ref={meshRef} position={[0, -0.8, 0]} scale={bodyProps.height}>
      {/* Head */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <sphereGeometry args={[bodyProps.headSize, 32, 32]} />
        <meshStandardMaterial 
          color={skinColor} 
          roughness={0.6} 
          wireframe={ui.showWireframe}
        />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.12, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
      </mesh>

      {/* Torso - Upper */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[bodyProps.shoulderWidth, 0.35, bodyProps.chestDepth]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
      </mesh>

      {/* Torso - Middle */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[bodyProps.waistWidth + 0.05, 0.2, bodyProps.chestDepth - 0.02]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
      </mesh>

      {/* Torso - Lower (Hips) */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[bodyProps.hipWidth, 0.18, bodyProps.chestDepth]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
      </mesh>

      {/* Left Arm */}
      <group position={[-bodyProps.shoulderWidth / 2 - 0.05, 1.2, 0]}>
        {/* Upper arm */}
        <mesh position={[-0.12, -0.12, 0]} rotation={[0, 0, 0.2]} castShadow>
          <capsuleGeometry args={[0.04 + bodyProps.muscle * 0.02, 0.22, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
        {/* Forearm */}
        <mesh position={[-0.26, -0.35, 0]} rotation={[0, 0, 0.1]} castShadow>
          <capsuleGeometry args={[0.035, 0.2, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.32, -0.55, 0]} castShadow>
          <boxGeometry args={[0.06, 0.1, 0.03]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[bodyProps.shoulderWidth / 2 + 0.05, 1.2, 0]}>
        {/* Upper arm */}
        <mesh position={[0.12, -0.12, 0]} rotation={[0, 0, -0.2]} castShadow>
          <capsuleGeometry args={[0.04 + bodyProps.muscle * 0.02, 0.22, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.26, -0.35, 0]} rotation={[0, 0, -0.1]} castShadow>
          <capsuleGeometry args={[0.035, 0.2, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.32, -0.55, 0]} castShadow>
          <boxGeometry args={[0.06, 0.1, 0.03]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group position={[-bodyProps.hipWidth / 3, 0.62, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.06 + bodyProps.weight * 0.02, 0.3, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.58, 0]} castShadow>
          <capsuleGeometry args={[0.045, 0.28, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.82, 0.04]} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group position={[bodyProps.hipWidth / 3, 0.62, 0]}>
        {/* Upper leg */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.06 + bodyProps.weight * 0.02, 0.3, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.58, 0]} castShadow>
          <capsuleGeometry args={[0.045, 0.28, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.82, 0.04]} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} wireframe={ui.showWireframe} />
        </mesh>
      </group>

      {/* Eyes */}
      <mesh position={[-0.05, 1.58, 0.14]} castShadow>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={avatar.materials.eyeColor} />
      </mesh>
      <mesh position={[0.05, 1.58, 0.14]} castShadow>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={avatar.materials.eyeColor} />
      </mesh>

      {/* Hair (simple placeholder) */}
      {avatar.hair && avatar.hair !== 'bald' && (
        <mesh position={[0, 1.65, -0.02]} castShadow>
          <sphereGeometry args={[0.19, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial 
            color={avatar.materials.hairColor} 
            roughness={0.8}
            wireframe={ui.showWireframe}
          />
        </mesh>
      )}
    </group>
  );
}

// Grid floor
function Floor() {
  return (
    <group>
      <gridHelper args={[10, 20, '#3a3a5a', '#2a2a4a']} position={[0, -0.8, 0]} />
      <ContactShadows
        position={[0, -0.79, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </group>
  );
}

// Camera controller based on view
function CameraController() {
  const { ui } = useAvatarStore();
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (!controlsRef.current) return;
    
    const positions: Record<string, [number, number, number]> = {
      front: [0, 0.5, 3],
      side: [3, 0.5, 0],
      back: [0, 0.5, -3],
      face: [0, 1, 1.5],
      custom: [2, 1, 2],
    };
    
    const target = positions[ui.cameraView] || positions.front;
    const controls = controlsRef.current;
    
    // Smooth camera transition
    controls.object.position.lerp(new THREE.Vector3(...target), 0.05);
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      minDistance={1}
      maxDistance={10}
      target={[0, 0.5, 0]}
    />
  );
}

export default function AvatarCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#12121f']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.3} />
        <spotLight
          position={[0, 5, 0]}
          intensity={0.5}
          angle={0.5}
          penumbra={1}
        />

        {/* Environment for reflections */}
        <Environment preset="studio" />

        {/* Avatar */}
        <HumanoidAvatar />

        {/* Floor */}
        <Floor />

        {/* Camera Controls */}
        <CameraController />
      </Canvas>
    </div>
  );
}
