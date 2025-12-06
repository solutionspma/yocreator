"use client";

import { useState, useCallback } from "react";
import { AvatarMorphs, defaultMorphs } from "./ProAvatarEngine";

interface ProAvatarControlsProps {
  onChange: (morphs: AvatarMorphs) => void;
  initialMorphs?: AvatarMorphs;
  className?: string;
}

// Skin tone presets
const SKIN_TONES = [
  { name: "Fair", color: "#FFDFC4" },
  { name: "Light", color: "#F0C8A0" },
  { name: "Medium Light", color: "#D4A574" },
  { name: "Medium", color: "#C68642" },
  { name: "Medium Dark", color: "#8D5524" },
  { name: "Dark", color: "#5C3A21" },
  { name: "Deep", color: "#3B2314" },
];

// Hair color presets
const HAIR_COLORS = [
  { name: "Black", color: "#1a1a1a" },
  { name: "Dark Brown", color: "#3b2314" },
  { name: "Brown", color: "#6b4423" },
  { name: "Auburn", color: "#8b4513" },
  { name: "Blonde", color: "#d4a574" },
  { name: "Platinum", color: "#e8dcc8" },
  { name: "Red", color: "#8b2500" },
  { name: "Gray", color: "#808080" },
  { name: "White", color: "#e8e8e8" },
];

// Clothing color presets
const CLOTHING_COLORS = [
  { name: "Black", color: "#1a1a1a" },
  { name: "White", color: "#ffffff" },
  { name: "Navy", color: "#1e3a5f" },
  { name: "Gray", color: "#4a5568" },
  { name: "Red", color: "#c53030" },
  { name: "Purple", color: "#6b46c1" },
  { name: "Green", color: "#276749" },
  { name: "Blue", color: "#2b6cb0" },
];

