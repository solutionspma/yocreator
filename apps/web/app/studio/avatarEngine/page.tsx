'use client';

import React, { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAvatarStore, AvatarStyle, Gender } from './store';

// ============================================
// OMNI-AVATAR ENGINE - MAIN PAGE
// ============================================

// Dynamic imports for code splitting
const AvatarCanvas = dynamic(() => import('./components/AvatarCanvas'), { 
  ssr: false,
  loading: () => <CanvasLoader />
});

const BodyTab = dynamic(() => import('./components/MorphControls'), { ssr: false });
const FaceTab = dynamic(() => import('./components/MorphControls').then(mod => ({ default: mod.FaceTab })), { ssr: false });
const HairTab = dynamic(() => import('./components/HairSystem'), { ssr: false });
const ClothingTab = dynamic(() => import('./components/ClothingSystem'), { ssr: false });
const AccessoriesTab = dynamic(() => import('./components/AccessoriesTab'), { ssr: false });
const AnimalsTab = dynamic(() => import('./components/AnimalsTab'), { ssr: false });
const FaceScannerTab = dynamic(() => import('./components/FaceScanner'), { ssr: false });
const ExportTab = dynamic(() => import('./components/ExportTab'), { ssr: false });

// Loading component
function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <p className="text-gray-400">Loading 3D Engine...</p>
      </div>
    </div>
  );
}

// Tab definitions
type TabId = 'body' | 'face' | 'hair' | 'clothing' | 'accessories' | 'animals' | 'facescan' | 'export';

interface TabDef {
  id: TabId;
  label: string;
  icon: string;
  humanOnly: boolean;
}

const tabs: TabDef[] = [
  { id: 'body', label: 'Body', icon: '🧍', humanOnly: true },
  { id: 'face', label: 'Face', icon: '😊', humanOnly: true },
  { id: 'hair', label: 'Hair', icon: '💇', humanOnly: true },
  { id: 'clothing', label: 'Clothing', icon: '👔', humanOnly: true },
  { id: 'accessories', label: 'Accessories', icon: '👓', humanOnly: true },
  { id: 'animals', label: 'Animals', icon: '🐕', humanOnly: false },
  { id: 'facescan', label: 'Face Scan', icon: '📸', humanOnly: true },
  { id: 'export', label: 'Export', icon: '📤', humanOnly: false },
];

export default function AvatarEnginePage() {
  const { 
    avatar, 
    ui, 
    setActiveTab, 
    setStyle, 
    setGender,
    resetAvatar,
    toggleAutoRotate,
    toggleWireframe,
    setViewMode,
  } = useAvatarStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get visible tabs based on avatar style
  const visibleTabs = tabs.filter(tab => {
    if (avatar.style === 'animal') {
      return !tab.humanOnly || tab.id === 'animals' || tab.id === 'export';
    }
    return true;
  });

  // Render active tab content
  const renderTabContent = () => {
    switch (ui.activeTab) {
      case 'body':
        return <BodyTab />;
      case 'face':
        return <FaceTab />;
      case 'hair':
        return <HairTab />;
      case 'clothing':
        return <ClothingTab />;
      case 'accessories':
        return <AccessoriesTab />;
      case 'animals':
        return <AnimalsTab />;
      case 'facescan':
        return <FaceScannerTab />;
      case 'export':
        return <ExportTab />;
      default:
        return <BodyTab />;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-400">Initializing Avatar Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <a href="/studio" className="text-gray-400 hover:text-white transition-colors">
            ← Studio
          </a>
          <div className="h-6 w-px bg-gray-800" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Omni-Avatar Engine
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Style Selector */}
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            {(['realistic', 'stylized', 'anime', 'cartoon'] as AvatarStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => setStyle(style)}
                className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                  avatar.style === style
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Gender Selector (for human avatars) */}
          {avatar.style !== 'animal' && (
            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
              {(['male', 'female', 'neutral'] as Gender[]).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setGender(gender)}
                  className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                    avatar.gender === gender
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {gender === 'male' ? '♂️' : gender === 'female' ? '♀️' : '⚧️'} {gender}
                </button>
              ))}
            </div>
          )}

          {/* Reset Button */}
          <button
            onClick={resetAvatar}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
          >
            🔄 Reset
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Controls */}
        <div className="w-96 border-r border-gray-800 flex flex-col">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1 p-3 border-b border-gray-800 bg-gray-900/50">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  ui.activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden p-4">
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-gray-500">Loading...</div>
              </div>
            }>
              {renderTabContent()}
            </Suspense>
          </div>
        </div>

        {/* Right Panel - 3D Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-900/50">
            {/* View Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-2">View:</span>
              {(['full', 'head', 'upper', 'lower'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setViewMode(view)}
                  className={`px-2 py-1 rounded text-xs capitalize ${
                    ui.viewMode === view
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>

            {/* Display Options */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAutoRotate}
                className={`px-2 py-1 rounded text-xs ${
                  ui.autoRotate
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                🔄 Auto Rotate
              </button>
              <button
                onClick={toggleWireframe}
                className={`px-2 py-1 rounded text-xs ${
                  ui.showWireframe
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                📐 Wireframe
              </button>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="flex-1 p-4">
            <div className="w-full h-full rounded-xl overflow-hidden border border-gray-800">
              <Suspense fallback={<CanvasLoader />}>
                <AvatarCanvas />
              </Suspense>
            </div>
          </div>

          {/* Status Bar */}
          <div className="h-10 border-t border-gray-800 flex items-center justify-between px-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Style: <span className="text-purple-400 capitalize">{avatar.style}</span></span>
              {avatar.style !== 'animal' && (
                <span>Gender: <span className="text-purple-400 capitalize">{avatar.gender}</span></span>
              )}
              {avatar.style === 'animal' && avatar.animal && (
                <span>Type: <span className="text-purple-400 capitalize">{avatar.animal.breed}</span></span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Drag to rotate • Scroll to zoom • Shift+drag to pan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4a4a4a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #5a5a5a;
        }
      `}</style>
    </div>
  );
}
