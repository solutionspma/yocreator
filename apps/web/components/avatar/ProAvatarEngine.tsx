"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Morph parameters interface
export interface AvatarMorphs {
  gender: "male" | "female";
  height: number;
  faceWidth: number;
  depth: number;
  jawWidth: number;
  cheekbones: number;
  noseSize: number;
  lipFullness: number;
  eyeSize: number;
  eyeSpacing: number;
  skinColor: string;
  hair: string;
  hairColor: string;
  facialHair: string;
  facialHairColor: string;
  clothing: string;
  clothingColor: string;
  pantsStyle: string;
  pantsColor: string;
  shoesStyle: string;
  shoesColor: string;
}

// Default morphs
export const defaultMorphs: AvatarMorphs = {
  gender: "male",
  height: 1,
  faceWidth: 1,
  depth: 1,
  jawWidth: 1,
  cheekbones: 1,
  noseSize: 1,
  lipFullness: 1,
  eyeSize: 1,
  eyeSpacing: 1,
  skinColor: "#8d5524",
  hair: "shortFade",
  hairColor: "#1a1a1a",
  facialHair: "none",
  facialHairColor: "#1a1a1a",
  clothing: "hoodie",
  clothingColor: "#1a1a1a",
  pantsStyle: "jeans",
  pantsColor: "#2d3748",
  shoesStyle: "sneakers",
  shoesColor: "#ffffff",
};

