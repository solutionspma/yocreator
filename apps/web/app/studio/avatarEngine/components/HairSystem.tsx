'use client';

import React from 'react';
import { useAvatarStore, HairConfig, FacialHairConfig } from '../store';

// ============================================
// OMNI-AVATAR ENGINE - HAIR SYSTEM
// ============================================

// Slider Component
interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function Slider({ label, value, onChange, min = 0, max = 100 }: SliderProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm text-gray-300">{label}</label>
        <span className="text-xs text-gray-500">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  );
}

// Color Picker Component
function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <label className="text-sm text-gray-300 block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-2 border-gray-600"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

// Section Header
function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
      {title}
    </h3>
  );
}

// Hair Style Grid Item
interface StyleItemProps {
  name: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
}

function StyleItem({ name, selected, onClick, icon }: StyleItemProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all ${
        selected
          ? 'border-purple-500 bg-purple-500/20'
          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
      }`}
    >
      <div className="text-2xl mb-1">{icon || '💇'}</div>
      <div className="text-xs text-gray-300 truncate">{name}</div>
    </button>
  );
}

// Hair Styles Data
const hairStyles = [
  { id: 'bald', name: 'Bald', icon: '🔘' },
  { id: 'buzz', name: 'Buzz Cut', icon: '👨' },
  { id: 'fade', name: 'Fade', icon: '💇‍♂️' },
  { id: 'crew', name: 'Crew Cut', icon: '👱‍♂️' },
  { id: 'pompadour', name: 'Pompadour', icon: '🎸' },
  { id: 'quiff', name: 'Quiff', icon: '🌊' },
  { id: 'undercut', name: 'Undercut', icon: '✂️' },
  { id: 'mohawk', name: 'Mohawk', icon: '🦝' },
  { id: 'short_curly', name: 'Short Curly', icon: '🌀' },
  { id: 'medium_wavy', name: 'Medium Wavy', icon: '〰️' },
  { id: 'long_straight', name: 'Long Straight', icon: '📏' },
  { id: 'long_curly', name: 'Long Curly', icon: '🎀' },
  { id: 'afro', name: 'Afro', icon: '☁️' },
  { id: 'cornrows', name: 'Cornrows', icon: '➿' },
  { id: 'dreadlocks', name: 'Dreadlocks', icon: '🎭' },
  { id: 'braids', name: 'Braids', icon: '🎗️' },
  { id: 'bob', name: 'Bob', icon: '💁‍♀️' },
  { id: 'pixie', name: 'Pixie', icon: '🧚' },
  { id: 'mullet', name: 'Mullet', icon: '🎤' },
  { id: 'man_bun', name: 'Man Bun', icon: '🧘' },
];

// Hair Colors Presets
const hairColors = [
  { name: 'Black', color: '#1a1a1a' },
  { name: 'Dark Brown', color: '#3d2314' },
  { name: 'Brown', color: '#5c3317' },
  { name: 'Light Brown', color: '#8b5a2b' },
  { name: 'Auburn', color: '#8b3a3a' },
  { name: 'Red', color: '#a52a2a' },
  { name: 'Ginger', color: '#d2691e' },
  { name: 'Blonde', color: '#e6be8a' },
  { name: 'Platinum', color: '#e5e4e2' },
  { name: 'Gray', color: '#808080' },
  { name: 'White', color: '#f5f5f5' },
  { name: 'Blue', color: '#4169e1' },
  { name: 'Purple', color: '#8b008b' },
  { name: 'Pink', color: '#ff69b4' },
  { name: 'Green', color: '#228b22' },
  { name: 'Teal', color: '#008080' },
];

// Hair Textures
const hairTextures: HairConfig['texture'][] = [
  'straight',
  'wavy',
  'curly',
  'coily',
  'locs',
  'braids',
];

// Facial Hair Styles
const facialHairStyles = [
  { id: 'none', name: 'Clean Shaven', icon: '😐' },
  { id: 'stubble', name: 'Stubble', icon: '🔘' },
  { id: 'goatee', name: 'Goatee', icon: '🎯' },
  { id: 'van_dyke', name: 'Van Dyke', icon: '🎭' },
  { id: 'chin_strap', name: 'Chin Strap', icon: '⌒' },
  { id: 'soul_patch', name: 'Soul Patch', icon: '▪️' },
  { id: 'mustache', name: 'Mustache', icon: '👨' },
  { id: 'handlebar', name: 'Handlebar', icon: '〽️' },
  { id: 'short_beard', name: 'Short Beard', icon: '🧔' },
  { id: 'medium_beard', name: 'Medium Beard', icon: '🧔‍♂️' },
  { id: 'full_beard', name: 'Full Beard', icon: '🧙' },
  { id: 'mutton_chops', name: 'Mutton Chops', icon: '🐑' },
];

export default function HairTab() {
  const { avatar, updateHair, updateFacialHair } = useAvatarStore();
  const hair = avatar.hair;
  const facialHair = avatar.facialHair;

  return (
    <div className="space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
      {/* Hair Style */}
      <div>
        <SectionHeader title="Hair Style" />
        <div className="grid grid-cols-4 gap-2">
          {hairStyles.map((style) => (
            <StyleItem
              key={style.id}
              name={style.name}
              icon={style.icon}
              selected={hair.style === style.id}
              onClick={() => updateHair({ style: style.id })}
            />
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div>
        <h4 className="text-sm font-medium text-purple-400 mb-3">Hair Color</h4>
        <div className="grid grid-cols-8 gap-2 mb-4">
          {hairColors.map((preset) => (
            <button
              key={preset.name}
              onClick={() => updateHair({ color: preset.color })}
              className={`aspect-square rounded-lg border-2 transition-all ${
                hair.color === preset.color ? 'border-purple-500 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: preset.color }}
              title={preset.name}
            />
          ))}
        </div>
        <ColorPicker
          label="Custom Color"
          value={hair.color}
          onChange={(color) => updateHair({ color })}
        />
        <ColorPicker
          label="Secondary/Highlight Color"
          value={hair.secondaryColor}
          onChange={(color) => updateHair({ secondaryColor: color })}
        />
      </div>

      {/* Hair Texture */}
      <div>
        <h4 className="text-sm font-medium text-purple-400 mb-3">Hair Texture</h4>
        <div className="grid grid-cols-3 gap-2">
          {hairTextures.map((texture) => (
            <button
              key={texture}
              onClick={() => updateHair({ texture })}
              className={`px-3 py-2 rounded capitalize text-sm transition-colors ${
                hair.texture === texture
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {texture}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Properties */}
      <div>
        <h4 className="text-sm font-medium text-purple-400 mb-3">Hair Properties</h4>
        <Slider
          label="Length"
          value={hair.length}
          onChange={(v) => updateHair({ length: v })}
        />
        <Slider
          label="Volume"
          value={hair.volume}
          onChange={(v) => updateHair({ volume: v })}
        />
      </div>

      {/* Facial Hair (only for male/neutral) */}
      {(avatar.gender === 'male' || avatar.gender === 'neutral') && (
        <div>
          <SectionHeader title="Facial Hair" />
          <div className="grid grid-cols-4 gap-2 mb-4">
            {facialHairStyles.map((style) => (
              <StyleItem
                key={style.id}
                name={style.name}
                icon={style.icon}
                selected={facialHair.style === style.id}
                onClick={() => updateFacialHair({ style: style.id })}
              />
            ))}
          </div>
          
          {facialHair.style !== 'none' && (
            <>
              <ColorPicker
                label="Facial Hair Color"
                value={facialHair.color}
                onChange={(color) => updateFacialHair({ color })}
              />
              <Slider
                label="Density"
                value={facialHair.density}
                onChange={(v) => updateFacialHair({ density: v })}
              />
              <Slider
                label="Length"
                value={facialHair.length}
                onChange={(v) => updateFacialHair({ length: v })}
              />
            </>
          )}
        </div>
      )}

      {/* Eyebrows */}
      <div>
        <h4 className="text-sm font-medium text-purple-400 mb-3">Eyebrows</h4>
        <div className="grid grid-cols-4 gap-2">
          {['thin', 'natural', 'thick', 'bushy'].map((brow) => (
            <button
              key={brow}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white capitalize transition-colors"
            >
              {brow}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
