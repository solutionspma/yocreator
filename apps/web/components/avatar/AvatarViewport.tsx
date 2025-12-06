"use client";
import { useRef, useEffect, Suspense, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF, Html, Center } from "@react-three/drei";
import * as THREE from "three";
import type { AvatarParameters } from "./AvatarControls";

interface AvatarViewportProps {
  avatarUrl?: string | null;
  parameters?: AvatarParameters;
  onAvatarLoad?: () => void;
  faceImageUrl?: string | null; // For face scanner integration - applies face texture
}

// Ready Player Me default avatar URLs - realistic human models
const RPM_BASE_AVATARS = {
  male: "https://models.readyplayer.me/6409e6c4c22e2dee71e1c852.glb",
  female: "https://models.readyplayer.me/6409e7b0c22e2dee71e1c9b2.glb",
  // Fallback generic avatar
  default: "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb"
};

// Loading spinner component
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
        <span style={{ fontSize: "14px" }}>Loading Avatar...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

// Realistic human avatar with Ready Player Me base model
function RealisticAvatar({ 
  parameters, 
  customUrl,
  onLoad 
}: { 
  parameters: AvatarParameters;
  customUrl?: string | null;
  onLoad?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState(false);
  
  // Use custom URL if provided, otherwise use default RPM avatar
  const avatarUrl = customUrl || RPM_BASE_AVATARS.default;
  
  // Load the GLB model
  const { scene, nodes, materials } = useGLTF(avatarUrl, true, true, (error) => {
    console.error("Error loading avatar:", error);
    setModelError(true);
  });
  
  // Clone the scene to avoid mutation issues
  const clonedScene = useMemo(() => {
    if (!scene) return null;
    const clone = scene.clone(true);
    return clone;
  }, [scene]);

  // Calculate scale based on height (72 inches = 6 feet = baseline)
  const heightScale = useMemo(() => {
    const baseHeight = 72; // 6 feet in inches
    return parameters.height / baseHeight;
  }, [parameters.height]);
  
  // Body width modifier based on body type
  const bodyScale = useMemo(() => {
    switch (parameters.bodyType) {
      case "slim": return { x: 0.9, y: 1, z: 0.9 };
      case "athletic": return { x: 1, y: 1, z: 1 };
      case "average": return { x: 1.05, y: 1, z: 1.05 };
      case "muscular": return { x: 1.15, y: 1, z: 1.1 };
      case "heavy": return { x: 1.25, y: 0.98, z: 1.2 };
      default: return { x: 1, y: 1, z: 1 };
    }
  }, [parameters.bodyType]);

  // Apply skin tone to mesh materials
  useEffect(() => {
    if (!clonedScene) return;
    
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        const meshName = child.name.toLowerCase();
        
        // Apply skin tone to skin meshes
        if (meshName.includes("head") || meshName.includes("skin") || 
            meshName.includes("body") || meshName.includes("arm") || 
            meshName.includes("hand") || meshName.includes("face")) {
          if (!meshName.includes("hair") && !meshName.includes("cloth") && 
              !meshName.includes("shirt") && !meshName.includes("pant")) {
            mat.color = new THREE.Color(parameters.skinTone);
          }
        }
        
        // Apply hair color
        if (meshName.includes("hair")) {
          mat.color = new THREE.Color(parameters.hairColor);
        }
        
        // Apply clothing colors (top)
        if (meshName.includes("shirt") || meshName.includes("top") || 
            meshName.includes("jacket") || meshName.includes("hoodie")) {
          mat.color = new THREE.Color(parameters.topColor);
        }
        
        // Apply clothing colors (bottom)
        if (meshName.includes("pant") || meshName.includes("jean") || 
            meshName.includes("short") || meshName.includes("bottom")) {
          mat.color = new THREE.Color(parameters.bottomColor);
        }
        
        // Apply shoe color
        if (meshName.includes("shoe") || meshName.includes("foot") || 
            meshName.includes("sneaker") || meshName.includes("boot")) {
          mat.color = new THREE.Color(parameters.shoesColor);
        }
      }
    });
  }, [clonedScene, parameters]);

  // Subtle idle animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle breathing/idle movement
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.005 - 0.8;
    }
  });

  // Notify when loaded
  useEffect(() => {
    if (clonedScene && onLoad) {
      onLoad();
    }
  }, [clonedScene, onLoad]);

  if (modelError || !clonedScene) {
    // Fallback to basic geometric avatar if model fails to load
    return <FallbackAvatar parameters={parameters} />;
  }

  return (
    <group 
      ref={groupRef} 
      position={[0, -0.8, 0]} 
      scale={[heightScale * bodyScale.x, heightScale * bodyScale.y, heightScale * bodyScale.z]}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

// Fallback avatar when RPM model fails - still better than before
function FallbackAvatar({ parameters }: { parameters: AvatarParameters }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const heightScale = parameters.height / 72;
  const bodyWidth = parameters.bodyType === "slim" ? 0.9 : 
                    parameters.bodyType === "muscular" ? 1.15 : 
                    parameters.bodyType === "heavy" ? 1.25 : 1;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.9, 0]} scale={heightScale}>
      {/* Realistic proportioned head */}
      <group position={[0, 1.55, 0]}>
        {/* Head base - more oval shaped */}
        <mesh>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
        </mesh>
        {/* Jaw/chin area */}
        <mesh position={[0, -0.08, 0.02]} scale={[0.9, 0.6, 0.85]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.12, 0, 0]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
        </mesh>
        
        {/* Hair */}
        {parameters.hairStyle !== "bald" && (
          <mesh position={[0, 0.06, 0]} scale={[1.05, 0.8, 1]}>
            <sphereGeometry args={[0.13, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
            <meshStandardMaterial color={parameters.hairColor} roughness={0.9} />
          </mesh>
        )}
        
        {/* Eyes */}
        <mesh position={[-0.04, 0.02, 0.1]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.04, 0.02, 0.1]}>
          <sphereGeometry args={[0.015, 16, 16]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[-0.04, 0.02, 0.112]}>
          <sphereGeometry args={[0.008, 16, 16]} />
          <meshStandardMaterial color={parameters.eyeColor} />
        </mesh>
        <mesh position={[0.04, 0.02, 0.112]}>
          <sphereGeometry args={[0.008, 16, 16]} />
          <meshStandardMaterial color={parameters.eyeColor} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0, -0.02, 0.11]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.015, 0.03, 8]} />
          <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
        </mesh>
        
        {/* Lips */}
        <mesh position={[0, -0.06, 0.1]} scale={[1, 0.4, 0.5]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshStandardMaterial color="#8B4557" roughness={0.7} />
        </mesh>
        
        {/* Facial hair */}
        {parameters.facialHair !== "none" && (
          <mesh position={[0, -0.08, 0.08]} scale={[1.2, 0.5, 0.3]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={parameters.facialHairColor} roughness={0.95} />
          </mesh>
        )}
      </group>
      
      {/* Neck */}
      <mesh position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.045, 0.055, 0.12, 16]} />
        <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
      </mesh>
      
      {/* Torso/Shirt */}
      <group position={[0, 1.1, 0]} scale={[bodyWidth, 1, 1]}>
        {/* Chest */}
        <mesh>
          <capsuleGeometry args={[0.13, 0.3, 8, 16]} />
          <meshStandardMaterial color={parameters.topColor} roughness={0.7} />
        </mesh>
        {/* Shoulders */}
        <mesh position={[-0.18, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.05, 0.08, 8, 16]} />
          <meshStandardMaterial color={parameters.topColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.18, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.05, 0.08, 8, 16]} />
          <meshStandardMaterial color={parameters.topColor} roughness={0.7} />
        </mesh>
      </group>
      
      {/* Arms */}
      <group scale={[bodyWidth, 1, 1]}>
        {/* Upper arms */}
        <mesh position={[-0.22, 1.05, 0]} rotation={[0, 0, 0.15]}>
          <capsuleGeometry args={[0.04, 0.2, 8, 16]} />
          <meshStandardMaterial color={parameters.topColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.22, 1.05, 0]} rotation={[0, 0, -0.15]}>
          <capsuleGeometry args={[0.04, 0.2, 8, 16]} />
          <meshStandardMaterial color={parameters.topColor} roughness={0.7} />
        </mesh>
        {/* Forearms/skin */}
        <mesh position={[-0.26, 0.82, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.035, 0.18, 8, 16]} />
          <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
        </mesh>
        <mesh position={[0.26, 0.82, 0]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.035, 0.18, 8, 16]} />
          <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
        </mesh>
        {/* Hands */}
        <mesh position={[-0.28, 0.65, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
        </mesh>
        <mesh position={[0.28, 0.65, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color={parameters.skinTone} roughness={0.6} />
        </mesh>
      </group>
      
      {/* Waist/Belt area */}
      <mesh position={[0, 0.85, 0]} scale={[bodyWidth, 1, 1]}>
        <cylinderGeometry args={[0.11, 0.12, 0.08, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      
      {/* Legs/Pants */}
      <group>
        <mesh position={[-0.07, 0.55, 0]}>
          <capsuleGeometry args={[0.055, 0.35, 8, 16]} />
          <meshStandardMaterial color={parameters.bottomColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.07, 0.55, 0]}>
          <capsuleGeometry args={[0.055, 0.35, 8, 16]} />
          <meshStandardMaterial color={parameters.bottomColor} roughness={0.7} />
        </mesh>
        {/* Lower legs */}
        <mesh position={[-0.07, 0.22, 0]}>
          <capsuleGeometry args={[0.045, 0.28, 8, 16]} />
          <meshStandardMaterial color={parameters.bottomColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.07, 0.22, 0]}>
          <capsuleGeometry args={[0.045, 0.28, 8, 16]} />
          <meshStandardMaterial color={parameters.bottomColor} roughness={0.7} />
        </mesh>
      </group>
      
      {/* Shoes */}
      <mesh position={[-0.07, 0.03, 0.02]} scale={[1, 0.6, 1.5]}>
        <boxGeometry args={[0.07, 0.06, 0.12]} />
        <meshStandardMaterial color={parameters.shoesColor} roughness={0.4} />
      </mesh>
      <mesh position={[0.07, 0.03, 0.02]} scale={[1, 0.6, 1.5]}>
        <boxGeometry args={[0.07, 0.06, 0.12]} />
        <meshStandardMaterial color={parameters.shoesColor} roughness={0.4} />
      </mesh>
      
      {/* Platform */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Camera auto-framing
function CameraRig() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0.5, 2.5);
    camera.lookAt(0, 0.5, 0);
  }, [camera]);
  
  return null;
}

export default function AvatarViewport({ 
  avatarUrl, 
  parameters,
  onAvatarLoad,
  faceImageUrl 
}: AvatarViewportProps) {
  // Default parameters if none provided
  const avatarParams: AvatarParameters = parameters || {
    height: 72,
    bodyType: "athletic",
    skinTone: "#8D5524",
    headShape: "oval",
    eyeColor: "#4A3728",
    eyeShape: "almond",
    noseSize: 50,
    lipSize: 50,
    jawWidth: 50,
    cheekboneHeight: 50,
    hairStyle: "fade",
    hairColor: "#1a1a1a",
    facialHair: "none",
    facialHairColor: "#1a1a1a",
    topStyle: "hoodie",
    topColor: "#1a1a1a",
    bottomStyle: "jeans",
    bottomColor: "#2d3748",
    shoesStyle: "sneakers",
    shoesColor: "#ffffff",
    glasses: "none",
    hat: "none",
    jewelry: []
  };

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "400px", background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)", borderRadius: "12px", overflow: "hidden" }}>
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraRig />
        
        {/* Enhanced Lighting for realistic rendering */}
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
        {/* Rim light for depth */}
        <pointLight position={[-3, 2, -3]} intensity={0.3} color="#a78bfa" />
        
        {/* Studio Environment */}
        <Environment preset="studio" />
        
        {/* Avatar - renders live based on parameters */}
        <Suspense fallback={<Loader />}>
          <RealisticAvatar 
            parameters={avatarParams}
            customUrl={avatarUrl}
            onLoad={onAvatarLoad}
          />
        </Suspense>
        
        {/* Ground shadow */}
        <ContactShadows 
          position={[0, -0.9, 0]} 
          opacity={0.6} 
          scale={2.5} 
          blur={2.5} 
          far={1.5} 
        />
        
        {/* Subtle floor plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2} />
        </mesh>
        
        {/* Controls - drag to rotate, scroll to zoom, right-drag to pan */}
        <OrbitControls 
          makeDefault
          minDistance={1}
          maxDistance={4}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 1.8}
          enablePan={true}
          target={[0, 0.4, 0]}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
