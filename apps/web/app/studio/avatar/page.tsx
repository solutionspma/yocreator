"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AvatarMorphs, defaultMorphs } from "../../../components/avatar/ProAvatarEngine";

const ProAvatarEngine = dynamic(
  () => import("../../../components/avatar/ProAvatarEngine"),
  { ssr: false, loading: () => <ViewportLoader /> }
);

const FastAvatarViewport = dynamic(
  () => import("../../../components/avatar/FastAvatarViewport"),
  { ssr: false, loading: () => <ViewportLoader /> }
);

const ProAvatarControls = dynamic(
  () => import("../../../components/avatar/ProAvatarControls"),
  { ssr: false }
);

const ReadyPlayerMeFrame = dynamic(
  () => import("../../../components/avatar/ReadyPlayerMeFrame"),
  { ssr: false }
);

function ViewportLoader() {
  return (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-black rounded-xl">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading 3D Engine...</p>
      </div>
    </div>
  );
}

interface SavedAvatar {
  id: string;
  name: string;
  morphs: AvatarMorphs;
  avatarUrl: string | null;
  mode: "pro" | "fast";
  thumbnail: string | null;
  createdAt: string;
}

export default function AvatarStudio() {
  const [mode, setMode] = useState<"pro" | "fast">("pro");
  const [morphs, setMorphs] = useState<AvatarMorphs>(defaultMorphs);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState("My Avatar");
  const [showRPM, setShowRPM] = useState(false);
  const [showSavedAvatars, setShowSavedAvatars] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [savedAvatars, setSavedAvatars] = useState<SavedAvatar[]>([]);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("yocreator_avatars_v2");
      if (saved) setSavedAvatars(JSON.parse(saved));
      const current = localStorage.getItem("yocreator_current_avatar_v2");
      if (current) {
        const data = JSON.parse(current);
        setMorphs(data.morphs || defaultMorphs);
        setAvatarUrl(data.avatarUrl || null);
        setMode(data.mode || "pro");
        setAvatarName(data.name || "My Avatar");
      }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleMorphChange = useCallback((newMorphs: AvatarMorphs) => {
    setMorphs(newMorphs);
    localStorage.setItem("yocreator_current_avatar_v2", JSON.stringify({
      morphs: newMorphs, avatarUrl, mode, name: avatarName
    }));
  }, [avatarUrl, mode, avatarName]);

  const handleRPMAvatarCreate = useCallback((url: string) => {
    setAvatarUrl(url);
    setMode("fast");
    setShowRPM(false);
    setNotification({ type: "success", message: "Avatar imported!" });
    localStorage.setItem("yocreator_current_avatar_v2", JSON.stringify({
      morphs, avatarUrl: url, mode: "fast", name: avatarName
    }));
  }, [morphs, avatarName]);

  const captureSnapshot = useCallback((): string | null => {
    try {
      const canvas = canvasContainerRef.current?.querySelector("canvas");
      if (canvas) return canvas.toDataURL("image/png");
    } catch (e) { console.error(e); }
    return null;
  }, []);

  const handleSave = useCallback(() => {
    setIsSaving(true);
    try {
      const thumbnail = captureSnapshot();
      const newAvatar: SavedAvatar = {
        id: `avatar_${Date.now()}`, name: avatarName, morphs, avatarUrl,
        mode, thumbnail, createdAt: new Date().toISOString()
      };
      const updated = [...savedAvatars, newAvatar];
      setSavedAvatars(updated);
      localStorage.setItem("yocreator_avatars_v2", JSON.stringify(updated));
      setNotification({ type: "success", message: "Avatar saved!" });
    } catch (e) {
      setNotification({ type: "error", message: "Failed to save" });
    } finally { setIsSaving(false); }
  }, [avatarName, morphs, avatarUrl, mode, savedAvatars, captureSnapshot]);

  const handleLoadAvatar = useCallback((avatar: SavedAvatar) => {
    setMorphs(avatar.morphs);
    setAvatarUrl(avatar.avatarUrl);
    setMode(avatar.mode);
    setAvatarName(avatar.name);
    setShowSavedAvatars(false);
    setNotification({ type: "success", message: `Loaded "${avatar.name}"` });
  }, []);

  const handleDeleteAvatar = useCallback((id: string) => {
    const updated = savedAvatars.filter(a => a.id !== id);
    setSavedAvatars(updated);
    localStorage.setItem("yocreator_avatars_v2", JSON.stringify(updated));
  }, [savedAvatars]);

  const handleReset = useCallback(() => {
    setMorphs(defaultMorphs);
    setAvatarUrl(null);
    setMode("pro");
    setAvatarName("My Avatar");
    localStorage.removeItem("yocreator_current_avatar_v2");
    setNotification({ type: "success", message: "Reset!" });
  }, []);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify({ name: avatarName, morphs, avatarUrl, mode, version: "2.0" }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${avatarName.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotification({ type: "success", message: "Exported!" });
  }, [avatarName, morphs, avatarUrl, mode]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg ${notification.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Link href="/studio" className="text-gray-400 hover:text-white">← Back</Link>
          <h1 className="text-2xl font-bold">Avatar Studio</h1>
        </div>
        <input
          type="text"
          value={avatarName}
          onChange={(e) => setAvatarName(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded px-3 py-1 text-sm w-48"
        />
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-800 bg-gray-900/50">
        <button onClick={() => setShowSavedAvatars(true)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2">
          📁 Load
        </button>
        <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium flex items-center gap-2">
          💾 Save
        </button>
        <button onClick={handleExport} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium flex items-center gap-2">
          📤 Export
        </button>
        <button onClick={handleReset} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex items-center gap-2">
          🔄 Reset
        </button>
        <div className="w-px h-6 bg-gray-700 mx-2" />
        <button
          onClick={() => setMode("pro")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "pro" ? "bg-violet-600" : "bg-gray-800 hover:bg-gray-700"}`}
        >
          🎮 Pro Mode
        </button>
        <button
          onClick={() => setMode("fast")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "fast" ? "bg-violet-600" : "bg-gray-800 hover:bg-gray-700"}`}
        >
          ⚡ Fast Mode
        </button>
        <button onClick={() => setShowRPM(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">
          🌐 Import Avatar
        </button>
      </div>

      {/* Main Layout - Side by side */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Viewport - Takes most of the space */}
        <div className="flex-1 p-4" ref={canvasContainerRef}>
          <div className="w-full h-full rounded-xl overflow-hidden">
            {mode === "pro" ? (
              <ProAvatarEngine morphs={morphs} className="w-full h-full" />
            ) : avatarUrl ? (
              <FastAvatarViewport avatarUrl={avatarUrl} className="w-full h-full" />
            ) : (
              <div className="w-full h-full bg-gray-900 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 mb-4">No avatar loaded</p>
                  <button onClick={() => setShowRPM(true)} className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg">
                    Import from Ready Player Me
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls Panel - Fixed width on right */}
        {!isMobile && mode === "pro" && (
          <div className="w-80 border-l border-gray-800 overflow-y-auto">
            <ProAvatarControls onChange={handleMorphChange} initialMorphs={morphs} />
          </div>
        )}

        {/* Mobile controls toggle */}
        {isMobile && mode === "pro" && (
          <button
            onClick={() => setShowControls(!showControls)}
            className="fixed bottom-4 right-4 z-30 px-4 py-3 bg-violet-600 rounded-full shadow-lg"
          >
            {showControls ? "✕" : "⚙️"}
          </button>
        )}

        {/* Mobile controls drawer */}
        {isMobile && showControls && mode === "pro" && (
          <div className="fixed inset-x-0 bottom-0 z-20 bg-gray-900 border-t border-gray-800 max-h-[60vh] overflow-y-auto">
            <ProAvatarControls onChange={handleMorphChange} initialMorphs={morphs} />
          </div>
        )}
      </div>

      {/* RPM Modal */}
      {showRPM && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold">Import from Ready Player Me</h2>
              <button onClick={() => setShowRPM(false)} className="text-2xl text-gray-400 hover:text-white">×</button>
            </div>
            <div className="flex-1">
              <ReadyPlayerMeFrame onAvatarCreated={handleRPMAvatarCreate} />
            </div>
          </div>
        </div>
      )}

      {/* Saved Avatars Modal */}
      {showSavedAvatars && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold">Saved Avatars</h2>
              <button onClick={() => setShowSavedAvatars(false)} className="text-2xl text-gray-400 hover:text-white">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {savedAvatars.length === 0 ? (
                <p className="text-gray-400 text-center py-12">No saved avatars</p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {savedAvatars.map((avatar) => (
                    <div key={avatar.id} className="bg-gray-800 rounded-lg overflow-hidden group relative">
                      <div className="aspect-square bg-gray-900 flex items-center justify-center">
                        {avatar.thumbnail ? (
                          <img src={avatar.thumbnail} alt={avatar.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">👤</span>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="font-medium truncate text-sm">{avatar.name}</p>
                        <button
                          onClick={() => handleLoadAvatar(avatar)}
                          className="w-full mt-2 py-1 bg-violet-600 hover:bg-violet-700 rounded text-sm"
                        >
                          Load
                        </button>
                      </div>
                      <button
                        onClick={() => handleDeleteAvatar(avatar.id)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
