'use client';

import React from 'react';
import { useAvatarStore } from '../store';

// ============================================
// OMNI-AVATAR ENGINE - CLOTHING SYSTEM
// ============================================

// Color Picker Component
function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-600"
        />
        <span className="text-xs text-gray-500">{value}</span>
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

// Clothing Item Card
interface ClothingItemProps {
  name: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
  preview?: string;
}

function ClothingItem({ name, selected, onClick, icon }: ClothingItemProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all ${
        selected
          ? 'border-purple-500 bg-purple-500/20'
          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
      }`}
    >
      <div className="text-2xl mb-1">{icon || '👕'}</div>
      <div className="text-xs text-gray-300 truncate">{name}</div>
    </button>
  );
}

// Clothing Data
const topStyles = [
  { id: 't_shirt', name: 'T-Shirt', icon: '👕' },
  { id: 'polo', name: 'Polo', icon: '🎽' },
  { id: 'dress_shirt', name: 'Dress Shirt', icon: '👔' },
  { id: 'henley', name: 'Henley', icon: '🧥' },
  { id: 'sweater', name: 'Sweater', icon: '🧶' },
  { id: 'hoodie', name: 'Hoodie', icon: '🪝' },
  { id: 'blazer', name: 'Blazer', icon: '🤵' },
  { id: 'suit_jacket', name: 'Suit Jacket', icon: '🎩' },
  { id: 'tank_top', name: 'Tank Top', icon: '🎽' },
  { id: 'turtleneck', name: 'Turtleneck', icon: '🐢' },
  { id: 'cardigan', name: 'Cardigan', icon: '🧥' },
  { id: 'vest', name: 'Vest', icon: '🦺' },
  { id: 'crop_top', name: 'Crop Top', icon: '✂️' },
  { id: 'blouse', name: 'Blouse', icon: '👚' },
  { id: 'tunic', name: 'Tunic', icon: '👗' },
  { id: 'none', name: 'Shirtless', icon: '💪' },
];

const bottomStyles = [
  { id: 'jeans', name: 'Jeans', icon: '👖' },
  { id: 'chinos', name: 'Chinos', icon: '🩳' },
  { id: 'dress_pants', name: 'Dress Pants', icon: '👔' },
  { id: 'shorts', name: 'Shorts', icon: '🩳' },
  { id: 'joggers', name: 'Joggers', icon: '🏃' },
  { id: 'sweatpants', name: 'Sweatpants', icon: '🧘' },
  { id: 'cargo_pants', name: 'Cargo Pants', icon: '📦' },
  { id: 'leggings', name: 'Leggings', icon: '🦵' },
  { id: 'skirt', name: 'Skirt', icon: '👗' },
  { id: 'pencil_skirt', name: 'Pencil Skirt', icon: '✏️' },
  { id: 'maxi_skirt', name: 'Maxi Skirt', icon: '🌊' },
  { id: 'pleated_skirt', name: 'Pleated', icon: '📃' },
];

const shoeStyles = [
  { id: 'sneakers', name: 'Sneakers', icon: '👟' },
  { id: 'running_shoes', name: 'Running', icon: '🏃' },
  { id: 'loafers', name: 'Loafers', icon: '🥿' },
  { id: 'oxford', name: 'Oxford', icon: '👞' },
  { id: 'boots', name: 'Boots', icon: '🥾' },
  { id: 'chelsea_boots', name: 'Chelsea', icon: '🥾' },
  { id: 'sandals', name: 'Sandals', icon: '🩴' },
  { id: 'heels', name: 'Heels', icon: '👠' },
  { id: 'flats', name: 'Flats', icon: '🥿' },
  { id: 'slides', name: 'Slides', icon: '🩴' },
  { id: 'barefoot', name: 'Barefoot', icon: '🦶' },
  { id: 'dress_shoes', name: 'Dress Shoes', icon: '👞' },
];

const outerwearStyles = [
  { id: 'none', name: 'None', icon: '❌' },
  { id: 'jacket', name: 'Jacket', icon: '🧥' },
  { id: 'coat', name: 'Coat', icon: '🧥' },
  { id: 'trench', name: 'Trench Coat', icon: '🕵️' },
  { id: 'parka', name: 'Parka', icon: '❄️' },
  { id: 'bomber', name: 'Bomber', icon: '✈️' },
  { id: 'leather', name: 'Leather', icon: '🏍️' },
  { id: 'denim', name: 'Denim Jacket', icon: '🎸' },
  { id: 'puffer', name: 'Puffer', icon: '☁️' },
  { id: 'windbreaker', name: 'Windbreaker', icon: '💨' },
  { id: 'cape', name: 'Cape', icon: '🦸' },
  { id: 'poncho', name: 'Poncho', icon: '🎭' },
];

const materials = [
  'cotton', 'linen', 'silk', 'wool', 'polyester', 
  'denim', 'leather', 'suede', 'velvet', 'satin'
];

// Preset Outfits
const outfitPresets = [
  {
    name: 'Business',
    icon: '💼',
    top: { style: 'dress_shirt', primaryColor: '#ffffff', secondaryColor: '#1a1a1a', material: 'cotton' },
    bottom: { style: 'dress_pants', primaryColor: '#1a1a1a', secondaryColor: '#1a1a1a', material: 'wool' },
    shoes: { style: 'oxford', primaryColor: '#2d1f1a', secondaryColor: '#1a1a1a' },
    outerwear: { style: 'blazer', primaryColor: '#1e3a5f', secondaryColor: '#1a1a1a' },
  },
  {
    name: 'Casual',
    icon: '👕',
    top: { style: 't_shirt', primaryColor: '#2d4a6f', secondaryColor: '#ffffff', material: 'cotton' },
    bottom: { style: 'jeans', primaryColor: '#3d5a80', secondaryColor: '#3d5a80', material: 'denim' },
    shoes: { style: 'sneakers', primaryColor: '#ffffff', secondaryColor: '#1a1a1a' },
    outerwear: null,
  },
  {
    name: 'Athletic',
    icon: '🏃',
    top: { style: 'tank_top', primaryColor: '#ff6b35', secondaryColor: '#1a1a1a', material: 'polyester' },
    bottom: { style: 'joggers', primaryColor: '#1a1a1a', secondaryColor: '#ff6b35', material: 'polyester' },
    shoes: { style: 'running_shoes', primaryColor: '#ff6b35', secondaryColor: '#ffffff' },
    outerwear: null,
  },
  {
    name: 'Streetwear',
    icon: '🛹',
    top: { style: 'hoodie', primaryColor: '#1a1a1a', secondaryColor: '#ffffff', material: 'cotton' },
    bottom: { style: 'cargo_pants', primaryColor: '#6b705c', secondaryColor: '#1a1a1a', material: 'cotton' },
    shoes: { style: 'sneakers', primaryColor: '#ffffff', secondaryColor: '#e63946' },
    outerwear: null,
  },
  {
    name: 'Formal',
    icon: '🎩',
    top: { style: 'dress_shirt', primaryColor: '#ffffff', secondaryColor: '#1a1a1a', material: 'silk' },
    bottom: { style: 'dress_pants', primaryColor: '#1a1a1a', secondaryColor: '#1a1a1a', material: 'wool' },
    shoes: { style: 'dress_shoes', primaryColor: '#1a1a1a', secondaryColor: '#1a1a1a' },
    outerwear: { style: 'suit_jacket', primaryColor: '#1a1a1a', secondaryColor: '#ffffff' },
  },
  {
    name: 'Summer',
    icon: '☀️',
    top: { style: 'polo', primaryColor: '#81b29a', secondaryColor: '#ffffff', material: 'cotton' },
    bottom: { style: 'shorts', primaryColor: '#f2e9e4', secondaryColor: '#f2e9e4', material: 'linen' },
    shoes: { style: 'sandals', primaryColor: '#6d4c41', secondaryColor: '#6d4c41' },
    outerwear: null,
  },
];

export default function ClothingTab() {
  const { avatar, updateClothing } = useAvatarStore();
  const clothing = avatar.clothing;

  // Apply preset outfit
  const applyPreset = (preset: typeof outfitPresets[0]) => {
    updateClothing('top', preset.top);
    updateClothing('bottom', preset.bottom);
    updateClothing('shoes', preset.shoes);
    updateClothing('outerwear', preset.outerwear);
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
      {/* Quick Presets */}
      <div>
        <SectionHeader title="Quick Outfits" />
        <div className="grid grid-cols-3 gap-2">
          {outfitPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="p-3 rounded-lg border border-gray-700 bg-gray-800 hover:border-purple-500 transition-all"
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="text-xs text-gray-300">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Top / Shirt */}
      <div>
        <SectionHeader title="Top" />
        <div className="grid grid-cols-4 gap-2 mb-4">
          {topStyles.map((style) => (
            <ClothingItem
              key={style.id}
              name={style.name}
              icon={style.icon}
              selected={clothing.top.style === style.id}
              onClick={() => updateClothing('top', { ...clothing.top, style: style.id })}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker
            label="Primary Color"
            value={clothing.top.primaryColor}
            onChange={(color) => updateClothing('top', { ...clothing.top, primaryColor: color })}
          />
          <ColorPicker
            label="Secondary Color"
            value={clothing.top.secondaryColor}
            onChange={(color) => updateClothing('top', { ...clothing.top, secondaryColor: color })}
          />
        </div>
        <div className="mt-2">
          <label className="text-xs text-gray-400 block mb-2">Material</label>
          <div className="flex flex-wrap gap-1">
            {materials.map((mat) => (
              <button
                key={mat}
                onClick={() => updateClothing('top', { ...clothing.top, material: mat })}
                className={`px-2 py-1 text-xs rounded capitalize ${
                  clothing.top.material === mat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom / Pants */}
      <div>
        <SectionHeader title="Bottom" />
        <div className="grid grid-cols-4 gap-2 mb-4">
          {bottomStyles.map((style) => (
            <ClothingItem
              key={style.id}
              name={style.name}
              icon={style.icon}
              selected={clothing.bottom.style === style.id}
              onClick={() => updateClothing('bottom', { ...clothing.bottom, style: style.id })}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker
            label="Primary Color"
            value={clothing.bottom.primaryColor}
            onChange={(color) => updateClothing('bottom', { ...clothing.bottom, primaryColor: color })}
          />
          <ColorPicker
            label="Secondary Color"
            value={clothing.bottom.secondaryColor}
            onChange={(color) => updateClothing('bottom', { ...clothing.bottom, secondaryColor: color })}
          />
        </div>
      </div>

      {/* Shoes */}
      <div>
        <SectionHeader title="Shoes" />
        <div className="grid grid-cols-4 gap-2 mb-4">
          {shoeStyles.map((style) => (
            <ClothingItem
              key={style.id}
              name={style.name}
              icon={style.icon}
              selected={clothing.shoes.style === style.id}
              onClick={() => updateClothing('shoes', { ...clothing.shoes, style: style.id })}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker
            label="Primary Color"
            value={clothing.shoes.primaryColor}
            onChange={(color) => updateClothing('shoes', { ...clothing.shoes, primaryColor: color })}
          />
          <ColorPicker
            label="Secondary Color"
            value={clothing.shoes.secondaryColor}
            onChange={(color) => updateClothing('shoes', { ...clothing.shoes, secondaryColor: color })}
          />
        </div>
      </div>

      {/* Outerwear */}
      <div>
        <SectionHeader title="Outerwear" />
        <div className="grid grid-cols-4 gap-2 mb-4">
          {outerwearStyles.map((style) => (
            <ClothingItem
              key={style.id}
              name={style.name}
              icon={style.icon}
              selected={clothing.outerwear?.style === style.id || (!clothing.outerwear && style.id === 'none')}
              onClick={() => {
                if (style.id === 'none') {
                  updateClothing('outerwear', null);
                } else {
                  updateClothing('outerwear', {
                    style: style.id,
                    primaryColor: clothing.outerwear?.primaryColor || '#1a1a1a',
                    secondaryColor: clothing.outerwear?.secondaryColor || '#ffffff',
                  });
                }
              }}
            />
          ))}
        </div>
        {clothing.outerwear && (
          <div className="grid grid-cols-2 gap-4">
            <ColorPicker
              label="Primary Color"
              value={clothing.outerwear.primaryColor}
              onChange={(color) => updateClothing('outerwear', { ...clothing.outerwear!, primaryColor: color })}
            />
            <ColorPicker
              label="Secondary Color"
              value={clothing.outerwear.secondaryColor}
              onChange={(color) => updateClothing('outerwear', { ...clothing.outerwear!, secondaryColor: color })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
