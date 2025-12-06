'use client';

import React from 'react';
import { useAvatarStore, BodyMorphs, FaceMorphs, SkinConfig } from '../store';

// ============================================
// OMNI-AVATAR ENGINE - MORPH CONTROLS
// ============================================

// Slider Component
interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

function Slider({ label, value, onChange, min = 0, max = 100, step = 1, suffix = '' }: SliderProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm text-gray-300">{label}</label>
        <span className="text-xs text-gray-500">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
    </div>
  );
}

// Color Picker Component
interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
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

// Body Morphs Control Panel
export function BodyMorphControls() {
  const { avatar, updateBody } = useAvatarStore();
  const body = avatar.body;

  const bodySliders: { key: keyof BodyMorphs; label: string }[] = [
    { key: 'height', label: 'Height' },
    { key: 'weight', label: 'Weight' },
    { key: 'muscleDefinition', label: 'Muscle Definition' },
    { key: 'fatDistribution', label: 'Fat Distribution' },
    { key: 'shoulderWidth', label: 'Shoulder Width' },
    { key: 'hipWidth', label: 'Hip Width' },
    { key: 'armLength', label: 'Arm Length' },
    { key: 'legLength', label: 'Leg Length' },
    { key: 'neckLength', label: 'Neck Length' },
    { key: 'torsoLength', label: 'Torso Length' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Body Proportions" />
      
      {/* Quick Presets */}
      <div className="mb-6">
        <label className="text-sm text-gray-300 block mb-2">Body Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Average', height: 50, weight: 50, muscle: 50 },
            { name: 'Athletic', height: 55, weight: 45, muscle: 75 },
            { name: 'Slim', height: 55, weight: 30, muscle: 40 },
            { name: 'Heavy', height: 50, weight: 80, muscle: 50 },
            { name: 'Tall', height: 85, weight: 50, muscle: 50 },
            { name: 'Petite', height: 25, weight: 35, muscle: 40 },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                updateBody('height', preset.height);
                updateBody('weight', preset.weight);
                updateBody('muscleDefinition', preset.muscle);
              }}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Individual Sliders */}
      <div className="space-y-1">
        {bodySliders.map(({ key, label }) => (
          <Slider
            key={key}
            label={label}
            value={body[key]}
            onChange={(v) => updateBody(key, v)}
          />
        ))}
      </div>
    </div>
  );
}

