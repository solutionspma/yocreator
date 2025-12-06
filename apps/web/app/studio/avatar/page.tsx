"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ProAvatarEngine = dynamic(
  () => import("../../../components/avatar/ProAvatarEngine"),
  { ssr: false, loading: () => <PreviewLoader /> }
);

const ReadyPlayerMeFrame = dynamic(
  () => import("../../../components/avatar/ReadyPlayerMeFrame"),
  { ssr: false }
);

function PreviewLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-slate-700 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading Preview...</p>
      </div>
    </div>
  );
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

const HAIR_COLORS = [
  "#1a1a1a", "#3b2314", "#6b4423", "#8b4513", "#d4a574", "#e8dcc8", "#8b2500", "#808080"
];

const CLOTHING_COLORS = [
  "#1a1a1a", "#ffffff", "#1e3a5f", "#4a5568", "#c53030", "#6b46c1", "#276749", "#2b6cb0"
];

export interface AvatarState {
  // Body
  gender: "male" | "female";
  heightFeet: number;
  heightInches: number;
  weight: number;
  bodyType: string;
  muscleDefinition: number;
  // Face
  faceShape: string;
  skinTone: string;
  eyeColor: string;
  eyeShape: string;
  noseWidth: number;
  noseLength: number;
  lipFullness: number;
  jawWidth: number;
  cheekbones: number;
  // Hair
  hairStyle: string;
  hairColor: string;
  facialHair: string;
  facialHairColor: string;
  // Outfit
  topStyle: string;
  topColor: string;
  bottomStyle: string;
  bottomColor: string;
  shoesStyle: string;
  shoesColor: string;
  // Extras
  glasses: string;
  hat: string;
  accessories: string[];
}

const defaultAvatar: AvatarState = {
  gender: "male",
  heightFeet: 6,
  heightInches: 0,
  weight: 200,
  bodyType: "athletic",
  muscleDefinition: 70,
  faceShape: "oval",
  skinTone: "#8D5524",
  eyeColor: "#4A3728",
  eyeShape: "almond",
  noseWidth: 50,
  noseLength: 50,
  lipFullness: 50,
  jawWidth: 50,
  cheekbones: 50,
  hairStyle: "fade",
  hairColor: "#1a1a1a",
  facialHair: "goatee",
  facialHairColor: "#1a1a1a",
  topStyle: "blazer",
  topColor: "#1e3a5f",
  bottomStyle: "dress_pants",
  bottomColor: "#1a1a1a",
  shoesStyle: "dress",
  shoesColor: "#1a1a1a",
  glasses: "none",
  hat: "none",
  accessories: [],
};

const tabs = [
  { id: "face", label: "Face", icon: "😊" },
  { id: "body", label: "Body", icon: "🧍" },
  { id: "hair", label: "Hair", icon: "💇" },
  { id: "facial", label: "Facial", icon: "🧔" },
  { id: "outfit", label: "Outfit", icon: "👔" },
  { id: "extras", label: "Extras", icon: "✨" },
];

