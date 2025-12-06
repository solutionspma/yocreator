'use client';

import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { useAvatarStore } from '../store';
import * as THREE from 'three';

// Loading spinner
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-white text-sm">Loading Avatar...</span>
      </div>
    </Html>
  );
}

// Hair Mesh Component - Different hairstyles
function HairMesh({ 
  hairId, 
  headWidth, 
  headHeight, 
  headDepth, 
  hairMat,
  seg 
}: { 
  hairId: string | null; 
  headWidth: number; 
  headHeight: number; 
  headDepth: number;
  hairMat: THREE.Material;
  seg: number;
}) {
  if (!hairId || hairId === 'bald') return null;
  
  // Different hair geometry based on style
  switch (hairId) {
    // FADE CUTS - Lil Boosie style
    case 'baldfade':
    case 'lowfade':
    case 'highfade':
      const fadeHeight = hairId === 'baldfade' ? 0.25 : hairId === 'lowfade' ? 0.35 : 0.4;
      return (
        <group>
          {/* Low hair on top */}
          <mesh position={[0, headHeight * fadeHeight, 0]} material={hairMat} scale={[headWidth * 0.95, headHeight * 0.15, headDepth * 0.9]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          </mesh>
          {/* Fade sides - darker gradient simulated with smaller pieces */}
          <mesh position={[0, headHeight * 0.1, 0]} material={hairMat} scale={[headWidth * 0.98, headHeight * 0.08, headDepth * 0.95]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.25]} />
          </mesh>
        </group>
      );
    
    // BUZZ CUT / CREW CUT
    case 'buzzcut':
    case 'crewcut':
      return (
        <mesh position={[0, headHeight * 0.35, 0]} material={hairMat} scale={[headWidth * 1.02, headHeight * 0.2, headDepth * 0.98]} castShadow>
          <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
      );
    
    // 360 WAVES
    case 'waves':
      return (
        <group>
          <mesh position={[0, headHeight * 0.3, 0]} material={hairMat} scale={[headWidth * 1.01, headHeight * 0.18, headDepth * 0.98]} castShadow>
            <sphereGeometry args={[1, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          </mesh>
          {/* Wave pattern - rings */}
          {[0, 0.05, 0.1].map((offset, i) => (
            <mesh key={i} position={[0, headHeight * (0.35 - offset), 0]} material={hairMat} castShadow>
              <torusGeometry args={[headWidth * (0.7 - i * 0.1), 0.003, 8, 32]} />
            </mesh>
          ))}
        </group>
      );
    
    // FLAT TOP
    case 'flatop':
      return (
        <mesh position={[0, headHeight * 0.45, 0]} material={hairMat} castShadow>
          <cylinderGeometry args={[headWidth * 0.85, headWidth * 0.9, headHeight * 0.35, seg]} />
        </mesh>
      );
    
    // AFRO
    case 'afro01':
      return (
        <mesh position={[0, headHeight * 0.5, 0]} material={hairMat} scale={[headWidth * 2.2, headHeight * 1.8, headDepth * 2]} castShadow>
          <sphereGeometry args={[1, seg, seg]} />
        </mesh>
      );
    
    // AFRO PUFF
    case 'afropuff':
      return (
        <mesh position={[0, headHeight * 0.7, 0]} material={hairMat} scale={[headWidth * 1.5, headHeight * 1.2, headDepth * 1.3]} castShadow>
          <sphereGeometry args={[1, seg, seg]} />
        </mesh>
      );
    
    // DREADLOCKS
    case 'dreads':
    case 'dreadslong':
    case 'dreadsshort':
      const dreadLength = hairId === 'dreadsshort' ? 0.08 : hairId === 'dreads' ? 0.15 : 0.25;
      const dreadCount = 20;
      return (
        <group>
          {/* Base cap */}
          <mesh position={[0, headHeight * 0.4, 0]} material={hairMat} scale={[headWidth * 1.05, headHeight * 0.5, headDepth * 1.02]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          </mesh>
          {/* Individual dreads */}
          {Array.from({ length: dreadCount }).map((_, i) => {
            const angle = (i / dreadCount) * Math.PI * 2;
            const row = Math.floor(i / 8);
            const tilt = 0.3 + row * 0.15;
            const x = Math.sin(angle) * headWidth * (0.7 + row * 0.2);
            const z = Math.cos(angle) * headDepth * (0.7 + row * 0.2);
            const y = headHeight * (0.4 - row * 0.1);
            return (
              <mesh 
                key={i} 
                position={[x, y, z]} 
                rotation={[tilt * Math.cos(angle), 0, tilt * Math.sin(angle)]}
                material={hairMat} 
                castShadow
              >
                <cylinderGeometry args={[0.008, 0.005, dreadLength, 6]} />
              </mesh>
            );
          })}
        </group>
      );
    
    // CORNROWS
    case 'cornrows':
      return (
        <group>
          {/* Cornrow lines going back */}
          {[-0.08, -0.04, 0, 0.04, 0.08].map((offset, i) => (
            <mesh 
              key={i} 
              position={[offset, headHeight * 0.35, -headDepth * 0.2]} 
              rotation={[Math.PI * 0.35, 0, 0]}
              material={hairMat} 
              castShadow
            >
              <capsuleGeometry args={[0.006, headDepth * 1.5, 4, 8]} />
            </mesh>
          ))}
        </group>
      );
    
    // BOX BRAIDS
    case 'boxbraids':
      const braidCount = 30;
      return (
        <group>
          {/* Base */}
          <mesh position={[0, headHeight * 0.35, 0]} material={hairMat} scale={[headWidth * 1.02, headHeight * 0.4, headDepth * 1]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          </mesh>
          {/* Braids hanging down */}
          {Array.from({ length: braidCount }).map((_, i) => {
            const angle = (i / braidCount) * Math.PI * 2;
            const x = Math.sin(angle) * headWidth * 0.9;
            const z = Math.cos(angle) * headDepth * 0.9;
            return (
              <mesh 
                key={i} 
                position={[x, -0.02, z]} 
                material={hairMat} 
                castShadow
              >
                <cylinderGeometry args={[0.005, 0.004, 0.18, 4]} />
              </mesh>
            );
          })}
        </group>
      );
    
    // TWISTS
    case 'twists':
      return (
        <group>
          <mesh position={[0, headHeight * 0.4, 0]} material={hairMat} scale={[headWidth * 1.1, headHeight * 0.6, headDepth * 1.05]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          </mesh>
          {/* Twist texture bumps */}
          {Array.from({ length: 15 }).map((_, i) => {
            const angle = (i / 15) * Math.PI * 2;
            const x = Math.sin(angle) * headWidth * 0.8;
            const z = Math.cos(angle) * headDepth * 0.75;
            return (
              <mesh key={i} position={[x, headHeight * 0.5, z]} material={hairMat} castShadow>
                <sphereGeometry args={[0.015, 8, 8]} />
              </mesh>
            );
          })}
        </group>
      );
    
    // MOHAWK
    case 'mohawk01':
      return (
        <group>
          {/* Main mohawk strip */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[0, headHeight * (0.5 + i * 0.05), -headDepth * (0.3 - i * 0.1)]} 
              material={hairMat} 
              castShadow
            >
              <sphereGeometry args={[0.02 + i * 0.005, 8, 8]} />
            </mesh>
          ))}
        </group>
      );
    
    // PONYTAIL
    case 'ponytail01':
      return (
        <group>
          {/* Hair on top */}
          <mesh position={[0, headHeight * 0.35, 0]} material={hairMat} scale={[headWidth * 1.05, headHeight * 0.6, headDepth * 1]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          </mesh>
          {/* Ponytail */}
          <mesh position={[0, headHeight * 0.2, -headDepth * 1.1]} rotation={[Math.PI * 0.3, 0, 0]} material={hairMat} castShadow>
            <cylinderGeometry args={[0.025, 0.015, 0.2, 8]} />
          </mesh>
        </group>
      );
    
    // BUN
    case 'bun01':
      return (
        <group>
          {/* Hair on top */}
          <mesh position={[0, headHeight * 0.35, 0]} material={hairMat} scale={[headWidth * 1.03, headHeight * 0.5, headDepth * 0.98]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          </mesh>
          {/* Bun */}
          <mesh position={[0, headHeight * 0.65, -headDepth * 0.3]} material={hairMat} castShadow>
            <sphereGeometry args={[0.045, seg, seg]} />
          </mesh>
        </group>
      );
    
    // SHORT
    case 'short01':
      return (
        <mesh position={[0, headHeight * 0.35, 0]} material={hairMat} scale={[headWidth * 1.06, headHeight * 0.55, headDepth * 1.02]} castShadow>
          <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        </mesh>
      );
    
    // MEDIUM
    case 'medium01':
      return (
        <group>
          <mesh position={[0, headHeight * 0.35, 0]} material={hairMat} scale={[headWidth * 1.1, headHeight * 0.7, headDepth * 1.1]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          </mesh>
          {/* Side hair */}
          <mesh position={[-headWidth * 0.85, 0, 0]} material={hairMat} scale={[0.4, 0.8, 0.6]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
          <mesh position={[headWidth * 0.85, 0, 0]} material={hairMat} scale={[0.4, 0.8, 0.6]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        </group>
      );
    
    // LONG
    case 'long01':
      return (
        <group>
          {/* Top */}
          <mesh position={[0, headHeight * 0.35, 0]} material={hairMat} scale={[headWidth * 1.08, headHeight * 0.65, headDepth * 1.05]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          </mesh>
          {/* Long back hair */}
          <mesh position={[0, -headHeight * 0.3, -headDepth * 0.5]} material={hairMat} scale={[headWidth * 1.3, 0.25, 0.08]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
          {/* Side drapes */}
          <mesh position={[-headWidth * 0.9, -headHeight * 0.2, 0]} material={hairMat} scale={[0.05, 0.2, 0.08]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
          <mesh position={[headWidth * 0.9, -headHeight * 0.2, 0]} material={hairMat} scale={[0.05, 0.2, 0.08]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        </group>
      );
    
    // CURLY
    case 'curly01':
      return (
        <group>
          {/* Base curly mass */}
          <mesh position={[0, headHeight * 0.4, 0]} material={hairMat} scale={[headWidth * 1.4, headHeight * 0.9, headDepth * 1.3]} castShadow>
            <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          </mesh>
          {/* Curl bumps for texture */}
          {Array.from({ length: 25 }).map((_, i) => {
            const angle = (i / 25) * Math.PI * 2;
            const row = Math.floor(i / 10);
            const radius = headWidth * (1.3 - row * 0.2);
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius * 0.9;
            const y = headHeight * (0.5 - row * 0.15);
            return (
              <mesh key={i} position={[x, y, z]} material={hairMat} castShadow>
                <sphereGeometry args={[0.02, 6, 6]} />
              </mesh>
            );
          })}
        </group>
      );
    
    default:
      // Default short hair
      return (
        <mesh position={[0, headHeight * 0.3, -headDepth * 0.1]} material={hairMat} scale={[headWidth * 1.08, headHeight * 0.7, headDepth * 1.05]} castShadow>
          <sphereGeometry args={[1, seg, seg, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        </mesh>
      );
  }
}

// Scaled Sphere component for body parts
function ScaledSphere({ 
  scaleX, scaleY, scaleZ, material, segments = 32, ...props 
}: { 
  scaleX: number; scaleY: number; scaleZ: number; 
  material: THREE.Material; segments?: number;
} & JSX.IntrinsicElements['mesh']) {
  return (
    <mesh {...props} material={material} scale={[scaleX, scaleY, scaleZ]} castShadow>
      <sphereGeometry args={[1, segments, segments]} />
    </mesh>
  );
}

// Human body built with smooth geometry
function RealisticHumanBody() {
  const { avatar, ui } = useAvatarStore();
  const groupRef = useRef<THREE.Group>(null);
  
  // Calculate body dimensions from all sliders
  const body = useMemo(() => {
    const m = avatar.macro;
    const f = avatar.face;
    const t = avatar.torso;
    const a = avatar.arms;
    const l = avatar.legs;
    
    // Core parameters
    const gender = m.gender / 100;
    const muscle = m.muscle / 100;
    const weight = m.weight / 100;
    const height = 1.6 + (m.height / 100) * 0.4;
    const proportions = m.proportions / 100;
    
    // Ethnicity
    const african = m.african / 100;
    const asian = m.asian / 100;
    
    // === HEAD ===
    const headScale = 0.95 + proportions * 0.1;
    const headWidth = (0.14 + (f.headWidth / 100 - 0.5) * 0.04) * headScale;
    const headHeight = (0.18 + (f.headHeight / 100 - 0.5) * 0.04) * headScale;
    const headDepth = (0.16 + (f.headDepth / 100 - 0.5) * 0.03) * headScale;
    
    // Face features
    const eyeSize = 0.012 + (f.eyeSize / 100 - 0.5) * 0.006;
    const eyeSpacing = 0.032 + (f.eyeSpacing / 100 - 0.5) * 0.01;
    const noseSize = 0.8 + (f.noseWidth / 100 - 0.5) * 0.4 + african * 0.2;
    const noseLength = 0.025 + (f.noseLength / 100 - 0.5) * 0.015;
    const mouthWidth = 0.03 + (f.mouthWidth / 100 - 0.5) * 0.015 + african * 0.005;
    const lipFullness = (f.lipUpperFullness + f.lipLowerFullness) / 200;
    const jawWidth = headWidth * (0.9 + (f.jawWidth / 100 - 0.5) * 0.2 + gender * 0.1);
    const chinSize = 0.8 + (f.chinHeight / 100 - 0.5) * 0.4;
    const earSize = 0.02 + (f.earSize / 100 - 0.5) * 0.01;
    
    // Neck
    const neckRadius = 0.045 + gender * 0.015 + muscle * 0.01 + (f.neckWidth / 100 - 0.5) * 0.015;
    const neckLength = 0.08 + (f.neckLength / 100 - 0.5) * 0.03;
    
    // === TORSO ===
    const shoulderWidth = 0.18 + gender * 0.06 + muscle * 0.03 + (t.shoulderWidth / 100 - 0.5) * 0.04;
    const chestWidth = 0.15 + gender * 0.02 + muscle * 0.02 + weight * 0.02 + (t.chestWidth / 100 - 0.5) * 0.03;
    const chestDepth = 0.1 + muscle * 0.03 + weight * 0.025 + (t.chestDepth / 100 - 0.5) * 0.025;
    const bustSize = (1 - gender) * (t.bustSize / 100) * 0.06;
    const waistWidth = 0.12 + weight * 0.06 - gender * 0.02 + (t.waistWidth / 100 - 0.5) * 0.03;
    const hipWidth = 0.15 + (1 - gender) * 0.04 + weight * 0.03 + (t.hipWidth / 100 - 0.5) * 0.03;
    const stomachDepth = chestDepth * (0.9 + weight * 0.3 + (t.stomachSize / 100 - 0.5) * 0.2);
    const buttockSize = 0.02 + (1 - gender) * 0.015 + (t.buttockSize / 100 - 0.5) * 0.02;
    
    // === ARMS ===
    const armLength = 0.28 + (a.armLength / 100 - 0.5) * 0.06;
    const bicepRadius = (0.03 + muscle * 0.015 + (a.upperArmWidth / 100 - 0.5) * 0.01) * (1 + (a.bicepSize / 100 - 0.5) * 0.3);
    const forearmRadius = 0.025 + muscle * 0.01 + (a.forearmWidth / 100 - 0.5) * 0.008;
    const wristRadius = 0.018 + (a.wristWidth / 100 - 0.5) * 0.005;
    const handScale = 0.8 + gender * 0.15 + (a.handSize / 100 - 0.5) * 0.2;
    
    // === LEGS ===
    const legLength = 0.42 + (l.legLength / 100 - 0.5) * 0.08;
    const thighRadius = 0.055 + muscle * 0.015 + weight * 0.02 + (l.upperLegWidth / 100 - 0.5) * 0.015;
    const calfRadius = 0.04 + muscle * 0.015 + (l.calfSize / 100 - 0.5) * 0.015;
    const ankleRadius = 0.025 + (l.ankleWidth / 100 - 0.5) * 0.008;
    const footScale = 0.8 + gender * 0.15 + (l.footSize / 100 - 0.5) * 0.2;
    const gluteSize = buttockSize + (l.gluteSize / 100 - 0.5) * 0.015;
    
    return {
      height, gender, muscle, weight, proportions,
      headWidth, headHeight, headDepth, eyeSize, eyeSpacing,
      noseSize, noseLength, mouthWidth, lipFullness, jawWidth, chinSize, earSize,
      neckRadius, neckLength,
      shoulderWidth, chestWidth, chestDepth, bustSize,
      waistWidth, hipWidth, stomachDepth, buttockSize,
      armLength, bicepRadius, forearmRadius, wristRadius, handScale,
      legLength, thighRadius, calfRadius, ankleRadius, footScale, gluteSize
    };
  }, [avatar.macro, avatar.face, avatar.torso, avatar.arms, avatar.legs]);

  // Colors
  const skinColor = useMemo(() => new THREE.Color(avatar.materials.skinTone), [avatar.materials.skinTone]);
  const eyeColor = useMemo(() => new THREE.Color(avatar.materials.eyeColor), [avatar.materials.eyeColor]);
  const hairColor = useMemo(() => new THREE.Color(avatar.materials.hairColor), [avatar.materials.hairColor]);
  
  // Materials
  const skinMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: skinColor,
    roughness: 0.5 + (avatar.materials.roughness / 100) * 0.3,
    metalness: 0,
    clearcoat: 0.1,
    clearcoatRoughness: 0.8,
    wireframe: ui.showWireframe,
  }), [skinColor, avatar.materials.roughness, ui.showWireframe]);

  const eyeWhiteMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 'white' }), []);
  const irisMat = useMemo(() => new THREE.MeshStandardMaterial({ color: eyeColor }), [eyeColor]);
  const pupilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 'black' }), []);
  const lipMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(skinColor).multiplyScalar(0.6), 
    roughness: 0.3 
  }), [skinColor]);
  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: hairColor, 
    roughness: 0.8, 
    wireframe: ui.showWireframe 
  }), [hairColor, ui.showWireframe]);

  const scale = body.height;
  const seg = 32;

  return (
    <group ref={groupRef} scale={scale} position={[0, -scale * 0.5, 0]} rotation={[0, Math.PI, 0]}>
      {/* ===== HEAD ===== */}
      <group position={[0, 0.85, 0]}>
        {/* Skull */}
        <ScaledSphere 
          scaleX={body.headWidth} scaleY={body.headHeight} scaleZ={body.headDepth} 
          material={skinMat} 
        />
        
        {/* Jaw */}
        <ScaledSphere 
          position={[0, -body.headHeight * 0.6, body.headDepth * 0.2]}
          scaleX={body.jawWidth} scaleY={body.headHeight * 0.35 * body.chinSize} scaleZ={body.headDepth * 0.5}
          material={skinMat}
        />
        
        {/* Left Eye */}
        <mesh position={[-body.eyeSpacing, 0.01, body.headDepth * 0.85]} material={eyeWhiteMat} castShadow>
          <sphereGeometry args={[body.eyeSize, 16, 16]} />
        </mesh>
        <mesh position={[-body.eyeSpacing, 0.01, body.headDepth * 0.85 + body.eyeSize * 0.5]} material={irisMat}>
          <sphereGeometry args={[body.eyeSize * 0.5, 16, 16]} />
        </mesh>
        <mesh position={[-body.eyeSpacing, 0.01, body.headDepth * 0.85 + body.eyeSize * 0.7]} material={pupilMat}>
          <sphereGeometry args={[body.eyeSize * 0.25, 8, 8]} />
        </mesh>
        
        {/* Right Eye */}
        <mesh position={[body.eyeSpacing, 0.01, body.headDepth * 0.85]} material={eyeWhiteMat} castShadow>
          <sphereGeometry args={[body.eyeSize, 16, 16]} />
        </mesh>
        <mesh position={[body.eyeSpacing, 0.01, body.headDepth * 0.85 + body.eyeSize * 0.5]} material={irisMat}>
          <sphereGeometry args={[body.eyeSize * 0.5, 16, 16]} />
        </mesh>
        <mesh position={[body.eyeSpacing, 0.01, body.headDepth * 0.85 + body.eyeSize * 0.7]} material={pupilMat}>
          <sphereGeometry args={[body.eyeSize * 0.25, 8, 8]} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, -0.025, body.headDepth * 0.9]} material={skinMat} castShadow rotation={[Math.PI * 0.5, 0, 0]}>
          <coneGeometry args={[0.012 * body.noseSize, body.noseLength, 8]} />
        </mesh>
        <mesh position={[0, -0.025 - body.noseLength * 0.4, body.headDepth * 0.95]} material={skinMat} castShadow>
          <sphereGeometry args={[0.01 * body.noseSize, 8, 8]} />
        </mesh>
        
        {/* Mouth */}
        <mesh position={[0, -0.06, body.headDepth * 0.88]} material={lipMat} castShadow rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.004 * (1 + body.lipFullness), body.mouthWidth, 4, 8]} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-body.headWidth * 0.95, 0, 0]} material={skinMat} scale={[0.4, 1, 0.6]} castShadow>
          <sphereGeometry args={[body.earSize, 8, 8]} />
        </mesh>
        <mesh position={[body.headWidth * 0.95, 0, 0]} material={skinMat} scale={[0.4, 1, 0.6]} castShadow>
          <sphereGeometry args={[body.earSize, 8, 8]} />
        </mesh>
        
        {/* ===== HAIR STYLES ===== */}
        <HairMesh hairId={avatar.hair} headWidth={body.headWidth} headHeight={body.headHeight} headDepth={body.headDepth} hairMat={hairMat} seg={seg} />
      </group>
      
      {/* ===== NECK ===== */}
      <mesh position={[0, 0.73, 0]} material={skinMat} castShadow>
        <cylinderGeometry args={[body.neckRadius, body.neckRadius * 1.1, body.neckLength, seg]} />
      </mesh>
      
      {/* ===== TORSO ===== */}
      <group position={[0, 0.45, 0]}>
        {/* Shoulders */}
        <mesh material={skinMat} rotation={[0, 0, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[body.chestDepth, body.shoulderWidth * 2 - body.chestDepth * 2, 4, seg]} />
        </mesh>
        
        {/* Chest */}
        <ScaledSphere 
          position={[0, -0.08, body.bustSize * 0.5]}
          scaleX={body.chestWidth} scaleY={0.12} scaleZ={body.chestDepth + body.bustSize}
          material={skinMat}
        />
        
        {/* Bust (female) */}
        {body.bustSize > 0.01 && (
          <>
            <mesh position={[-0.05, -0.06, body.chestDepth + body.bustSize * 0.3]} material={skinMat} castShadow>
              <sphereGeometry args={[body.bustSize, seg, seg]} />
            </mesh>
            <mesh position={[0.05, -0.06, body.chestDepth + body.bustSize * 0.3]} material={skinMat} castShadow>
              <sphereGeometry args={[body.bustSize, seg, seg]} />
            </mesh>
          </>
        )}
        
        {/* Waist */}
        <ScaledSphere 
          position={[0, -0.2, 0]}
          scaleX={body.waistWidth} scaleY={0.1} scaleZ={body.stomachDepth}
          material={skinMat}
        />
        
        {/* Hips */}
        <ScaledSphere 
          position={[0, -0.32, 0]}
          scaleX={body.hipWidth} scaleY={0.08} scaleZ={body.chestDepth * 0.9}
          material={skinMat}
        />
        
        {/* Glutes */}
        <mesh position={[-0.05, -0.35, -body.chestDepth * 0.5]} material={skinMat} castShadow>
          <sphereGeometry args={[body.gluteSize, seg, seg]} />
        </mesh>
        <mesh position={[0.05, -0.35, -body.chestDepth * 0.5]} material={skinMat} castShadow>
          <sphereGeometry args={[body.gluteSize, seg, seg]} />
        </mesh>
      </group>
      
      {/* ===== LEFT ARM ===== */}
      <group position={[-body.shoulderWidth - 0.02, 0.45, 0]}>
        <mesh position={[0, -body.armLength * 0.35, 0]} material={skinMat} castShadow>
          <capsuleGeometry args={[body.bicepRadius, body.armLength * 0.45, 4, seg]} />
        </mesh>
        <mesh position={[0, -body.armLength * 0.85, 0]} material={skinMat} castShadow>
          <capsuleGeometry args={[body.forearmRadius, body.armLength * 0.4, 4, seg]} />
        </mesh>
        <mesh position={[0, -body.armLength * 1.1, 0]} material={skinMat} castShadow>
          <sphereGeometry args={[body.wristRadius, 8, 8]} />
        </mesh>
        <mesh position={[0, -body.armLength * 1.2, 0]} material={skinMat} castShadow>
          <boxGeometry args={[0.025 * body.handScale, 0.06 * body.handScale, 0.015 * body.handScale]} />
        </mesh>
      </group>
      
      {/* ===== RIGHT ARM ===== */}
      <group position={[body.shoulderWidth + 0.02, 0.45, 0]}>
        <mesh position={[0, -body.armLength * 0.35, 0]} material={skinMat} castShadow>
          <capsuleGeometry args={[body.bicepRadius, body.armLength * 0.45, 4, seg]} />
        </mesh>
        <mesh position={[0, -body.armLength * 0.85, 0]} material={skinMat} castShadow>
          <capsuleGeometry args={[body.forearmRadius, body.armLength * 0.4, 4, seg]} />
        </mesh>
        <mesh position={[0, -body.armLength * 1.1, 0]} material={skinMat} castShadow>
          <sphereGeometry args={[body.wristRadius, 8, 8]} />
        </mesh>
        <mesh position={[0, -body.armLength * 1.2, 0]} material={skinMat} castShadow>
          <boxGeometry args={[0.025 * body.handScale, 0.06 * body.handScale, 0.015 * body.handScale]} />
        </mesh>
      </group>
      
      {/* ===== LEFT LEG ===== */}
      <group position={[-body.hipWidth * 0.5, 0.1, 0]}>
        <mesh position={[0, -body.legLength * 0.3, 0]} material={skinMat} castShadow>
          <capsuleGeometry args={[body.thighRadius, body.legLength * 0.45, 4, seg]} />
        </mesh>
        <mesh position={[0, -body.legLength * 0.55, 0]} material={skinMat} castShadow>
          <sphereGeometry args={[body.thighRadius * 0.9, 16, 16]} />
        </mesh>
        <mesh position={[0, -body.legLength * 0.8, 0]} material={skinMat} castShadow>
          <capsuleGeometry args={[body.calfRadius, body.legLength * 0.4, 4, seg]} />
        </mesh>
        <mesh position={[0, -body.legLength * 1.05, 0]} material={skinMat} castShadow>
          <sphereGeometry args={[body.ankleRadius, 8, 8]} />
        </mesh>
        <mesh position={[0, -body.legLength * 1.1, 0.025 * body.footScale]} material={skinMat} castShadow>
          <boxGeometry args={[0.04 * body.footScale, 0.02, 0.09 * body.footScale]} />
        </mesh>
      </group>
      
      {/* ===== RIGHT LEG ===== */}
      <group position={[body.hipWidth * 0.5, 0.1, 0]}>
        <mesh position={[0, -body.legLength * 0.3, 0]} material={skinMat} castShadow>
          <capsuleGeometry args={[body.thighRadius, body.legLength * 0.45, 4, seg]} />
        </mesh>
        <mesh position={[0, -body.legLength * 0.55, 0]} material={skinMat} castShadow>
          <sphereGeometry args={[body.thighRadius * 0.9, 16, 16]} />
        </mesh>
        <mesh position={[0, -body.legLength * 0.8, 0]} material={skinMat} castShadow>
          <capsuleGeometry args={[body.calfRadius, body.legLength * 0.4, 4, seg]} />
        </mesh>
        <mesh position={[0, -body.legLength * 1.05, 0]} material={skinMat} castShadow>
          <sphereGeometry args={[body.ankleRadius, 8, 8]} />
        </mesh>
        <mesh position={[0, -body.legLength * 1.1, 0.025 * body.footScale]} material={skinMat} castShadow>
          <boxGeometry args={[0.04 * body.footScale, 0.02, 0.09 * body.footScale]} />
        </mesh>
      </group>
    </group>
  );
}