export default function ProAvatarControls({ 
  onChange, 
  initialMorphs,
  className = ""
}: ProAvatarControlsProps) {
  const [morphs, setMorphs] = useState<AvatarMorphs>(initialMorphs || defaultMorphs);
  const [activeCategory, setActiveCategory] = useState<"body" | "face" | "hair" | "clothing">("body");

  const update = useCallback((key: keyof AvatarMorphs, value: any) => {
    const newMorphs = { ...morphs, [key]: value };
    setMorphs(newMorphs);
    onChange(newMorphs);
  }, [morphs, onChange]);

  const categories = [
    { id: "body", label: "Body", icon: "👤" },
    { id: "face", label: "Face", icon: "😊" },
    { id: "hair", label: "Hair", icon: "💇" },
    { id: "clothing", label: "Clothing", icon: "👕" },
  ];

  return (
    <div className={`bg-zinc-900 rounded-xl text-white overflow-hidden ${className}`}>
      {/* Category tabs */}
      <div className="flex border-b border-zinc-800">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {/* BODY CONTROLS */}
        {activeCategory === "body" && (
          <>
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Gender</label>
              <div className="flex gap-2">
                <button
                  onClick={() => update("gender", "male")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    morphs.gender === "male"
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => update("gender", "female")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    morphs.gender === "female"
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Height: {Math.round(morphs.height * 72)}" ({(morphs.height * 6).toFixed(1)} ft)
              </label>
              <input
                type="range"
                min="0.83"
                max="1.25"
                step="0.01"
                value={morphs.height}
                onChange={(e) => update("height", parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5'0"</span>
                <span>6'0"</span>
                <span>7'6"</span>
              </div>
            </div>

            {/* Body Width */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Body Width: {Math.round((morphs.depth - 0.8) * 250)}%
              </label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.01"
                value={morphs.depth}
                onChange={(e) => update("depth", parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Skin Tone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Skin Tone</label>
              <div className="flex gap-2 flex-wrap">
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone.color}
                    onClick={() => update("skinColor", tone.color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      morphs.skinColor === tone.color
                        ? "border-violet-500 scale-110"
                        : "border-transparent hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: tone.color }}
                    title={tone.name}
                  />
                ))}
                <input
                  type="color"
                  value={morphs.skinColor}
                  onChange={(e) => update("skinColor", e.target.value)}
                  className="w-10 h-10 rounded-full cursor-pointer bg-transparent"
                  title="Custom color"
                />
              </div>
            </div>
          </>
        )}

        {/* FACE CONTROLS */}
        {activeCategory === "face" && (
          <>
            {/* Face Width */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Face Width
              </label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.01"
                value={morphs.faceWidth}
                onChange={(e) => update("faceWidth", parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Jaw Width */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Jaw Width
              </label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.01"
                value={morphs.jawWidth}
                onChange={(e) => update("jawWidth", parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Cheekbones */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Cheekbones
              </label>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={morphs.cheekbones}
                onChange={(e) => update("cheekbones", parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Nose Size */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Nose Size
              </label>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.01"
                value={morphs.noseSize}
                onChange={(e) => update("noseSize", parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Lip Fullness */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Lip Fullness
              </label>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.01"
                value={morphs.lipFullness}
                onChange={(e) => update("lipFullness", parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Eye Size */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Eye Size
              </label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.01"
                value={morphs.eyeSize}
                onChange={(e) => update("eyeSize", parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>

            {/* Eye Spacing */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Eye Spacing
              </label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.01"
                value={morphs.eyeSpacing}
                onChange={(e) => update("eyeSpacing", parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
          </>
        )}

        {/* HAIR CONTROLS */}
        {activeCategory === "hair" && (
          <>
            {/* Hair Style */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Hair Style</label>
              <select
                value={morphs.hair}
                onChange={(e) => update("hair", e.target.value)}
                className="w-full py-2 px-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-violet-500 focus:outline-none"
              >
                <option value="shortFade">Short Fade</option>
                <option value="afro">Afro</option>
                <option value="locs">Locs</option>
                <option value="buzz">Buzz Cut</option>
                <option value="bald">Bald</option>
              </select>
            </div>

            {/* Hair Color */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Hair Color</label>
              <div className="flex gap-2 flex-wrap">
                {HAIR_COLORS.map((color) => (
                  <button
                    key={color.color}
                    onClick={() => update("hairColor", color.color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      morphs.hairColor === color.color
                        ? "border-violet-500 scale-110"
                        : "border-transparent hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
                <input
                  type="color"
                  value={morphs.hairColor}
                  onChange={(e) => update("hairColor", e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer bg-transparent"
                />
              </div>
            </div>

            {/* Facial Hair */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Facial Hair</label>
              <select
                value={morphs.facialHair}
                onChange={(e) => update("facialHair", e.target.value)}
                className="w-full py-2 px-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-violet-500 focus:outline-none"
              >
                <option value="none">None</option>
                <option value="stubble">Stubble</option>
                <option value="mustache">Mustache</option>
                <option value="goatee">Goatee</option>
                <option value="beard">Full Beard</option>
              </select>
            </div>

            {/* Facial Hair Color */}
            {morphs.facialHair !== "none" && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Facial Hair Color</label>
                <div className="flex gap-2 flex-wrap">
                  {HAIR_COLORS.slice(0, 5).map((color) => (
                    <button
                      key={color.color}
                      onClick={() => update("facialHairColor", color.color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        morphs.facialHairColor === color.color
                          ? "border-violet-500 scale-110"
                          : "border-transparent hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: color.color }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* CLOTHING CONTROLS */}
        {activeCategory === "clothing" && (
          <>
            {/* Top Style */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Top</label>
              <select
                value={morphs.clothing}
                onChange={(e) => update("clothing", e.target.value)}
                className="w-full py-2 px-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-violet-500 focus:outline-none"
              >
                <option value="hoodie">Hoodie</option>
                <option value="blazer">Blazer</option>
                <option value="tank">Tank Top</option>
                <option value="jersey">Jersey</option>
              </select>
            </div>

            {/* Top Color */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Top Color</label>
              <div className="flex gap-2 flex-wrap">
                {CLOTHING_COLORS.map((color) => (
                  <button
                    key={color.color}
                    onClick={() => update("clothingColor", color.color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      morphs.clothingColor === color.color
                        ? "border-violet-500 scale-110"
                        : "border-transparent hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
                <input
                  type="color"
                  value={morphs.clothingColor}
                  onChange={(e) => update("clothingColor", e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer bg-transparent"
                />
              </div>
            </div>

            {/* Pants Style */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Pants</label>
              <select
                value={morphs.pantsStyle}
                onChange={(e) => update("pantsStyle", e.target.value)}
                className="w-full py-2 px-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-violet-500 focus:outline-none"
              >
                <option value="jeans">Jeans</option>
                <option value="shorts">Shorts</option>
                <option value="joggers">Joggers</option>
                <option value="dress">Dress Pants</option>
              </select>
            </div>

            {/* Pants Color */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Pants Color</label>
              <div className="flex gap-2 flex-wrap">
                {CLOTHING_COLORS.map((color) => (
                  <button
                    key={color.color}
                    onClick={() => update("pantsColor", color.color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      morphs.pantsColor === color.color
                        ? "border-violet-500 scale-110"
                        : "border-transparent hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Shoes Style */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Shoes</label>
              <select
                value={morphs.shoesStyle}
                onChange={(e) => update("shoesStyle", e.target.value)}
                className="w-full py-2 px-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-violet-500 focus:outline-none"
              >
                <option value="sneakers">Sneakers</option>
                <option value="boots">Boots</option>
                <option value="dress">Dress Shoes</option>
                <option value="sandals">Sandals</option>
              </select>
            </div>

            {/* Shoes Color */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Shoes Color</label>
              <div className="flex gap-2 flex-wrap">
                {CLOTHING_COLORS.map((color) => (
                  <button
                    key={color.color}
                    onClick={() => update("shoesColor", color.color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      morphs.shoesColor === color.color
                        ? "border-violet-500 scale-110"
                        : "border-transparent hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
