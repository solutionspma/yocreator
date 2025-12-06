'use client';

import React, { useState, useCallback } from 'react';
import { useAvatarStore } from '../store';

// ============================================
// OMNI-AVATAR ENGINE - EXPORT SYSTEM
// ============================================

type ExportFormat = 'glb' | 'fbx' | 'usdz' | 'png' | 'vrm';

interface ExportOption {
  format: ExportFormat;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

const exportOptions: ExportOption[] = [
  {
    format: 'glb',
    name: 'GLB',
    description: 'Universal 3D format. Works with most 3D software, game engines, and AR/VR platforms.',
    icon: '📦',
    available: true,
  },
  {
    format: 'fbx',
    name: 'FBX',
    description: 'Industry standard for animation. Best for Unity, Unreal Engine, Maya, and Blender.',
    icon: '🎬',
    available: true,
  },
  {
    format: 'usdz',
    name: 'USDZ',
    description: 'Apple AR format. Perfect for iOS AR Quick Look and Reality Composer.',
    icon: '🍎',
    available: true,
  },
  {
    format: 'vrm',
    name: 'VRM',
    description: 'VTuber/metaverse avatar format. Works with VRChat, Cluster, and VTubing software.',
    icon: '🎭',
    available: true,
  },
  {
    format: 'png',
    name: 'PNG Screenshot',
    description: 'High-resolution 2D image of your avatar from current view angle.',
    icon: '🖼️',
    available: true,
  },
];

// Section Header
function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
      {title}
    </h3>
  );
}

export default function ExportTab() {
  const { avatar, savedAvatars, saveAvatar, loadAvatar, deleteAvatar, setShowLoadModal, ui } = useAvatarStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('glb');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportSettings, setExportSettings] = useState({
    includeAnimation: true,
    includeTextures: true,
    optimizeMesh: true,
    resolution: 'high' as 'low' | 'medium' | 'high',
  });

  // Handle export
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setExportProgress(i);
    }

    // In production, this would:
    // 1. Gather all avatar data
    // 2. Generate mesh with morph targets applied
    // 3. Bake textures
    // 4. Convert to selected format
    // 5. Trigger download

    // For now, simulate a download
    const blob = new Blob([JSON.stringify(avatar, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${avatar.name.replace(/\s+/g, '_')}.${selectedFormat === 'png' ? 'json' : selectedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setExportProgress(0);
  }, [avatar, selectedFormat]);

  // Handle PNG screenshot
  const handleScreenshot = useCallback(() => {
    // Get the canvas from the 3D viewport
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${avatar.name.replace(/\s+/g, '_')}_screenshot.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [avatar.name]);

  return (
    <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
      {/* Save/Load Section */}
      <div>
        <SectionHeader title="Save & Load" />
        
        {/* Avatar Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-300 block mb-1">Avatar Name</label>
          <input
            type="text"
            value={avatar.name}
            onChange={(e) => useAvatarStore.getState().setName(e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Save/Load Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => saveAvatar()}
            className="py-2 bg-purple-600 hover:bg-purple-500 rounded text-white font-medium transition-colors"
          >
            💾 Save Avatar
          </button>
          <button
            onClick={() => setShowLoadModal(true)}
            className="py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-medium transition-colors"
          >
            📂 Load Avatar
          </button>
        </div>

        {/* Saved Avatars List */}
        {savedAvatars.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-3">
            <h4 className="text-sm text-gray-400 mb-2">Saved Avatars ({savedAvatars.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {savedAvatars.map((saved) => (
                <div 
                  key={saved.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    saved.id === avatar.id ? 'bg-purple-600/30' : 'bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{saved.style === 'animal' ? '🐕' : '🧑'}</span>
                    <span className="text-sm text-white">{saved.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => loadAvatar(saved.id)}
                      className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 rounded"
                      title="Load"
                    >
                      📂
                    </button>
                    <button
                      onClick={() => deleteAvatar(saved.id)}
                      className="px-2 py-1 text-xs bg-red-600/50 hover:bg-red-600 rounded"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Format Selection */}
      <div>
        <SectionHeader title="Export Format" />
        <div className="space-y-2">
          {exportOptions.map((option) => (
            <button
              key={option.format}
              onClick={() => setSelectedFormat(option.format)}
              disabled={!option.available}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                selectedFormat === option.format
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600'
              } ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="text-white font-medium">{option.name}</div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export Settings */}
      {selectedFormat !== 'png' && (
        <div>
          <SectionHeader title="Export Settings" />
          
          <div className="space-y-3">
            {/* Include Animation */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={exportSettings.includeAnimation}
                onChange={(e) => setExportSettings(s => ({ ...s, includeAnimation: e.target.checked }))}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">Include animations</span>
            </label>

            {/* Include Textures */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={exportSettings.includeTextures}
                onChange={(e) => setExportSettings(s => ({ ...s, includeTextures: e.target.checked }))}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">Include textures</span>
            </label>

            {/* Optimize Mesh */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={exportSettings.optimizeMesh}
                onChange={(e) => setExportSettings(s => ({ ...s, optimizeMesh: e.target.checked }))}
                className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">Optimize mesh (reduce file size)</span>
            </label>

            {/* Resolution */}
            <div>
              <label className="text-sm text-gray-300 block mb-2">Texture Resolution</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setExportSettings(s => ({ ...s, resolution: res }))}
                    className={`flex-1 py-2 rounded capitalize text-sm ${
                      exportSettings.resolution === res
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Button */}
      <div>
        {isExporting ? (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin text-2xl">⚙️</div>
              <div>
                <div className="text-white font-medium">Exporting...</div>
                <div className="text-xs text-gray-400">Generating {selectedFormat.toUpperCase()} file</div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 text-right mt-1">{exportProgress}%</p>
          </div>
        ) : (
          <button
            onClick={selectedFormat === 'png' ? handleScreenshot : handleExport}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-lg text-white font-medium transition-all"
          >
            {selectedFormat === 'png' ? '📷 Take Screenshot' : `📤 Export as ${selectedFormat.toUpperCase()}`}
          </button>
        )}
      </div>

      {/* Quick Screenshot */}
      {selectedFormat !== 'png' && (
        <button
          onClick={handleScreenshot}
          className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 text-sm transition-colors"
        >
          📷 Quick Screenshot
        </button>
      )}

      {/* Platform Guides */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-white mb-2">Platform Compatibility</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <span>🎮</span> Unity
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>🎮</span> Unreal Engine
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>🌐</span> Web/Three.js
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>🥽</span> VRChat
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>📱</span> AR Quick Look
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>🎬</span> Blender
          </div>
        </div>
      </div>
    </div>
  );
}