// Clothing layer
function ClothingLayer() {
  const { avatar, ui } = useAvatarStore();
  const hasTop = avatar.clothing.some(c => ['shirt01', 'tshirt02', 'hoodie01', 'jacket01', 'suit01'].includes(c));
  const hasBottom = avatar.clothing.some(c => ['jeans01', 'short01', 'suit01res'].includes(c));
  const hasShoes = avatar.clothing.some(c => ['shoes01', 'shoes02'].includes(c));
  const hasDress = avatar.clothing.includes('dress01');
  const hasWorksuit = avatar.clothing.includes('worksuit');
  
  const m = avatar.macro;
  const t = avatar.torso;
  const l = avatar.legs;
  
  const gender = m.gender / 100;
  const muscle = m.muscle / 100;
  const weight = m.weight / 100;
  const height = 1.6 + (m.height / 100) * 0.4;
  
  const shoulderWidth = 0.18 + gender * 0.06 + muscle * 0.03 + (t.shoulderWidth / 100 - 0.5) * 0.04;
  const chestDepth = 0.1 + muscle * 0.03 + weight * 0.025 + (t.chestDepth / 100 - 0.5) * 0.025;
  const hipWidth = 0.15 + (1 - gender) * 0.04 + weight * 0.03 + (t.hipWidth / 100 - 0.5) * 0.03;
  const legLength = 0.42 + (l.legLength / 100 - 0.5) * 0.08;
  const thighRadius = 0.055 + muscle * 0.015 + weight * 0.02 + (l.upperLegWidth / 100 - 0.5) * 0.015;
  
  const clothMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a4a6a',
    roughness: 0.8,
    wireframe: ui.showWireframe,
  }), [ui.showWireframe]);
  
  const pantsMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a2a3a',
    roughness: 0.7,
    wireframe: ui.showWireframe,
  }), [ui.showWireframe]);
  
  const shoeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.5,
    wireframe: ui.showWireframe,
  }), [ui.showWireframe]);

  const dressMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8B4557',
    roughness: 0.6,
    wireframe: ui.showWireframe,
  }), [ui.showWireframe]);
  
  return (
    <group scale={height} position={[0, -height * 0.5, 0]} rotation={[0, Math.PI, 0]}>
      {/* Top */}
      {(hasTop || hasWorksuit) && (
        <group position={[0, 0.45, 0]}>
          <mesh material={clothMat} rotation={[0, 0, Math.PI / 2]} castShadow>
            <capsuleGeometry args={[chestDepth + 0.015, shoulderWidth * 2 - chestDepth * 2, 4, 24]} />
          </mesh>
          <mesh position={[0, -0.15, 0]} material={clothMat} castShadow>
            <cylinderGeometry args={[hipWidth + 0.01, shoulderWidth, 0.35, 24]} />
          </mesh>
        </group>
      )}
      
      {/* Pants */}
      {(hasBottom || hasWorksuit) && (
        <group position={[0, 0.1, 0]}>
          <mesh material={pantsMat} castShadow>
            <cylinderGeometry args={[hipWidth + 0.012, hipWidth + 0.012, 0.08, 24]} />
          </mesh>
          <mesh position={[-hipWidth * 0.5, -legLength * 0.5, 0]} material={pantsMat} castShadow>
            <cylinderGeometry args={[thighRadius * 0.8, thighRadius + 0.01, legLength * 0.95, 16]} />
          </mesh>
          <mesh position={[hipWidth * 0.5, -legLength * 0.5, 0]} material={pantsMat} castShadow>
            <cylinderGeometry args={[thighRadius * 0.8, thighRadius + 0.01, legLength * 0.95, 16]} />
          </mesh>
        </group>
      )}
      
      {/* Shoes */}
      {hasShoes && (
        <>
          <mesh position={[-hipWidth * 0.5, -legLength - 0.38, 0.02]} material={shoeMat} castShadow>
            <boxGeometry args={[0.045, 0.03, 0.1]} />
          </mesh>
          <mesh position={[hipWidth * 0.5, -legLength - 0.38, 0.02]} material={shoeMat} castShadow>
            <boxGeometry args={[0.045, 0.03, 0.1]} />
          </mesh>
        </>
      )}
      
      {/* Dress */}
      {hasDress && (
        <mesh position={[0, 0.2, 0]} material={dressMat} castShadow>
          <coneGeometry args={[hipWidth + 0.08, 0.6, 24]} />
        </mesh>
      )}
    </group>
  );
}

