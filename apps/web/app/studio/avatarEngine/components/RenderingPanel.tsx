'use client';

import React, { useState } from 'react';

export default function RenderingPanel() {
  const [resolution, setResolution] = useState('1080p');
  const [format, setFormat] = useState('png');
  const [background, setBackground] = useState('transparent');
  const [shadows, setShadows] = useState(true);
  const [antiAliasing, setAntiAliasing] = useState('4x');
  const [renderMode, setRenderMode] = useState('turntable');

  return (
    <div className="p-4">
      {/* Resolution */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>📐</span> Resolution
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {['720p', '1080p', '2K', '4K'].map((res) => (
            <button
              key={res}
              onClick={() => setResolution(res)}
              className={`py-2 rounded-lg text-sm transition ${
                resolution === res
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-[#2a2a4a] text-gray-400 hover:bg-[#3a3a5a]'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            placeholder="Width"
            className="flex-1 px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded text-sm"
            defaultValue={1920}
          />
          <span className="text-gray-400 self-center">×</span>
          <input
            type="number"
            placeholder="Height"
            className="flex-1 px-3 py-2 bg-[#2a2a4a] border border-[#3a3a5a] rounded text-sm"
            defaultValue={1080}
          />
        </div>
      </div>

      {/* Format */}
      <div className="mb-6 pt-4 border-t border-[#2a2a4a]">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>📷</span> Format
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {['png', 'jpg', 'webp'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt)}
              className={`py-2 rounded-lg text-sm uppercase transition ${
                format === fmt
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-[#2a2a4a] text-gray-400 hover:bg-[#3a3a5a]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Background */}
      <div className="mb-6 pt-4 border-t border-[#2a2a4a]">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>🎨</span> Background
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'transparent', label: 'Transparent', icon: '🔲' },
            { id: 'white', label: 'White', icon: '⬜' },
            { id: 'black', label: 'Black', icon: '⬛' },
            { id: 'gradient', label: 'Gradient', icon: '🌅' },
            { id: 'studio', label: 'Studio', icon: '📸' },
            { id: 'custom', label: 'Custom', icon: '🎨' },
          ].map((bg) => (
            <button
              key={bg.id}
              onClick={() => setBackground(bg.id)}
              className={`py-2 rounded-lg text-sm transition flex items-center justify-center gap-2 ${
                background === bg.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-[#2a2a4a] text-gray-400 hover:bg-[#3a3a5a]'
              }`}
            >
              <span>{bg.icon}</span>
              <span>{bg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Render Settings */}
      <div className="mb-6 pt-4 border-t border-[#2a2a4a]">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>⚙️</span> Quality
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">Shadows</span>
          <button
            onClick={() => setShadows(!shadows)}
            className={`w-12 h-6 rounded-full transition ${shadows ? 'bg-cyan-500' : 'bg-[#3a3a5a]'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition ${shadows ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="mb-3">
          <label className="text-sm text-gray-400 mb-2 block">Anti-Aliasing</label>
          <div className="grid grid-cols-4 gap-2">
            {['Off', '2x', '4x', '8x'].map((aa) => (
              <button
                key={aa}
                onClick={() => setAntiAliasing(aa)}
                className={`py-1 rounded text-xs transition ${
                  antiAliasing === aa
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-[#2a2a4a] text-gray-400 hover:bg-[#3a3a5a]'
                }`}
              >
                {aa}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Render Mode */}
      <div className="mb-6 pt-4 border-t border-[#2a2a4a]">
        <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span>🎬</span> Render Mode
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'single', label: 'Single Image', icon: '🖼️' },
            { id: 'turntable', label: 'Turntable', icon: '🔄' },
            { id: 'poses', label: 'Multiple Poses', icon: '📸' },
            { id: 'animation', label: 'Animation', icon: '🎥' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setRenderMode(mode.id)}
              className={`py-3 rounded-lg text-sm transition flex flex-col items-center gap-1 ${
                renderMode === mode.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                  : 'bg-[#2a2a4a] text-gray-400 hover:bg-[#3a3a5a]'
              }`}
            >
              <span className="text-xl">{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Render Button */}
      <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-bold text-lg transition">
        🚀 Render
      </button>
    </div>
  );
}
