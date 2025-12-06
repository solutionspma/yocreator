'use client';

import React from 'react';
import { useAvatarStore } from '../store';

// ============================================
// OMNI-AVATAR ENGINE - ACCESSORIES SYSTEM
// ============================================

// Section Header
function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
      {title}
    </h3>
  );
}

// Accessory Item Card
interface AccessoryItemProps {
  name: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
}

function AccessoryItem({ name, selected, onClick, icon }: AccessoryItemProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all ${
        selected
          ? 'border-purple-500 bg-purple-500/20'
          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
      }`}
    >
      <div className="text-2xl mb-1">{icon || '💍'}</div>
      <div className="text-xs text-gray-300 truncate">{name}</div>
    </button>
  );
}

// Accessories Data
const glassesStyles = [
  { id: null, name: 'None', icon: '❌' },
  { id: 'reading', name: 'Reading', icon: '👓' },
  { id: 'aviator', name: 'Aviator', icon: '🕶️' },
  { id: 'wayfarer', name: 'Wayfarer', icon: '😎' },
  { id: 'round', name: 'Round', icon: '🔘' },
  { id: 'cat_eye', name: 'Cat Eye', icon: '🐱' },
  { id: 'sport', name: 'Sport', icon: '🏃' },
  { id: 'square', name: 'Square', icon: '⬜' },
  { id: 'rimless', name: 'Rimless', icon: '👁️' },
  { id: 'oversized', name: 'Oversized', icon: '🌟' },
  { id: 'wire_frame', name: 'Wire Frame', icon: '〰️' },
  { id: 'monocle', name: 'Monocle', icon: '🧐' },
];

const hatStyles = [
  { id: null, name: 'None', icon: '❌' },
  { id: 'baseball', name: 'Baseball Cap', icon: '🧢' },
  { id: 'beanie', name: 'Beanie', icon: '🎿' },
  { id: 'fedora', name: 'Fedora', icon: '🎩' },
  { id: 'bucket', name: 'Bucket Hat', icon: '🪣' },
  { id: 'cowboy', name: 'Cowboy', icon: '🤠' },
  { id: 'beret', name: 'Beret', icon: '🎨' },
  { id: 'snapback', name: 'Snapback', icon: '⚡' },
  { id: 'visor', name: 'Visor', icon: '☀️' },
  { id: 'headband', name: 'Headband', icon: '🎾' },
  { id: 'bandana', name: 'Bandana', icon: '🏴‍☠️' },
  { id: 'turban', name: 'Turban', icon: '🧕' },
];

const earringStyles = [
  { id: null, name: 'None', icon: '❌' },
  { id: 'stud', name: 'Studs', icon: '💎' },
  { id: 'hoop', name: 'Hoops', icon: '⭕' },
  { id: 'drop', name: 'Drop', icon: '💧' },
  { id: 'dangle', name: 'Dangle', icon: '🎐' },
  { id: 'cuff', name: 'Ear Cuff', icon: '🔗' },
  { id: 'gauges', name: 'Gauges', icon: '🔵' },
];

const necklaceStyles = [
  { id: null, name: 'None', icon: '❌' },
  { id: 'chain', name: 'Chain', icon: '⛓️' },
  { id: 'pendant', name: 'Pendant', icon: '📿' },
  { id: 'choker', name: 'Choker', icon: '⭕' },
  { id: 'rope', name: 'Rope Chain', icon: '🪢' },
  { id: 'cuban', name: 'Cuban Link', icon: '🔗' },
  { id: 'cross', name: 'Cross', icon: '✝️' },
  { id: 'beaded', name: 'Beaded', icon: '📿' },
];

const watchStyles = [
  { id: null, name: 'None', icon: '❌' },
  { id: 'silver', name: 'Silver', icon: '⌚' },
  { id: 'gold', name: 'Gold', icon: '🥇' },
  { id: 'rose_gold', name: 'Rose Gold', icon: '🌹' },
  { id: 'leather', name: 'Leather', icon: '🟫' },
  { id: 'smart', name: 'Smart Watch', icon: '📱' },
  { id: 'sport', name: 'Sport', icon: '⏱️' },
];

const ringStyles = [
  { id: 'plain', name: 'Plain Band', icon: '💍' },
  { id: 'signet', name: 'Signet', icon: '🏛️' },
  { id: 'diamond', name: 'Diamond', icon: '💎' },
  { id: 'wedding', name: 'Wedding', icon: '❤️' },
  { id: 'championship', name: 'Championship', icon: '🏆' },
];

const otherAccessories = [
  { id: 'scarf', name: 'Scarf', icon: '🧣' },
  { id: 'tie', name: 'Tie', icon: '👔' },
  { id: 'bow_tie', name: 'Bow Tie', icon: '🎀' },
  { id: 'belt', name: 'Belt', icon: '🔘' },
  { id: 'suspenders', name: 'Suspenders', icon: '📎' },
  { id: 'backpack', name: 'Backpack', icon: '🎒' },
  { id: 'messenger', name: 'Messenger Bag', icon: '💼' },
  { id: 'purse', name: 'Purse', icon: '👜' },
  { id: 'gloves', name: 'Gloves', icon: '🧤' },
  { id: 'mask', name: 'Face Mask', icon: '😷' },
  { id: 'headphones', name: 'Headphones', icon: '🎧' },
  { id: 'airpods', name: 'Earbuds', icon: '🎵' },
];

export default function AccessoriesTab() {
  const { avatar, updateAccessories } = useAvatarStore();
  const accessories = avatar.accessories;

  // Toggle ring
  const toggleRing = (ringId: string) => {
    const currentRings = accessories.rings || [];
    if (currentRings.includes(ringId)) {
      updateAccessories({ rings: currentRings.filter(r => r !== ringId) });
    } else {
      updateAccessories({ rings: [...currentRings, ringId] });
    }
  };

  // Toggle other accessories
  const toggleOther = (itemId: string) => {
    const currentOther = accessories.other || [];
    if (currentOther.includes(itemId)) {
      updateAccessories({ other: currentOther.filter(o => o !== itemId) });
    } else {
      updateAccessories({ other: [...currentOther, itemId] });
    }
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
      {/* Glasses */}
      <div>
        <SectionHeader title="Eyewear" />
        <div className="grid grid-cols-4 gap-2">
          {glassesStyles.map((style) => (
            <AccessoryItem
              key={style.id || 'none'}
              name={style.name}
              icon={style.icon}
              selected={accessories.glasses === style.id}
              onClick={() => updateAccessories({ glasses: style.id })}
            />
          ))}
        </div>
      </div>

      {/* Hats */}
      <div>
        <SectionHeader title="Headwear" />
        <div className="grid grid-cols-4 gap-2">
          {hatStyles.map((style) => (
            <AccessoryItem
              key={style.id || 'none'}
              name={style.name}
              icon={style.icon}
              selected={accessories.hat === style.id}
              onClick={() => updateAccessories({ hat: style.id })}
            />
          ))}
        </div>
      </div>

      {/* Earrings */}
      <div>
        <SectionHeader title="Earrings" />
        <div className="grid grid-cols-4 gap-2">
          {earringStyles.map((style) => (
            <AccessoryItem
              key={style.id || 'none'}
              name={style.name}
              icon={style.icon}
              selected={accessories.earrings === style.id}
              onClick={() => updateAccessories({ earrings: style.id })}
            />
          ))}
        </div>
      </div>

      {/* Necklaces */}
      <div>
        <SectionHeader title="Necklaces" />
        <div className="grid grid-cols-4 gap-2">
          {necklaceStyles.map((style) => (
            <AccessoryItem
              key={style.id || 'none'}
              name={style.name}
              icon={style.icon}
              selected={accessories.necklace === style.id}
              onClick={() => updateAccessories({ necklace: style.id })}
            />
          ))}
        </div>
      </div>

      {/* Watches */}
      <div>
        <SectionHeader title="Watches" />
        <div className="grid grid-cols-4 gap-2">
          {watchStyles.map((style) => (
            <AccessoryItem
              key={style.id || 'none'}
              name={style.name}
              icon={style.icon}
              selected={accessories.watch === style.id}
              onClick={() => updateAccessories({ watch: style.id })}
            />
          ))}
        </div>
      </div>

      {/* Rings (multi-select) */}
      <div>
        <SectionHeader title="Rings" />
        <p className="text-xs text-gray-500 mb-2">Select multiple</p>
        <div className="grid grid-cols-4 gap-2">
          {ringStyles.map((style) => (
            <AccessoryItem
              key={style.id}
              name={style.name}
              icon={style.icon}
              selected={accessories.rings?.includes(style.id) || false}
              onClick={() => toggleRing(style.id)}
            />
          ))}
        </div>
      </div>

      {/* Other Accessories (multi-select) */}
      <div>
        <SectionHeader title="Other Accessories" />
        <p className="text-xs text-gray-500 mb-2">Select multiple</p>
        <div className="grid grid-cols-4 gap-2">
          {otherAccessories.map((item) => (
            <AccessoryItem
              key={item.id}
              name={item.name}
              icon={item.icon}
              selected={accessories.other?.includes(item.id) || false}
              onClick={() => toggleOther(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Active Accessories Summary */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-purple-400 mb-2">Currently Wearing</h4>
        <div className="flex flex-wrap gap-2">
          {accessories.glasses && (
            <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs rounded">
              {glassesStyles.find(s => s.id === accessories.glasses)?.name || accessories.glasses}
            </span>
          )}
          {accessories.hat && (
            <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs rounded">
              {hatStyles.find(s => s.id === accessories.hat)?.name || accessories.hat}
            </span>
          )}
          {accessories.earrings && (
            <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs rounded">
              {earringStyles.find(s => s.id === accessories.earrings)?.name || accessories.earrings}
            </span>
          )}
          {accessories.necklace && (
            <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs rounded">
              {necklaceStyles.find(s => s.id === accessories.necklace)?.name || accessories.necklace}
            </span>
          )}
          {accessories.watch && (
            <span className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs rounded">
              {watchStyles.find(s => s.id === accessories.watch)?.name || accessories.watch} Watch
            </span>
          )}
          {accessories.rings?.map(ring => (
            <span key={ring} className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs rounded">
              {ringStyles.find(s => s.id === ring)?.name || ring}
            </span>
          ))}
          {accessories.other?.map(item => (
            <span key={item} className="px-2 py-1 bg-purple-500/30 text-purple-300 text-xs rounded">
              {otherAccessories.find(o => o.id === item)?.name || item}
            </span>
          ))}
          {!accessories.glasses && !accessories.hat && !accessories.earrings && 
           !accessories.necklace && !accessories.watch && !accessories.rings?.length && 
           !accessories.other?.length && (
            <span className="text-gray-500 text-xs">No accessories selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