// Hair mesh component
function HairMesh({ style, color }: { style: string; color: string }) {
  const hairGeometry = useMemo(() => {
    switch (style) {
      case "afro":
        return new THREE.SphereGeometry(0.18, 32, 32);
      case "locs":
        return new THREE.SphereGeometry(0.16, 32, 32);
      case "buzz":
        return new THREE.SphereGeometry(0.125, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5);
      case "shortFade":
      default:
        return new THREE.SphereGeometry(0.14, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8);
    }
  }, [style]);

  const position = useMemo(() => {
    switch (style) {
      case "afro": return [0, 0.08, 0];
      case "locs": return [0, 0.06, 0];
      case "buzz": return [0, 0.04, 0];
      default: return [0, 0.06, 0];
    }
  }, [style]);

  if (style === "bald") return null;

  return (
    <mesh position={position as [number, number, number]} geometry={hairGeometry}>
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

// Facial hair mesh
function FacialHairMesh({ style, color }: { style: string; color: string }) {
  if (style === "none") return null;

  const geometry = useMemo(() => {
    switch (style) {
      case "beard":
        return new THREE.SphereGeometry(0.06, 16, 16);
      case "goatee":
        return new THREE.ConeGeometry(0.03, 0.05, 8);
      case "stubble":
        return new THREE.SphereGeometry(0.045, 16, 16);
      case "mustache":
        return new THREE.BoxGeometry(0.06, 0.015, 0.02);
      default:
        return new THREE.SphereGeometry(0.04, 16, 16);
    }
  }, [style]);

  const position = useMemo(() => {
    switch (style) {
      case "beard": return [0, -0.1, 0.06];
      case "goatee": return [0, -0.12, 0.08];
      case "stubble": return [0, -0.08, 0.07];
      case "mustache": return [0, -0.04, 0.11];
      default: return [0, -0.08, 0.06];
    }
  }, [style]);

  return (
    <mesh position={position as [number, number, number]} geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

// Clothing mesh component
function ClothingMesh({ style, color, bodyWidth }: { style: string; color: string; bodyWidth: number }) {
  const torsoGeometry = useMemo(() => {
    switch (style) {
      case "tank":
        return new THREE.CapsuleGeometry(0.11, 0.28, 8, 16);
      case "blazer":
        return new THREE.CapsuleGeometry(0.15, 0.32, 8, 16);
      case "jersey":
        return new THREE.CapsuleGeometry(0.13, 0.3, 8, 16);
      case "hoodie":
      default:
        return new THREE.CapsuleGeometry(0.14, 0.3, 8, 16);
    }
  }, [style]);

  return (
    <group scale={[bodyWidth, 1, 1]}>
      {/* Main torso */}
      <mesh geometry={torsoGeometry}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[-0.18, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.05, 0.08, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.18, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.05, 0.08, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Hood for hoodie */}
      {style === "hoodie" && (
        <mesh position={[0, 0.22, -0.05]}>
          <sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      )}

      {/* Collar for blazer */}
      {style === "blazer" && (
        <mesh position={[0, 0.18, 0.05]}>
          <boxGeometry args={[0.1, 0.04, 0.03]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      )}
    </group>
  );
}

// Pants mesh component  
function PantsMesh({ style, color }: { style: string; color: string }) {
  return (
    <group>
      {/* Left leg */}
      <mesh position={[-0.07, 0.55, 0]}>
        <capsuleGeometry args={[0.055, 0.35, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-0.07, 0.22, 0]}>
        <capsuleGeometry args={[style === "shorts" ? 0.055 : 0.045, style === "shorts" ? 0.15 : 0.28, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      
      {/* Right leg */}
      <mesh position={[0.07, 0.55, 0]}>
        <capsuleGeometry args={[0.055, 0.35, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.07, 0.22, 0]}>
        <capsuleGeometry args={[style === "shorts" ? 0.055 : 0.045, style === "shorts" ? 0.15 : 0.28, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

// Shoes mesh component
function ShoesMesh({ style, color }: { style: string; color: string }) {
  const shoeHeight = style === "boots" ? 0.1 : 0.06;
  const shoeLength = style === "dress" ? 0.14 : 0.12;

  return (
    <group>
      <mesh position={[-0.07, 0.03, 0.02]} scale={[1, 0.6, 1.5]}>
        <boxGeometry args={[0.07, shoeHeight, shoeLength]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0.07, 0.03, 0.02]} scale={[1, 0.6, 1.5]}>
        <boxGeometry args={[0.07, shoeHeight, shoeLength]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Main avatar mesh with live morphing
function AvatarMesh({ morphs }: { morphs: AvatarMorphs }) {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate body proportions
  const bodyWidth = morphs.gender === "female" ? 0.9 : 1;
  const hipWidth = morphs.gender === "female" ? 1.1 : 1;
  const shoulderWidth = morphs.gender === "male" ? 1.1 : 0.95;

  // Idle animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.003 - 0.9;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.9, 0]} scale={morphs.height}>
      {/* Head group */}
      <group position={[0, 1.55, 0]}>
        {/* Head base - morphable */}
        <mesh scale={[morphs.faceWidth, 1, morphs.depth]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
        
        {/* Jaw - morphable */}
        <mesh position={[0, -0.08, 0.02]} scale={[morphs.jawWidth * 0.9, 0.6, 0.85]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>

        {/* Cheekbones */}
        <mesh position={[-0.08, 0.02, 0.06]} scale={[morphs.cheekbones * 0.3, 0.2, 0.15]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.08, 0.02, 0.06]} scale={[morphs.cheekbones * 0.3, 0.2, 0.15]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.12, 0, 0]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
        
        {/* Hair */}
        <HairMesh style={morphs.hair} color={morphs.hairColor} />
        
        {/* Eyes */}
        <mesh position={[-0.04 * morphs.eyeSpacing, 0.02, 0.1]} scale={morphs.eyeSize}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.04 * morphs.eyeSpacing, 0.02, 0.1]} scale={morphs.eyeSize}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-0.04 * morphs.eyeSpacing, 0.02, 0.112]} scale={morphs.eyeSize}>
          <sphereGeometry args={[0.008, 16, 16]} />
          <meshStandardMaterial color="#4A3728" />
        </mesh>
        <mesh position={[0.04 * morphs.eyeSpacing, 0.02, 0.112]} scale={morphs.eyeSize}>
          <sphereGeometry args={[0.008, 16, 16]} />
          <meshStandardMaterial color="#4A3728" />
        </mesh>
        
        {/* Nose - morphable */}
        <mesh position={[0, -0.02, 0.11]} rotation={[0.3, 0, 0]} scale={morphs.noseSize}>
          <coneGeometry args={[0.015, 0.03, 8]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
        
        {/* Lips - morphable */}
        <mesh position={[0, -0.06, 0.1]} scale={[1, morphs.lipFullness * 0.4, 0.5]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color="#8B4557" roughness={0.7} />
        </mesh>
        
        {/* Facial hair */}
        <FacialHairMesh style={morphs.facialHair} color={morphs.facialHairColor} />
      </group>
      
      {/* Neck */}
      <mesh position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.12, 16]} />
        <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
      </mesh>
      
      {/* Torso with clothing */}
      <group position={[0, 1.1, 0]} scale={[shoulderWidth, 1, 1]}>
        <ClothingMesh style={morphs.clothing} color={morphs.clothingColor} bodyWidth={bodyWidth} />
      </group>
      
      {/* Arms */}
      <group scale={[shoulderWidth * bodyWidth, 1, 1]}>
        {/* Upper arms - clothing color */}
        <mesh position={[-0.22, 1.05, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.04, 0.2, 8, 16]} />
          <meshStandardMaterial color={morphs.clothing === "tank" ? morphs.skinColor : morphs.clothingColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.22, 1.05, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.04, 0.2, 8, 16]} />
          <meshStandardMaterial color={morphs.clothing === "tank" ? morphs.skinColor : morphs.clothingColor} roughness={0.7} />
        </mesh>
        
        {/* Forearms - skin */}
        <mesh position={[-0.26, 0.82, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.035, 0.18, 8, 16]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.26, 0.82, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.035, 0.18, 8, 16]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
        
        {/* Hands */}
        <mesh position={[-0.28, 0.65, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0.28, 0.65, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color={morphs.skinColor} roughness={0.6} />
        </mesh>
      </group>
      
      {/* Belt */}
      <mesh position={[0, 0.85, 0]} scale={[hipWidth, 1, 1]}>
        <cylinderGeometry args={[0.11, 0.12, 0.08, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      
      {/* Pants */}
      <group scale={[hipWidth, 1, 1]}>
        <PantsMesh style={morphs.pantsStyle} color={morphs.pantsColor} />
      </group>
      
      {/* Shoes */}
      <ShoesMesh style={morphs.shoesStyle} color={morphs.shoesColor} />
      
      {/* Platform */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Loading component
function Loader() {
  return (
    <Html center>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "12px",
        color: "white" 
      }}>
        <div style={{ 
          width: "40px", 
          height: "40px", 
          border: "3px solid #333", 
          borderTopColor: "#7c3aed", 
          borderRadius: "50%", 
          animation: "spin 1s linear infinite" 
        }} />
        <span style={{ fontSize: "14px" }}>Initializing Engine...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

interface ProAvatarEngineProps {
  morphs: AvatarMorphs;
  className?: string;
}

export default function ProAvatarEngine({ morphs, className = "" }: ProAvatarEngineProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full h-full min-h-[500px] bg-gradient-to-b from-[#1a1a2e] to-[#0a0a0a] rounded-xl overflow-hidden ${className}`}>
      <Canvas 
        camera={{ position: [0, 0.8, 1.8], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#b4c7ff" />
        <spotLight 
          position={[0, 6, 2]} 
          intensity={0.8} 
          angle={0.4} 
          penumbra={0.5}
          color="#fff5e6"
        />
        <pointLight position={[-3, 2, -3]} intensity={0.3} color="#a78bfa" />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Avatar */}
        {isLoading ? <Loader /> : <AvatarMesh morphs={morphs} />}
        
        {/* Ground shadow */}
        <ContactShadows 
          position={[0, -0.9, 0]} 
          opacity={0.6} 
          scale={2.5} 
          blur={2.5} 
          far={1.5} 
        />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2} />
        </mesh>
        
        {/* Controls */}
        <OrbitControls 
          makeDefault
          minDistance={0.8}
          maxDistance={3}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.6}
          enablePan={false}
          target={[0, 0.6, 0]}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
