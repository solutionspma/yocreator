'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  Html,
  useProgress,
  Stage,
  PresentationControls
} from '@react-three/drei';
import * as THREE from 'three';
import { useAvatarStore } from '../store';

// ============================================
// OMNI-AVATAR ENGINE - 3D CANVAS
// ============================================

// Loading Component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ 
        background: 'rgba(0,0,0,0.8)', 
        padding: '20px 40px', 
        borderRadius: '12px',
        color: '#fff',
        fontFamily: 'system-ui'
      }}>
        <div style={{ fontSize: '14px', marginBottom: '8px' }}>Loading Avatar...</div>
        <div style={{ 
          background: '#333', 
          borderRadius: '4px', 
          overflow: 'hidden',
          height: '8px',
          width: '200px'
        }}>
          <div style={{ 
            background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
            height: '100%',
            width: `${progress}%`,
            transition: 'width 0.3s'
          }} />
        </div>
      </div>
    </Html>
  );
}

// Ground Plane
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[3, 64]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
    </mesh>
  );
}

// Avatar Model with Morph Targets
function AvatarModel() {
  const meshRef = useRef<THREE.Group>(null);
  const { avatar, ui } = useAvatarStore();
  const [hovered, setHovered] = useState(false);

  // Apply morphs to avatar body
  useEffect(() => {
    if (!meshRef.current) return;
    
    // In production, this would update morph target influences
    // based on avatar.body and avatar.face values
    console.log('Avatar morphs updated:', {
      body: avatar.body,
      face: avatar.face,
      style: avatar.style
    });
  }, [avatar.body, avatar.face, avatar.style]);

  // Get skin color
  const skinColor = new THREE.Color(avatar.skin.tone);
  const hairColor = new THREE.Color(avatar.hair.color);

  // Calculate body proportions from morphs
  const heightScale = 0.8 + (avatar.body.height / 100) * 0.6; // 0.8 to 1.4
  const weightScale = 0.8 + (avatar.body.weight / 100) * 0.4; // 0.8 to 1.2
  const shoulderScale = 0.8 + (avatar.body.shoulderWidth / 100) * 0.4;
  const hipScale = 0.8 + (avatar.body.hipWidth / 100) * 0.4;

  // Calculate face proportions
  const faceWidth = 0.8 + (avatar.face.faceWidth / 100) * 0.4;
  const jawWidth = 0.8 + (avatar.face.jawWidth / 100) * 0.4;

  // Render animal if style is animal
  if (avatar.style === 'animal' && avatar.animal) {
    return <AnimalModel animal={avatar.animal} />;
  }

  return (
    <group 
      ref={meshRef} 
      scale={[1, heightScale, 1]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Head */}
      <group position={[0, 1.6, 0]}>
        {/* Main head shape */}
        <mesh castShadow>
          <sphereGeometry args={[0.12 * faceWidth, 32, 32]} />
          <meshStandardMaterial 
            color={skinColor} 
            roughness={0.6} 
            metalness={0.1}
            wireframe={ui.showWireframe}
          />
        </mesh>
        
        {/* Jaw/Chin */}
        <mesh position={[0, -0.08, 0.02]} castShadow>
          <boxGeometry args={[0.15 * jawWidth, 0.08, 0.1]} />
          <meshStandardMaterial 
            color={skinColor} 
            roughness={0.6}
            wireframe={ui.showWireframe}
          />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.04, 0.02, 0.1]}>
          <sphereGeometry args={[0.015 * (avatar.face.eyeSize / 50), 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.04, 0.02, 0.1]}>
          <sphereGeometry args={[0.015 * (avatar.face.eyeSize / 50), 16, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[-0.04, 0.02, 0.115]}>
          <sphereGeometry args={[0.008, 16, 16]} />
          <meshStandardMaterial color="#3d2314" />
        </mesh>
        <mesh position={[0.04, 0.02, 0.115]}>
          <sphereGeometry args={[0.008, 16, 16]} />
          <meshStandardMaterial color="#3d2314" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.02, 0.12]}>
          <boxGeometry args={[
            0.03 * (avatar.face.noseWidth / 50), 
            0.04 * (avatar.face.noseLength / 50), 
            0.02
          ]} />
          <meshStandardMaterial 
            color={skinColor} 
            roughness={0.6}
            wireframe={ui.showWireframe}
          />
        </mesh>

        {/* Lips */}
        <mesh position={[0, -0.06, 0.1]}>
          <boxGeometry args={[
            0.06 * (avatar.face.lipWidth / 50), 
            0.015, 
            0.02
          ]} />
          <meshStandardMaterial 
            color={avatar.skin.makeup.lipstick || '#8b5a5a'} 
            roughness={0.4}
            wireframe={ui.showWireframe}
          />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.13, 0, 0]}>
          <sphereGeometry args={[0.025 * (avatar.face.earSize / 50), 16, 16]} />
          <meshStandardMaterial 
            color={skinColor} 
            roughness={0.6}
            wireframe={ui.showWireframe}
          />
        </mesh>
        <mesh position={[0.13, 0, 0]}>
          <sphereGeometry args={[0.025 * (avatar.face.earSize / 50), 16, 16]} />
          <meshStandardMaterial 
            color={skinColor} 
            roughness={0.6}
            wireframe={ui.showWireframe}
          />
        </mesh>

        {/* Hair */}
        {avatar.hair.style !== 'bald' && (
          <mesh position={[0, 0.08, -0.02]} castShadow>
            <sphereGeometry args={[0.14, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color={hairColor} 
              roughness={0.8}
              wireframe={ui.showWireframe}
            />
          </mesh>
        )}

        {/* Facial Hair - Goatee */}
        {avatar.facialHair.style === 'goatee' && avatar.facialHair.density > 0 && (
          <mesh position={[0, -0.1, 0.08]} castShadow>
            <coneGeometry args={[0.03, 0.04, 16]} />
            <meshStandardMaterial 
              color={avatar.facialHair.color} 
              roughness={0.9}
              wireframe={ui.showWireframe}
            />
          </mesh>
        )}

        {/* Glasses */}
        {avatar.accessories.glasses && (
          <group position={[0, 0.02, 0.12]}>
            {/* Frame */}
            <mesh>
              <torusGeometry args={[0.025, 0.003, 8, 24]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
            <mesh position={[0.06, 0, 0]}>
              <torusGeometry args={[0.025, 0.003, 8, 24]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
            <mesh position={[-0.06, 0, 0]}>
              <torusGeometry args={[0.025, 0.003, 8, 24]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
            {/* Bridge */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.02, 0.003, 0.003]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} />
            </mesh>
          </group>
        )}
      </group>

      {/* Neck */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.1, 16]} />
        <meshStandardMaterial 
          color={skinColor} 
          roughness={0.6}
          wireframe={ui.showWireframe}
        />
      </mesh>

      {/* Torso */}
      <group position={[0, 1.1, 0]} scale={[shoulderScale, 1, weightScale]}>
        {/* Upper Body / Shirt */}
        <mesh castShadow>
          <boxGeometry args={[0.35, 0.4, 0.18]} />
          <meshStandardMaterial 
            color={avatar.clothing.top.primaryColor} 
            roughness={0.7}
            wireframe={ui.showWireframe}
          />
        </mesh>
        
        {/* Collar Detail */}
        <mesh position={[0, 0.18, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.04, 0.1]} />
          <meshStandardMaterial 
            color={avatar.clothing.top.secondaryColor} 
            roughness={0.6}
            wireframe={ui.showWireframe}
          />
        </mesh>
      </group>

      {/* Lower Torso / Pants */}
      <group position={[0, 0.7, 0]} scale={[hipScale, 1, weightScale]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.16]} />
          <meshStandardMaterial 
            color={avatar.clothing.bottom.primaryColor} 
            roughness={0.8}
            wireframe={ui.showWireframe}
          />
        </mesh>
      </group>

      {/* Arms */}
      <group>
        {/* Left Arm */}
        <mesh position={[-0.22 * shoulderScale, 1.15, 0]} rotation={[0, 0, 0.15]} castShadow>
          <cylinderGeometry args={[0.035, 0.03, 0.35, 16]} />
          <meshStandardMaterial 
            color={avatar.clothing.top.primaryColor} 
            roughness={0.7}
            wireframe={ui.showWireframe}
          />
        </mesh>
        {/* Left Hand */}
        <mesh position={[-0.28 * shoulderScale, 0.92, 0]} castShadow>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial 
            color={skinColor} 
            roughness={0.6}
            wireframe={ui.showWireframe}
          />
        </mesh>

        {/* Right Arm */}
        <mesh position={[0.22 * shoulderScale, 1.15, 0]} rotation={[0, 0, -0.15]} castShadow>
          <cylinderGeometry args={[0.035, 0.03, 0.35, 16]} />
          <meshStandardMaterial 
            color={avatar.clothing.top.primaryColor} 
            roughness={0.7}
            wireframe={ui.showWireframe}
          />
        </mesh>
        {/* Right Hand */}
        <mesh position={[0.28 * shoulderScale, 0.92, 0]} castShadow>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial 
            color={skinColor} 
            roughness={0.6}
            wireframe={ui.showWireframe}
          />
        </mesh>
      </group>

      {/* Legs */}
      <group>
        {/* Left Leg */}
        <mesh position={[-0.08, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.45, 16]} />
          <meshStandardMaterial 
            color={avatar.clothing.bottom.primaryColor} 
            roughness={0.8}
            wireframe={ui.showWireframe}
          />
        </mesh>
        {/* Left Foot */}
        <mesh position={[-0.08, 0.08, 0.03]} castShadow>
          <boxGeometry args={[0.06, 0.05, 0.12]} />
          <meshStandardMaterial 
            color={avatar.clothing.shoes.primaryColor} 
            roughness={0.7}
            wireframe={ui.showWireframe}
          />
        </mesh>

        {/* Right Leg */}
        <mesh position={[0.08, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.45, 16]} />
          <meshStandardMaterial 
            color={avatar.clothing.bottom.primaryColor} 
            roughness={0.8}
            wireframe={ui.showWireframe}
          />
        </mesh>
        {/* Right Foot */}
        <mesh position={[0.08, 0.08, 0.03]} castShadow>
          <boxGeometry args={[0.06, 0.05, 0.12]} />
          <meshStandardMaterial 
            color={avatar.clothing.shoes.primaryColor} 
            roughness={0.7}
            wireframe={ui.showWireframe}
          />
        </mesh>
      </group>

      {/* Watch on left wrist */}
      {avatar.accessories.watch && (
        <mesh position={[-0.28 * shoulderScale, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.025, 0.005, 8, 24]} />
          <meshStandardMaterial 
            color={avatar.accessories.watch === 'gold' ? '#d4af37' : '#c0c0c0'} 
            metalness={0.9} 
            roughness={0.2}
          />
        </mesh>
      )}
    </group>
  );
}