export default function AvatarStudio() {
  const [avatarName, setAvatarName] = useState("Jay-I");
  const [activeTab, setActiveTab] = useState("body");
  const [avatar, setAvatar] = useState<AvatarState>(defaultAvatar);
  const [showRPM, setShowRPM] = useState(false);
  const [showFaceScanner, setShowFaceScanner] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load saved avatar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yocreator_avatar_v3");
      if (saved) {
        const data = JSON.parse(saved);
        setAvatar(data.avatar || defaultAvatar);
        setAvatarName(data.name || "Jay-I");
      }
    } catch (e) { console.error(e); }
  }, []);

  // Auto-save
  useEffect(() => {
    localStorage.setItem("yocreator_avatar_v3", JSON.stringify({ avatar, name: avatarName }));
  }, [avatar, avatarName]);

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const updateAvatar = useCallback((key: keyof AvatarState, value: any) => {
    setAvatar(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = () => {
    const saves = JSON.parse(localStorage.getItem("yocreator_avatar_saves") || "[]");
    saves.push({ id: Date.now(), name: avatarName, avatar, savedAt: new Date().toISOString() });
    localStorage.setItem("yocreator_avatar_saves", JSON.stringify(saves));
    setNotification("Avatar saved!");
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ name: avatarName, avatar }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${avatarName.replace(/\s+/g, "_")}.json`;
    a.click();
    setNotification("Exported!");
  };

  const handleReset = () => {
    setAvatar(defaultAvatar);
    setNotification("Reset to defaults");
  };

  const totalHeight = avatar.heightFeet * 12 + avatar.heightInches;
  const heightCm = Math.round(totalHeight * 2.54);
  const weightKg = Math.round(avatar.weight * 0.453592);

  // Convert to morphs for 3D engine
  const morphs = {
    gender: avatar.gender,
    height: totalHeight / 72, // normalize to 6ft
    faceWidth: avatar.jawWidth / 50,
    depth: avatar.weight / 200,
    jawWidth: avatar.jawWidth / 50,
    cheekbones: avatar.cheekbones / 50,
    noseSize: avatar.noseLength / 50,
    lipFullness: avatar.lipFullness / 50,
    eyeSize: 1,
    eyeSpacing: 1,
    skinColor: avatar.skinTone,
    hair: avatar.hairStyle,
    hairColor: avatar.hairColor,
    facialHair: avatar.facialHair,
    facialHairColor: avatar.facialHairColor,
    clothing: avatar.topStyle,
    clothingColor: avatar.topColor,
    pantsStyle: avatar.bottomStyle,
    pantsColor: avatar.bottomColor,
    shoesStyle: avatar.shoesStyle,
    shoesColor: avatar.shoesColor,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-black text-white">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-green-600 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/studio" className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🎬</span> YOcreator
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/studio" className="text-slate-400 hover:text-white">Studio</Link>
            <Link href="/studio/voice" className="text-slate-400 hover:text-white">Voice</Link>
            <Link href="/studio/avatar" className="text-white font-medium">Avatar</Link>
            <Link href="/studio/video" className="text-slate-400 hover:text-white">Video</Link>
            <Link href="/studio/projects" className="text-slate-400 hover:text-white">Projects</Link>
            <Link href="/gallery" className="text-slate-400 hover:text-white">Gallery</Link>
            <Link href="/admin" className="text-red-400 hover:text-red-300 flex items-center gap-1">
              👑 Admin
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Avatar Name */}
        <div className="mb-4">
          <label className="text-xs text-slate-500 uppercase tracking-wider">Avatar Name</label>
          <input
            type="text"
            value={avatarName}
            onChange={(e) => setAvatarName(e.target.value)}
            className="block w-64 mt-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-xl font-semibold focus:border-violet-500 focus:outline-none"
          />
        </div>

        {/* Layout: Controls LEFT, Preview RIGHT */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDE - Controls */}
          <div className="col-span-8 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? "bg-violet-600 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              {/* BODY TAB */}
              {activeTab === "body" && (
                <div className="space-y-6">
                  {/* Gender */}
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Gender</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateAvatar("gender", "male")}
                        className={`py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                          avatar.gender === "male" ? "bg-violet-600" : "bg-slate-700/50 hover:bg-slate-700"
                        }`}
                      >
                        ♂️ Male
                      </button>
                      <button
                        onClick={() => updateAvatar("gender", "female")}
                        className={`py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                          avatar.gender === "female" ? "bg-violet-600" : "bg-slate-700/50 hover:bg-slate-700"
                        }`}
                      >
                        ♀️ Female
                      </button>
                    </div>
                  </div>

                  {/* Height */}
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                      Height: {avatar.heightFeet}'{avatar.heightInches}"
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-slate-500">Feet (4-8)</span>
                        <input
                          type="range"
                          min="4"
                          max="8"
                          value={avatar.heightFeet}
                          onChange={(e) => updateAvatar("heightFeet", parseInt(e.target.value))}
                          className="w-full accent-violet-500"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">Inches (0-11)</span>
                        <input
                          type="range"
                          min="0"
                          max="11"
                          value={avatar.heightInches}
                          onChange={(e) => updateAvatar("heightInches", parseInt(e.target.value))}
                          className="w-full accent-violet-500"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Total: {totalHeight} inches ({heightCm} cm)</p>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                      Weight: {avatar.weight} LBS
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="350"
                      value={avatar.weight}
                      onChange={(e) => updateAvatar("weight", parseInt(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                    <p className="text-sm text-slate-500 mt-1">{weightKg} kg</p>
                  </div>

                  {/* Body Type */}
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Body Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Slim", "Average", "Athletic", "Muscular", "Heavy", "Stocky"].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateAvatar("bodyType", type.toLowerCase())}
                          className={`py-2 rounded-lg text-sm ${
                            avatar.bodyType === type.toLowerCase()
                              ? "bg-violet-600"
                              : "bg-slate-700/50 hover:bg-slate-700"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Muscle Definition */}
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                      Muscle Definition: {avatar.muscleDefinition}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={avatar.muscleDefinition}
                      onChange={(e) => updateAvatar("muscleDefinition", parseInt(e.target.value))}
                      className="w-full accent-violet-500"
                    />
                  </div>
                </div>
              )}

              {/* FACE TAB */}
              {activeTab === "face" && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Skin Tone</label>
                    <div className="flex gap-2 flex-wrap">
                      {SKIN_TONES.map((tone) => (
                        <button
                          key={tone.color}
                          onClick={() => updateAvatar("skinTone", tone.color)}
                          className={`w-10 h-10 rounded-full border-2 ${
                            avatar.skinTone === tone.color ? "border-violet-500 scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: tone.color }}
                          title={tone.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Face Shape</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Oval", "Round", "Square", "Heart", "Oblong", "Diamond"].map((shape) => (
                        <button
                          key={shape}
                          onClick={() => updateAvatar("faceShape", shape.toLowerCase())}
                          className={`py-2 rounded-lg text-sm ${
                            avatar.faceShape === shape.toLowerCase() ? "bg-violet-600" : "bg-slate-700/50"
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                        Jaw Width: {avatar.jawWidth}%
                      </label>
                      <input type="range" min="0" max="100" value={avatar.jawWidth}
                        onChange={(e) => updateAvatar("jawWidth", parseInt(e.target.value))}
                        className="w-full accent-violet-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                        Cheekbones: {avatar.cheekbones}%
                      </label>
                      <input type="range" min="0" max="100" value={avatar.cheekbones}
                        onChange={(e) => updateAvatar("cheekbones", parseInt(e.target.value))}
                        className="w-full accent-violet-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                        Nose Width: {avatar.noseWidth}%
                      </label>
                      <input type="range" min="0" max="100" value={avatar.noseWidth}
                        onChange={(e) => updateAvatar("noseWidth", parseInt(e.target.value))}
                        className="w-full accent-violet-500" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                        Lip Fullness: {avatar.lipFullness}%
                      </label>
                      <input type="range" min="0" max="100" value={avatar.lipFullness}
                        onChange={(e) => updateAvatar("lipFullness", parseInt(e.target.value))}
                        className="w-full accent-violet-500" />
                    </div>
                  </div>

                  {/* Face Scanner Button */}
                  <Link
                    href="/studio/avatar/scan"
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90"
                  >
                    📸 Scan Your Face
                  </Link>
                </div>
              )}

              {/* HAIR TAB */}
              {activeTab === "hair" && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Hair Style</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Fade", "Afro", "Locs", "Braids", "Buzz", "Bald", "Waves", "Twists"].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateAvatar("hairStyle", style.toLowerCase())}
                          className={`py-2 rounded-lg text-sm ${
                            avatar.hairStyle === style.toLowerCase() ? "bg-violet-600" : "bg-slate-700/50"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Hair Color</label>
                    <div className="flex gap-2">
                      {HAIR_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateAvatar("hairColor", color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            avatar.hairColor === color ? "border-violet-500 scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FACIAL HAIR TAB */}
              {activeTab === "facial" && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Facial Hair</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["None", "Stubble", "Goatee", "Beard", "Mustache", "Full"].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateAvatar("facialHair", style.toLowerCase())}
                          className={`py-2 rounded-lg text-sm ${
                            avatar.facialHair === style.toLowerCase() ? "bg-violet-600" : "bg-slate-700/50"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Facial Hair Color</label>
                    <div className="flex gap-2">
                      {HAIR_COLORS.slice(0, 5).map((color) => (
                        <button
                          key={color}
                          onClick={() => updateAvatar("facialHairColor", color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            avatar.facialHairColor === color ? "border-violet-500 scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* OUTFIT TAB */}
              {activeTab === "outfit" && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Top</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["T-Shirt", "Hoodie", "Blazer", "Polo", "Tank", "Suit"].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateAvatar("topStyle", style.toLowerCase().replace("-", "_"))}
                          className={`py-2 rounded-lg text-sm ${
                            avatar.topStyle === style.toLowerCase().replace("-", "_") ? "bg-violet-600" : "bg-slate-700/50"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      {CLOTHING_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateAvatar("topColor", color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            avatar.topColor === color ? "border-violet-500 scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Bottom</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["Jeans", "Joggers", "Shorts", "Dress Pants", "Cargo"].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateAvatar("bottomStyle", style.toLowerCase().replace(" ", "_"))}
                          className={`py-2 rounded-lg text-sm ${
                            avatar.bottomStyle === style.toLowerCase().replace(" ", "_") ? "bg-violet-600" : "bg-slate-700/50"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      {CLOTHING_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateAvatar("bottomColor", color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            avatar.bottomColor === color ? "border-violet-500 scale-110" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* EXTRAS TAB */}
              {activeTab === "extras" && (
                <div className="space-y-6">
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Glasses</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["None", "Reading", "Sunglasses", "Aviator", "Round"].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateAvatar("glasses", style.toLowerCase())}
                          className={`py-2 rounded-lg text-sm ${
                            avatar.glasses === style.toLowerCase() ? "bg-violet-600" : "bg-slate-700/50"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Hat</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["None", "Cap", "Beanie", "Fedora", "Durag"].map((style) => (
                        <button
                          key={style}
                          onClick={() => updateAvatar("hat", style.toLowerCase())}
                          className={`py-2 rounded-lg text-sm ${
                            avatar.hat === style.toLowerCase() ? "bg-violet-600" : "bg-slate-700/50"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ready Player Me Import */}
                  <button
                    onClick={() => setShowRPM(true)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    🌐 Import from Ready Player Me
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - Preview */}
          <div className="col-span-4">
            <div className="sticky top-6">
              <h3 className="text-sm text-slate-500 uppercase tracking-wider mb-3">Preview</h3>
              
              {/* 3D Preview */}
              <div className="bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-700/50 aspect-[3/4]">
                <ProAvatarEngine morphs={morphs as any} className="w-full h-full" />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button onClick={() => {}} className="flex-1 py-2 bg-slate-700/50 rounded-lg text-sm hover:bg-slate-700">
                  ↺ Rotate
                </button>
                <button onClick={handleReset} className="flex-1 py-2 bg-slate-700/50 rounded-lg text-sm hover:bg-slate-700">
                  Reset
                </button>
                <button onClick={() => {}} className="flex-1 py-2 bg-slate-700/50 rounded-lg text-sm hover:bg-slate-700">
                  Rotate ↻
                </button>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-800/30 rounded-lg p-2">
                  <span className="text-slate-500">Height:</span>{" "}
                  <span className="text-white font-medium">{avatar.heightFeet}'{avatar.heightInches}"</span>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-2">
                  <span className="text-slate-500">Weight:</span>{" "}
                  <span className="text-white font-medium">{avatar.weight} lbs</span>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-2">
                  <span className="text-slate-500">Build:</span>{" "}
                  <span className="text-white font-medium capitalize">{avatar.bodyType}</span>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-2">
                  <span className="text-slate-500">Age:</span>{" "}
                  <span className="text-white font-medium">30</span>
                </div>
              </div>

              {/* Generate / Build Buttons */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  ↻ Generate Preview
                </button>
                <button
                  onClick={handleExport}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  🎬 Build Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready Player Me Modal */}
      {showRPM && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h2 className="text-xl font-bold">Import from Ready Player Me</h2>
              <button onClick={() => setShowRPM(false)} className="text-2xl">×</button>
            </div>
            <div className="flex-1">
              <ReadyPlayerMeFrame onAvatarCreated={(url) => { setShowRPM(false); setNotification("Avatar imported!"); }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