// Face Morphs Control Panel
export function FaceMorphControls() {
  const { avatar, updateFace } = useAvatarStore();
  const face = avatar.face;

  const faceCategories: { title: string; sliders: { key: keyof FaceMorphs; label: string }[] }[] = [
    {
      title: 'Face Shape',
      sliders: [
        { key: 'faceWidth', label: 'Face Width' },
        { key: 'faceLength', label: 'Face Length' },
        { key: 'jawWidth', label: 'Jaw Width' },
        { key: 'jawHeight', label: 'Jaw Height' },
        { key: 'chinWidth', label: 'Chin Width' },
        { key: 'chinLength', label: 'Chin Length' },
        { key: 'cheekboneHeight', label: 'Cheekbone Height' },
        { key: 'cheekboneWidth', label: 'Cheekbone Width' },
        { key: 'foreheadHeight', label: 'Forehead Height' },
        { key: 'foreheadWidth', label: 'Forehead Width' },
      ],
    },
    {
      title: 'Eyes',
      sliders: [
        { key: 'eyeSize', label: 'Eye Size' },
        { key: 'eyeSpacing', label: 'Eye Spacing' },
        { key: 'eyeHeight', label: 'Eye Height' },
        { key: 'eyeTilt', label: 'Eye Tilt' },
        { key: 'browHeight', label: 'Brow Height' },
        { key: 'browThickness', label: 'Brow Thickness' },
      ],
    },
    {
      title: 'Nose',
      sliders: [
        { key: 'noseWidth', label: 'Nose Width' },
        { key: 'noseLength', label: 'Nose Length' },
        { key: 'noseBridge', label: 'Nose Bridge' },
        { key: 'nostrilSize', label: 'Nostril Size' },
      ],
    },
    {
      title: 'Mouth & Lips',
      sliders: [
        { key: 'lipWidth', label: 'Lip Width' },
        { key: 'lipFullnessUpper', label: 'Upper Lip Fullness' },
        { key: 'lipFullnessLower', label: 'Lower Lip Fullness' },
      ],
    },
    {
      title: 'Ears',
      sliders: [
        { key: 'earSize', label: 'Ear Size' },
        { key: 'earAngle', label: 'Ear Angle' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Facial Features" />
      
      {/* Face Shape Presets */}
      <div className="mb-6">
        <label className="text-sm text-gray-300 block mb-2">Face Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Oval', faceWidth: 45, faceLength: 55, jawWidth: 45 },
            { name: 'Round', faceWidth: 60, faceLength: 45, jawWidth: 55 },
            { name: 'Square', faceWidth: 55, faceLength: 50, jawWidth: 60 },
            { name: 'Heart', faceWidth: 55, faceLength: 50, jawWidth: 35 },
            { name: 'Long', faceWidth: 40, faceLength: 65, jawWidth: 40 },
            { name: 'Diamond', faceWidth: 45, faceLength: 55, jawWidth: 35 },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                updateFace('faceWidth', preset.faceWidth);
                updateFace('faceLength', preset.faceLength);
                updateFace('jawWidth', preset.jawWidth);
              }}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Sections */}
      {faceCategories.map((category) => (
        <div key={category.title} className="space-y-1">
          <h4 className="text-sm font-medium text-purple-400 mb-3">{category.title}</h4>
          {category.sliders.map(({ key, label }) => (
            <Slider
              key={key}
              label={label}
              value={face[key]}
              onChange={(v) => updateFace(key, v)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// Skin Control Panel
export function SkinControls() {
  const { avatar, updateSkin } = useAvatarStore();
  const skin = avatar.skin;

  const skinTonePresets = [
    { name: 'Fair', color: '#FFDFC4' },
    { name: 'Light', color: '#F0C8A0' },
    { name: 'Medium Light', color: '#DEB887' },
    { name: 'Medium', color: '#C68642' },
    { name: 'Medium Dark', color: '#8D5524' },
    { name: 'Dark', color: '#5C3317' },
    { name: 'Deep', color: '#3C1810' },
    { name: 'Rich', color: '#2D1506' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Skin & Appearance" />

      {/* Skin Tone Presets */}
      <div className="mb-6">
        <label className="text-sm text-gray-300 block mb-2">Skin Tone</label>
        <div className="grid grid-cols-4 gap-2">
          {skinTonePresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => updateSkin({ tone: preset.color })}
              className={`aspect-square rounded-lg border-2 transition-all ${
                skin.tone === preset.color ? 'border-purple-500 scale-105' : 'border-transparent'
              }`}
              style={{ backgroundColor: preset.color }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* Custom Color */}
      <ColorPicker
        label="Custom Skin Tone"
        value={skin.tone}
        onChange={(color) => updateSkin({ tone: color })}
      />

      {/* Undertone */}
      <div className="mb-4">
        <label className="text-sm text-gray-300 block mb-2">Undertone</label>
        <div className="flex gap-2">
          {(['warm', 'neutral', 'cool'] as const).map((undertone) => (
            <button
              key={undertone}
              onClick={() => updateSkin({ undertone })}
              className={`flex-1 px-3 py-2 rounded text-sm capitalize transition-colors ${
                skin.undertone === undertone
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {undertone}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Details */}
      <div className="space-y-1">
        <Slider
          label="Freckles"
          value={skin.freckles}
          onChange={(v) => updateSkin({ freckles: v })}
        />
        <Slider
          label="Blemishes"
          value={skin.blemishes}
          onChange={(v) => updateSkin({ blemishes: v })}
        />
        <Slider
          label="Wrinkles"
          value={skin.wrinkles}
          onChange={(v) => updateSkin({ wrinkles: v })}
        />
      </div>

      {/* Makeup Section */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-purple-400 mb-3">Makeup</h4>
        <Slider
          label="Foundation"
          value={skin.makeup.foundation}
          onChange={(v) => updateSkin({ makeup: { ...skin.makeup, foundation: v } })}
        />
        <Slider
          label="Blush"
          value={skin.makeup.blush}
          onChange={(v) => updateSkin({ makeup: { ...skin.makeup, blush: v } })}
        />
        <Slider
          label="Eyeliner"
          value={skin.makeup.eyeliner}
          onChange={(v) => updateSkin({ makeup: { ...skin.makeup, eyeliner: v } })}
        />
        <ColorPicker
          label="Lipstick"
          value={skin.makeup.lipstick || '#8b5a5a'}
          onChange={(color) => updateSkin({ makeup: { ...skin.makeup, lipstick: color } })}
        />
        <ColorPicker
          label="Eyeshadow"
          value={skin.makeup.eyeshadow || '#4a4a4a'}
          onChange={(color) => updateSkin({ makeup: { ...skin.makeup, eyeshadow: color } })}
        />
      </div>
    </div>
  );
}

// Combined Body Tab (Body + Skin)
export default function BodyTab() {
  return (
    <div className="space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
      <BodyMorphControls />
      <SkinControls />
    </div>
  );
}

// Face Tab Component
export function FaceTab() {
  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
      <FaceMorphControls />
    </div>
  );
}
