"use client";
import { useState, useRef } from "react";

export default function AvatarPage() {
  const [name, setName] = useState("");
  const [style, setStyle] = useState("realistic");
  const [pixarMode, setPixarMode] = useState(false);
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"photos" | "scan" | "nft">("photos");

  // Body structure
  const [height, setHeight] = useState("5'10\"");
  const [weight, setWeight] = useState("170");
  const [bodyType, setBodyType] = useState("average");

  // Wardrobe
  const [outfit, setOutfit] = useState("business");
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("#1f2937");

  // Files
  const [facePhotos, setFacePhotos] = useState<File[]>([]);
  const [faceScan, setFaceScan] = useState<File | null>(null);
  const [nftImage, setNftImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);
  const nftInputRef = useRef<HTMLInputElement>(null);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFacePhotos((prev) => [...prev, ...files].slice(0, 30));
    }
  }

  function handleScanUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setFaceScan(e.target.files[0]);
    }
  }

  function handleNftUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setNftImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function createAvatarJob() {
    if (!name.trim()) return alert("Enter an avatar name first");
    if (facePhotos.length < 5 && !faceScan && !nftImage) {
      return alert("Upload at least 5 photos, a 3D scan, or an NFT image");
    }
    setCreating(true);
    setResult(null);
    try {
      const payload = {
        type: "avatar",
        status: "queued",
        payload: {
          name,
          style: pixarMode ? "pixar" : style,
          pixarMode,
          body: { height, weight, bodyType },
          wardrobe: { outfit, primaryColor, secondaryColor },
          inputType: faceScan ? "scan" : nftImage ? "nft" : "photos",
          photoCount: facePhotos.length,
          hasScan: !!faceScan,
          hasNft: !!nftImage,
        },
      };
      const res = await fetch(`${SUPABASE_URL}/rest/v1/render_jobs`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(`Avatar job created: #${data[0]?.id || "unknown"}`);
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setCreating(false);
    }
  }

  const tabStyle = (active: boolean) => ({
    padding: "12px 24px",
    backgroundColor: active ? "#7c3aed" : "#1a1a1a",
    color: active ? "white" : "#888",
    border: "none",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: active ? "600" : "400",
  });

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <a href="/" style={{ color: "#888", textDecoration: "none" }}>← Back to Home</a>
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "20px" }}>👤 Avatar Builder</h1>
      <p style={{ color: "#888", marginBottom: "40px" }}>Create custom AI avatars with face scan, body structure, and wardrobe</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        {/* Left Column - Identity & Input */}
        <div>
          {/* Avatar Name */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Avatar Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Avatar"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
              }}
            />
          </div>

          {/* Style Selection */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={pixarMode}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: pixarMode ? "#666" : "white",
                fontSize: "16px",
              }}
            >
              <option value="realistic">Realistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="anime">Anime</option>
              <option value="3d">3D Rendered</option>
            </select>
          </div>

          {/* Pixar Mode Toggle */}
          <div style={{ marginBottom: "30px", padding: "16px", backgroundColor: "#2d1f4e", borderRadius: "8px", border: "1px solid #7c3aed" }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={pixarMode}
                onChange={(e) => setPixarMode(e.target.checked)}
                style={{ marginRight: "12px", width: "20px", height: "20px" }}
              />
              <div>
                <span style={{ color: "white", fontWeight: "600" }}>✨ Pixar / Animated Style</span>
                <p style={{ color: "#a78bfa", fontSize: "13px", margin: "4px 0 0" }}>
                  Transform into a Pixar-quality 3D animated character
                </p>
              </div>
            </label>
          </div>

          {/* Input Tabs */}
          <div style={{ marginBottom: "0" }}>
            <button style={tabStyle(activeTab === "photos")} onClick={() => setActiveTab("photos")}>📷 Photos</button>
            <button style={tabStyle(activeTab === "scan")} onClick={() => setActiveTab("scan")}>🔍 3D Scan</button>
            <button style={tabStyle(activeTab === "nft")} onClick={() => setActiveTab("nft")}>🎨 NFT Image</button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "0 8px 8px 8px", border: "1px solid #333", minHeight: "200px" }}>
            {activeTab === "photos" && (
              <>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
                <div
                  onClick={() => photoInputRef.current?.click()}
                  style={{
                    padding: "40px",
                    border: "2px dashed #444",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <p style={{ fontSize: "36px", margin: "0" }}>📷</p>
                  <p style={{ color: "#888", margin: "8px 0" }}>Upload 20-30 face photos from different angles</p>
                  <p style={{ color: "#666", fontSize: "13px" }}>JPG, PNG • Max 10MB each</p>
                </div>
                {facePhotos.length > 0 && (
                  <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {facePhotos.map((f, i) => (
                      <div key={i} style={{ padding: "4px 8px", backgroundColor: "#333", borderRadius: "4px", fontSize: "12px", color: "#888" }}>
                        {f.name.slice(0, 15)}...
                      </div>
                    ))}
                  </div>
                )}
                <p style={{ color: "#4ade80", marginTop: "12px", fontSize: "14px" }}>
                  {facePhotos.length}/30 photos uploaded
                </p>
              </>
            )}

            {activeTab === "scan" && (
              <>
                <input
                  ref={scanInputRef}
                  type="file"
                  accept=".glb,.gltf,.obj,.ply,.zip"
                  onChange={handleScanUpload}
                  style={{ display: "none" }}
                />
                <div
                  onClick={() => scanInputRef.current?.click()}
                  style={{
                    padding: "40px",
                    border: "2px dashed #444",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <p style={{ fontSize: "36px", margin: "0" }}>🔍</p>
                  <p style={{ color: "#888", margin: "8px 0" }}>Upload Polycam or iPhone 3D Face Scan</p>
                  <p style={{ color: "#666", fontSize: "13px" }}>GLB, GLTF, OBJ, PLY formats</p>
                </div>
                {faceScan && (
                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#1e3a2f", borderRadius: "8px", border: "1px solid #4ade80" }}>
                    <p style={{ color: "#4ade80", margin: 0 }}>✓ {faceScan.name}</p>
                  </div>
                )}
              </>
            )}

            {activeTab === "nft" && (
              <>
                <input
                  ref={nftInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleNftUpload}
                  style={{ display: "none" }}
                />
                <div
                  onClick={() => nftInputRef.current?.click()}
                  style={{
                    padding: "40px",
                    border: "2px dashed #444",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <p style={{ fontSize: "36px", margin: "0" }}>🎨</p>
                  <p style={{ color: "#888", margin: "8px 0" }}>Upload NFT or Character Image</p>
                  <p style={{ color: "#666", fontSize: "13px" }}>Convert 2D art into animated 3D avatar</p>
                </div>
                {previewUrl && (
                  <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <img src={previewUrl} alt="NFT Preview" style={{ maxWidth: "150px", borderRadius: "8px", border: "1px solid #444" }} />
                    <p style={{ color: "#4ade80", fontSize: "14px", marginTop: "8px" }}>✓ Ready for avatar conversion</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Column - Body & Wardrobe */}
        <div>
          {/* Body Structure */}
          <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
            <h3 style={{ margin: "0 0 16px", color: "white", fontSize: "18px" }}>📏 Body Structure</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#888", fontSize: "13px" }}>Height</label>
                <select
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #333",
                    borderRadius: "6px",
                    color: "white",
                  }}
                >
                  {["5'0\"", "5'2\"", "5'4\"", "5'6\"", "5'8\"", "5'10\"", "6'0\"", "6'2\"", "6'4\"", "6'6\""].map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#888", fontSize: "13px" }}>Weight (lbs)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #333",
                    borderRadius: "6px",
                    color: "white",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "6px", color: "#888", fontSize: "13px" }}>Body Type</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {["slim", "average", "athletic", "muscular", "heavy"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setBodyType(type)}
                    style={{
                      flex: 1,
                      padding: "10px 8px",
                      backgroundColor: bodyType === type ? "#7c3aed" : "#0a0a0a",
                      border: bodyType === type ? "1px solid #7c3aed" : "1px solid #333",
                      borderRadius: "6px",
                      color: bodyType === type ? "white" : "#888",
                      fontSize: "12px",
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Wardrobe */}
          <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
            <h3 style={{ margin: "0 0 16px", color: "white", fontSize: "18px" }}>👔 Wardrobe</h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", color: "#888", fontSize: "13px" }}>Outfit Style</label>
              <select
                value={outfit}
                onChange={(e) => setOutfit(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #333",
                  borderRadius: "6px",
                  color: "white",
                }}
              >
                <option value="business">Business Professional</option>
                <option value="casual">Casual</option>
                <option value="formal">Formal / Suit</option>
                <option value="creative">Creative / Artistic</option>
                <option value="tech">Tech / Startup</option>
                <option value="athletic">Athletic / Sporty</option>
                <option value="custom">Custom Upload</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#888", fontSize: "13px" }}>Primary Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ width: "40px", height: "40px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  />
                  <span style={{ color: "#888", fontSize: "13px" }}>{primaryColor}</span>
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: "#888", fontSize: "13px" }}>Secondary Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    style={{ width: "40px", height: "40px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                  />
                  <span style={{ color: "#888", fontSize: "13px" }}>{secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div style={{ padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 16px", color: "white", fontSize: "18px" }}>🎬 Avatar Preview</h3>
            <div style={{
              width: "150px",
              height: "200px",
              margin: "0 auto",
              backgroundColor: "#0a0a0a",
              borderRadius: "8px",
              border: "1px solid #333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{ textAlign: "center", color: "#444" }}>
                <p style={{ fontSize: "48px", margin: 0 }}>👤</p>
                <p style={{ fontSize: "12px", marginTop: "8px" }}>
                  {pixarMode ? "Pixar Style" : style}
                </p>
              </div>
            </div>
            <p style={{ color: "#666", fontSize: "13px", marginTop: "12px" }}>
              Preview updates after job completes
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: "40px", display: "flex", gap: "16px", justifyContent: "center" }}>
        <button
          onClick={createAvatarJob}
          disabled={creating}
          style={{
            padding: "16px 40px",
            backgroundColor: "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: creating ? "not-allowed" : "pointer",
            opacity: creating ? 0.7 : 1,
          }}
        >
          {creating ? "Creating Avatar..." : "🚀 Build Avatar"}
        </button>
        <button
          style={{
            padding: "16px 40px",
            backgroundColor: "transparent",
            color: "#888",
            border: "1px solid #333",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Save Draft
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{ marginTop: "20px", padding: "20px", backgroundColor: result.includes("Error") ? "#3a1f1f" : "#1f3a2f", borderRadius: "8px", border: `1px solid ${result.includes("Error") ? "#ef4444" : "#4ade80"}`, textAlign: "center" }}>
          <p style={{ color: result.includes("Error") ? "#ef4444" : "#4ade80", fontSize: "18px", margin: 0 }}>{result}</p>
          <p style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>
            View progress in <a href="/studio/projects" style={{ color: "#93c5fd" }}>Projects</a>
          </p>
        </div>
      )}

      {/* How it Works */}
      <div style={{ marginTop: "60px", padding: "24px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "16px" }}>🎯 How Avatar Builder Works</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
          {[
            { icon: "📷", title: "Upload", desc: "Photos, 3D scan, or NFT" },
            { icon: "📏", title: "Configure", desc: "Body & wardrobe settings" },
            { icon: "🤖", title: "AI Process", desc: "Neural mesh generation" },
            { icon: "🎭", title: "Animate", desc: "Lip-sync & expressions" },
            { icon: "🎬", title: "Export", desc: "Use in video projects" },
          ].map((step, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "32px", margin: "0 0 8px" }}>{step.icon}</p>
              <p style={{ color: "white", fontWeight: "600", margin: "0 0 4px" }}>{step.title}</p>
              <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