// Camera controller
function CameraController() {
  const { ui } = useAvatarStore();
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;
    
    const positions: Record<string, [number, number, number]> = {
      front: [0, 0.8, 2.5],
      side: [2.5, 0.8, 0],
      back: [0, 0.8, -2.5],
      face: [0, 1.5, 1],
      custom: [1.5, 1, 1.5],
    };
    
    const pos = positions[ui.cameraView] || positions.front;
    camera.position.set(pos[0], pos[1], pos[2]);
    controlsRef.current.target.set(0, 0.6, 0);
    controlsRef.current.update();
  }, [ui.cameraView, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={0.5}
      maxDistance={10}
      target={[0, 0.6, 0]}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      }}
    />
  );
}

// Floor
function Floor() {
  return (
    <group>
      <gridHelper args={[10, 20, '#3a3a5a', '#2a2a4a']} />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.5} scale={10} blur={2} far={4} />
    </group>
  );
}

export default function AvatarCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 2.5], fov: 45 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => { gl.setClearColor('#12121f'); }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
          <directionalLight position={[-3, 3, -3]} intensity={0.4} />
          <hemisphereLight intensity={0.3} groundColor="#1a1a2e" />
          <Environment preset="studio" />
          <RealisticHumanBody />
          <ClothingLayer />
          <Floor />
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
