'use client';

import React from 'react';
import { useAvatarStore, defaultAnimalMorphs, AnimalType } from '../store';

// ============================================
// OMNI-AVATAR ENGINE - ANIMAL SYSTEM
// ============================================

// Slider Component
function Slider({ label, value, onChange, min = 0, max = 100 }: { 
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number 
}) {
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

// Animal Type Data
const animalTypes: { id: AnimalType; name: string; icon: string }[] = [
  { id: 'dog', name: 'Dog', icon: '🐕' },
  { id: 'cat', name: 'Cat', icon: '🐱' },
  { id: 'wolf', name: 'Wolf', icon: '🐺' },
  { id: 'fox', name: 'Fox', icon: '🦊' },
  { id: 'custom', name: 'Custom', icon: '🎨' },
];

// Dog Breeds
const dogBreeds = [
  { id: 'chihuahua', name: 'Chihuahua', icon: '🐕' },
  { id: 'poodle', name: 'Poodle', icon: '🐩' },
  { id: 'german_shepherd', name: 'German Shepherd', icon: '🦮' },
  { id: 'golden_retriever', name: 'Golden Retriever', icon: '🐕' },
  { id: 'labrador', name: 'Labrador', icon: '🐕‍🦺' },
  { id: 'bulldog', name: 'Bulldog', icon: '🐶' },
  { id: 'husky', name: 'Husky', icon: '🐺' },
  { id: 'corgi', name: 'Corgi', icon: '🦊' },
  { id: 'beagle', name: 'Beagle', icon: '🐕' },
  { id: 'shiba_inu', name: 'Shiba Inu', icon: '🐕' },
  { id: 'pug', name: 'Pug', icon: '🐶' },
  { id: 'french_bulldog', name: 'French Bulldog', icon: '🐶' },
];

// Cat Breeds
const catBreeds = [
  { id: 'siamese', name: 'Siamese', icon: '🐱' },
  { id: 'persian', name: 'Persian', icon: '🐱' },
  { id: 'maine_coon', name: 'Maine Coon', icon: '🦁' },
  { id: 'bengal', name: 'Bengal', icon: '🐆' },
  { id: 'sphynx', name: 'Sphynx', icon: '👽' },
  { id: 'scottish_fold', name: 'Scottish Fold', icon: '🐱' },
  { id: 'british_shorthair', name: 'British Shorthair', icon: '🐱' },
  { id: 'tabby', name: 'Tabby', icon: '🐈' },
];

// Fur Patterns
const furPatterns = [
  'solid', 'spotted', 'striped', 'brindle', 'merle', 
  'tuxedo', 'calico', 'tabby', 'sable', 'bicolor'
];

// Fur Colors
const furColors = [
  { name: 'Brown', color: '#8b4513' },
  { name: 'Tan', color: '#d4a574' },
  { name: 'Black', color: '#1a1a1a' },
  { name: 'White', color: '#f5f5f5' },
  { name: 'Gray', color: '#808080' },
  { name: 'Golden', color: '#daa520' },
  { name: 'Red', color: '#a52a2a' },
  { name: 'Cream', color: '#fffdd0' },
  { name: 'Orange', color: '#ff8c00' },
  { name: 'Chocolate', color: '#7b3f00' },
];

// Eye Colors
const eyeColors = [
  { name: 'Brown', color: '#3d2314' },
  { name: 'Amber', color: '#ffbf00' },
  { name: 'Green', color: '#228b22' },
  { name: 'Blue', color: '#4169e1' },
  { name: 'Hazel', color: '#8e7618' },
  { name: 'Yellow', color: '#ffd700' },
];

// Breed presets for quick setup
const breedPresets: Record<string, Partial<typeof defaultAnimalMorphs>> = {
  chihuahua: {
    type: 'dog',
    breed: 'chihuahua',
    size: 20,
    earSize: 85,
    earPosition: 75,
    snoutLength: 25,
    tailLength: 45,
    tailCurl: 60,
    legLength: 25,
    bodyLength: 35,
    furLength: 15,
    furColor: '#d4a574',
  },
  pug: {
    type: 'dog',
    breed: 'pug',
    size: 30,
    earSize: 30,
    earPosition: 40,
    snoutLength: 10,
    tailLength: 20,
    tailCurl: 90,
    legLength: 25,
    bodyLength: 40,
    furLength: 10,
    furColor: '#d4a574',
  },
  german_shepherd: {
    type: 'dog',
    breed: 'german_shepherd',
    size: 70,
    earSize: 70,
    earPosition: 80,
    snoutLength: 60,
    tailLength: 70,
    tailCurl: 20,
    legLength: 60,
    bodyLength: 65,
    furLength: 40,
    furColor: '#3d2314',
  },
  siamese: {
    type: 'cat',
    breed: 'siamese',
    size: 40,
    earSize: 75,
    earPosition: 70,
    snoutLength: 35,
    tailLength: 80,
    tailCurl: 30,
    legLength: 50,
    bodyLength: 55,
    furLength: 20,
    furColor: '#f5f5f5',
  },
  maine_coon: {
    type: 'cat',
    breed: 'maine_coon',
    size: 60,
    earSize: 55,
    earPosition: 65,
    snoutLength: 40,
    tailLength: 90,
    tailCurl: 20,
    legLength: 55,
    bodyLength: 60,
    furLength: 80,
    furColor: '#8b4513',
  },
};

export default function AnimalsTab() {
  const { avatar, setStyle, updateAnimal } = useAvatarStore();
  const animal = avatar.animal || defaultAnimalMorphs;
  const isAnimalMode = avatar.style === 'animal';

  // Switch to animal mode
  const enableAnimalMode = () => {
    if (!isAnimalMode) {
      setStyle('animal');
    }
  };

  // Switch back to human
  const disableAnimalMode = () => {
    setStyle('realistic');
  };

  // Get breeds based on animal type
  const getBreeds = () => {
    switch (animal.type) {
      case 'dog': return dogBreeds;
      case 'cat': return catBreeds;
      default: return [];
    }
  };

  // Apply breed preset
  const applyPreset = (breedId: string) => {
    const preset = breedPresets[breedId];
    if (preset) {
      updateAnimal(preset);
    }
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
      {/* Mode Toggle */}
      <div>
        <SectionHeader title="Avatar Type" />
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={disableAnimalMode}
            className={`p-4 rounded-lg border-2 transition-all ${
              !isAnimalMode
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="text-3xl mb-2">🧑</div>
            <div className="text-sm text-gray-300">Human</div>
          </button>
          <button
            onClick={enableAnimalMode}
            className={`p-4 rounded-lg border-2 transition-all ${
              isAnimalMode
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="text-3xl mb-2">🐕</div>
            <div className="text-sm text-gray-300">Animal</div>
          </button>
        </div>
      </div>

      {isAnimalMode && (
        <>
          {/* Animal Type */}
          <div>
            <SectionHeader title="Animal Type" />
            <div className="grid grid-cols-5 gap-2">
              {animalTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateAnimal({ type: type.id })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    animal.type === type.id
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-xs text-gray-300">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Breed Selection */}
          {(animal.type === 'dog' || animal.type === 'cat') && (
            <div>
              <SectionHeader title={animal.type === 'dog' ? 'Dog Breed' : 'Cat Breed'} />
              <div className="grid grid-cols-4 gap-2">
                {getBreeds().map((breed) => (
                  <button
                    key={breed.id}
                    onClick={() => {
                      updateAnimal({ breed: breed.id });
                      applyPreset(breed.id);
                    }}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      animal.breed === breed.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-xl mb-1">{breed.icon}</div>
                    <div className="text-xs text-gray-300 truncate">{breed.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Highlighted: Chihuahua Preset */}
          {animal.type === 'dog' && (
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🐕</span>
                <div>
                  <h4 className="text-white font-semibold">Chihuahua Mode</h4>
                  <p className="text-xs text-gray-400">Create your perfect tiny companion!</p>
                </div>
              </div>
              <button
                onClick={() => applyPreset('chihuahua')}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded text-sm text-white transition-colors"
              >
                Apply Chihuahua Preset
              </button>
            </div>
          )}

          {/* Body Morphs */}
          <div>
            <SectionHeader title="Body Shape" />
            <Slider
              label="Overall Size"
              value={animal.size}
              onChange={(v) => updateAnimal({ size: v })}
            />
            <Slider
              label="Body Length"
              value={animal.bodyLength}
              onChange={(v) => updateAnimal({ bodyLength: v })}
            />
            <Slider
              label="Leg Length"
              value={animal.legLength}
              onChange={(v) => updateAnimal({ legLength: v })}
            />
          </div>

          {/* Head Features */}
          <div>
            <SectionHeader title="Head Features" />
            <Slider
              label="Ear Size"
              value={animal.earSize}
              onChange={(v) => updateAnimal({ earSize: v })}
            />
            <Slider
              label="Ear Position"
              value={animal.earPosition}
              onChange={(v) => updateAnimal({ earPosition: v })}
            />
            <Slider
              label="Snout Length"
              value={animal.snoutLength}
              onChange={(v) => updateAnimal({ snoutLength: v })}
            />
          </div>

          {/* Tail */}
          <div>
            <SectionHeader title="Tail" />
            <Slider
              label="Tail Length"
              value={animal.tailLength}
              onChange={(v) => updateAnimal({ tailLength: v })}
            />
            <Slider
              label="Tail Curl"
              value={animal.tailCurl}
              onChange={(v) => updateAnimal({ tailCurl: v })}
            />
          </div>

          {/* Fur */}
          <div>
            <SectionHeader title="Fur" />
            <Slider
              label="Fur Length"
              value={animal.furLength}
              onChange={(v) => updateAnimal({ furLength: v })}
            />
            
            <div className="mb-4">
              <label className="text-sm text-gray-300 block mb-2">Fur Color</label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {furColors.map((fc) => (
                  <button
                    key={fc.name}
                    onClick={() => updateAnimal({ furColor: fc.color })}
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      animal.furColor === fc.color ? 'border-purple-500 scale-105' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: fc.color }}
                    title={fc.name}
                  />
                ))}
              </div>
              <ColorPicker
                label="Custom Fur Color"
                value={animal.furColor}
                onChange={(color) => updateAnimal({ furColor: color })}
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-300 block mb-2">Fur Pattern</label>
              <div className="grid grid-cols-5 gap-1">
                {furPatterns.map((pattern) => (
                  <button
                    key={pattern}
                    onClick={() => updateAnimal({ furPattern: pattern })}
                    className={`px-2 py-1 text-xs rounded capitalize ${
                      animal.furPattern === pattern
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Eye Color */}
          <div>
            <SectionHeader title="Eyes" />
            <div className="grid grid-cols-6 gap-2">
              {eyeColors.map((ec) => (
                <button
                  key={ec.name}
                  onClick={() => updateAnimal({ eyeColor: ec.color })}
                  className={`aspect-square rounded-full border-2 transition-all ${
                    animal.eyeColor === ec.color ? 'border-purple-500 scale-110' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: ec.color }}
                  title={ec.name}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {!isAnimalMode && (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🐕</div>
          <h4 className="text-white font-semibold mb-2">Create an Animal Avatar</h4>
          <p className="text-gray-400 text-sm mb-4">
            Switch to Animal mode to create dogs, cats, and other creatures!
          </p>
          <button
            onClick={enableAnimalMode}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors"
          >
            Enable Animal Mode
          </button>
        </div>
      )}
    </div>
  );
}