// Animal Model
function AnimalModel({ animal }: { animal: NonNullable<import('../store').AvatarState['animal']> }) {
  const furColor = new THREE.Color(animal.furColor);
  const eyeColor = new THREE.Color(animal.eyeColor);
  const sizeScale = animal.size / 50;

  // Chihuahua-specific proportions
  const isChihuahua = animal.breed === 'chihuahua';
  const headSize = isChihuahua ? 0.12 : 0.08;
  const bodySize = isChihuahua ? 0.15 : 0.2;

  return (
    <group scale={[sizeScale, sizeScale, sizeScale]} position={[0, 0.1 * sizeScale, 0]}>
      {/* Body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.08, animal.bodyLength / 250, 16, 16]} />
        <meshStandardMaterial color={furColor} roughness={0.9} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.25, 0.12]} castShadow>
        <sphereGeometry args={[headSize, 32, 32]} />
        <meshStandardMaterial color={furColor} roughness={0.9} />
      </mesh>

      {/* Snout */}
      <mesh position={[0, 0.22, 0.2 + (animal.snoutLength / 500)]} castShadow>
        <coneGeometry args={[0.03, animal.snoutLength / 100, 16]} />
        <meshStandardMaterial color={furColor} roughness={0.9} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.22, 0.24 + (animal.snoutLength / 400)]}>
        <sphereGeometry args={[0.015, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.04, 0.28, 0.18]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={eyeColor} />
      </mesh>
      <mesh position={[0.04, 0.28, 0.18]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color={eyeColor} />
      </mesh>

      {/* Ears */}
      <mesh 
        position={[-0.06, 0.35, 0.08]} 
        rotation={[0.3, 0.3, -0.3]}
        castShadow
      >
        <coneGeometry args={[0.03 * (animal.earSize / 50), 0.08 * (animal.earSize / 50), 8]} />
        <meshStandardMaterial color={furColor} roughness={0.9} />
      </mesh>
      <mesh 
        position={[0.06, 0.35, 0.08]} 
        rotation={[0.3, -0.3, 0.3]}
        castShadow
      >
        <coneGeometry args={[0.03 * (animal.earSize / 50), 0.08 * (animal.earSize / 50), 8]} />
        <meshStandardMaterial color={furColor} roughness={0.9} />
      </mesh>

      {/* Legs */}
      {[-0.05, 0.05].map((x, i) => (
        <React.Fragment key={i}>
          {/* Front legs */}
          <mesh position={[x, 0.05, 0.08]} castShadow>
            <cylinderGeometry args={[0.015, 0.012, animal.legLength / 300, 8]} />
            <meshStandardMaterial color={furColor} roughness={0.9} />
          </mesh>
          {/* Back legs */}
          <mesh position={[x, 0.05, -0.08]} castShadow>
            <cylinderGeometry args={[0.018, 0.012, animal.legLength / 300, 8]} />
            <meshStandardMaterial color={furColor} roughness={0.9} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Tail */}
      <mesh 
        position={[0, 0.18, -0.15]} 
        rotation={[0.5 + (animal.tailCurl / 100), 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.015, 0.005, animal.tailLength / 500, 8]} />
        <meshStandardMaterial color={furColor} roughness={0.9} />
      </mesh>
    </group>
  );
}

// Camera Controller
function CameraController() {
  const { ui, setViewMode } = useAvatarStore();
  const { camera } = useThree();
  
  useEffect(() => {
    const positions: Record<string, [number, number, number]> = {
      full: [0, 1.2, 2.5],
      head: [0, 1.6, 0.6],
      upper: [0, 1.3, 1.5],
      lower: [0, 0.5, 1.5],
    };
    
    const target = positions[ui.viewMode] || positions.full;
    camera.position.set(...target);
    camera.lookAt(0, ui.viewMode === 'head' ? 1.6 : 1, 0);
  }, [ui.viewMode, camera]);

  return null;
}

// Auto Rotate Component
function AutoRotate() {
  const { ui } = useAvatarStore();
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (ui.autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <AvatarModel />
    </group>
  );
}

// Main Canvas Component
export default function AvatarCanvas() {
  const { ui } = useAvatarStore();

  return (
    <div style={{ width: '100%', height: '100%', background: '#0a0a0a', borderRadius: '12px', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 2.5], fov: 50 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <spotLight 
            position={[0, 5, 0]} 
            intensity={0.3} 
            angle={0.5} 
            penumbra={1}
          />

          {/* Environment */}
          <Environment preset="studio" background={false} />
          
          {/* Avatar */}
          <AutoRotate />
          
          {/* Ground & Shadows */}
          <Ground />
          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.6} 
            scale={5} 
            blur={2} 
            far={4}
          />

          {/* Controls */}
          <OrbitControls 
            makeDefault
            minDistance={0.5}
            maxDistance={5}
            minPolarAngle={0.1}
            maxPolarAngle={Math.PI - 0.1}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            target={[0, 1, 0]}
          />
          
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
