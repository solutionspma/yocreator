"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";

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
        <span style={{ fontSize: "14px" }}>Loading Avatar...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
}

// Avatar model component - loads Ready Player Me GLB
function AvatarModel({ url, onLoad }: { url: string; onLoad?: () => void }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (scene) {
      // Center the model
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      scene.position.y = 0;
      
      // Call onLoad callback
      if (onLoad) onLoad();
    }
  }, [scene, onLoad]);

  return (
    <group ref={groupRef} position={[0, -0.9, 0]}>
      <primitive object={scene} scale={1.1} />
    </group>
  );
}

interface FastAvatarViewportProps {
  avatarUrl: string;
  onLoad?: () => void;
  className?: string;
}

export default function FastAvatarViewport({ 
  avatarUrl, 
  onLoad,
  className = ""
}: FastAvatarViewportProps) {
  return (
    <div className={`w-full h-full min-h-[500px] bg-black rounded-xl overflow-hidden ${className}`}>
      <Canvas 
        camera={{ position: [0, 1.2, 2], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[2, 4, 2]} 
          intensity={1} 
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-2, 3, -2]} intensity={0.4} color="#b4c7ff" />
        <spotLight 
          position={[0, 5, 2]} 
          intensity={0.6} 
          angle={0.4} 
          penumbra={0.5}
          color="#fff5e6"
        />
        
        {/* Model */}
        <Suspense fallback={<Loader />}>
          <AvatarModel url={avatarUrl} onLoad={onLoad} />
        </Suspense>
        
        {/* Ground shadow */}
        <ContactShadows 
          position={[0, -0.9, 0]} 
          opacity={0.5} 
          scale={2.5} 
          blur={2} 
          far={1.5} 
        />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
          <planeGeometry args={[5, 5]} />
          <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2} />
        </mesh>
        
        {/* Controls */}
        <OrbitControls 
          enablePan 
          enableZoom 
          enableRotate
          minDistance={1.5}
          maxDistance={5}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          target={[0, 0.5, 0]}
        />
        
        {/* Environment */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
