"use client";
import { useState, useEffect, useRef } from "react";

interface RenderJob {
  id: string;
  status: string;
  progress?: number;
  output_url?: string;
  created_at: string;
}

export default function VideoPage() {
  const [script, setScript] = useState("");
  const [speaker, setSpeaker] = useState("default");
  const [avatar, setAvatar] = useState("stock_1");
  const [template, setTemplate] = useState("commercial");
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<RenderJob | null>(null);
  const [mintingNft, setMintingNft] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);

  // Video options
  const [resolution, setResolution] = useState("1080p");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [duration, setDuration] = useState("auto");
  const [addCaptions, setAddCaptions] = useState(true);
  const [addWatermark, setAddWatermark] = useState(false);
  const [musicTrack, setMusicTrack] = useState("none");
  const [bgMusic, setBgMusic] = useState<File | null>(null);

  const musicInputRef = useRef<HTMLInputElement>(null);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

  // Poll job status
  useEffect(() => {
    if (!activeJob || activeJob.status === "completed" || activeJob.status === "failed") return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/render_jobs?id=eq.${activeJob.id}`, {
          headers: { apikey: SUPABASE_KEY },
        });
        const data = await res.json();
        if (data[0]) {
          setActiveJob(data[0]);
        }
      } catch (e) {
        console.error("Poll error:", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeJob, SUPABASE_URL, SUPABASE_KEY]);

  function handleMusicUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setBgMusic(e.target.files[0]);
      setMusicTrack("custom");
    }
  }

  async function createVideoJob() {
    if (!script.trim()) return alert("Enter a script first");
    setCreating(true);
    setResult(null);
    setNftMinted(false);
    try {
      const payload = {
        type: "video",
        status: "queued",
        progress: 0,
        payload: {
          script,
          speaker,
          avatar,
          template,
          resolution,
          aspectRatio,
          duration,
          addCaptions,
          addWatermark,
          musicTrack,
          hasCustomMusic: !!bgMusic,
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
      const newJob = data[0];
      setResult(`Video job created: #${newJob?.id || "unknown"}`);
      setActiveJob(newJob);
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setCreating(false);
    }
  }

  async function mintAsNft() {
    if (!activeJob?.output_url) return;
    setMintingNft(true);
    // Simulate NFT minting process
    await new Promise((r) => setTimeout(r, 2000));
    setMintingNft(false);
    setNftMinted(true);
  }

  function getProgressColor(progress: number) {
    if (progress < 30) return "#ef4444";
    if (progress < 70) return "#f59e0b";
    return "#4ade80";
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <a href="/" style={{ color: "#888", textDecoration: "none" }}>← Back to Home</a>
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "20px" }}>🎬 Video Creator</h1>
      <p style={{ color: "#888", marginBottom: "40px" }}>Create AI-powered videos with avatars, voice, and NFT minting</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px" }}>
        {/* Left Column - Creation Form */}
        <div>
          {/* Voice & Avatar Selection */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Voice</label>
              <select
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                <option value="default">Default Voice</option>
                <option value="male_1">Male Voice 1</option>
                <option value="male_2">Male Voice 2 (Deep)</option>
                <option value="female_1">Female Voice 1</option>
                <option value="female_2">Female Voice 2 (Warm)</option>
                <option value="custom">My Cloned Voice</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Avatar</label>
              <select
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                <option value="stock_1">Stock Avatar 1</option>
                <option value="stock_2">Stock Avatar 2</option>
                <option value="stock_3">Stock Avatar 3</option>
                <option value="custom">My Custom Avatar</option>
                <option value="none">No Avatar (Voice Only)</option>
              </select>
            </div>
          </div>

          {/* Template & Resolution */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Template</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                <option value="commercial">Commercial</option>
                <option value="explainer">Explainer</option>
                <option value="cinematic">Cinematic</option>
                <option value="social">Social Media</option>
                <option value="presentation">Presentation</option>
                <option value="news">News / Broadcast</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Resolution</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                <option value="720p">720p HD</option>
                <option value="1080p">1080p Full HD</option>
                <option value="4k">4K Ultra HD</option>
              </select>
            </div>
          </div>

          {/* Aspect Ratio & Duration */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                <option value="16:9">16:9 (YouTube/TV)</option>
                <option value="9:16">9:16 (TikTok/Reels)</option>
                <option value="1:1">1:1 (Instagram)</option>
                <option value="4:3">4:3 (Classic)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                <option value="auto">Auto (based on script)</option>
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="120">2 minutes</option>
                <option value="300">5 minutes</option>
              </select>
            </div>
          </div>

          {/* Script */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Script</label>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Enter your video script here... The AI will generate voice narration and lip-sync the avatar."
              rows={8}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "white",
                fontSize: "16px",
                resize: "vertical",
              }}
            />
            <p style={{ color: "#666", fontSize: "13px", marginTop: "4px" }}>
              {script.length} characters • ~{Math.ceil(script.split(/\s+/).filter(Boolean).length / 150)} min read
            </p>
          </div>

          {/* Options Row */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#bbb" }}>
              <input
                type="checkbox"
                checked={addCaptions}
                onChange={(e) => setAddCaptions(e.target.checked)}
                style={{ marginRight: "8px", width: "18px", height: "18px" }}
              />
              Auto Captions
            </label>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#bbb" }}>
              <input
                type="checkbox"
                checked={addWatermark}
                onChange={(e) => setAddWatermark(e.target.checked)}
                style={{ marginRight: "8px", width: "18px", height: "18px" }}
              />
              Add Watermark
            </label>
          </div>

          {/* Background Music */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Background Music</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px" }}>
              <select
                value={musicTrack}
                onChange={(e) => setMusicTrack(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                <option value="none">No Music</option>
                <option value="upbeat">Upbeat Corporate</option>
                <option value="calm">Calm & Inspiring</option>
                <option value="tech">Tech / Modern</option>
                <option value="cinematic">Cinematic Epic</option>
                <option value="custom">Custom Upload</option>
              </select>
              <input
                ref={musicInputRef}
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
                style={{ display: "none" }}
              />
              <button
                onClick={() => musicInputRef.current?.click()}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#333",
                  color: "#888",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                🎵 Upload
              </button>
            </div>
            {bgMusic && (
              <p style={{ color: "#4ade80", fontSize: "13px", marginTop: "8px" }}>✓ {bgMusic.name}</p>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={createVideoJob}
            disabled={creating}
            style={{
              width: "100%",
              padding: "16px 24px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: creating ? "not-allowed" : "pointer",
              opacity: creating ? 0.7 : 1,
            }}
          >
            {creating ? "Creating Job..." : "🚀 Generate Video"}
          </button>

          {result && !activeJob && (
            <div style={{ marginTop: "20px", padding: "16px", backgroundColor: result.includes("Error") ? "#3a1f1f" : "#1f3a2f", borderRadius: "8px", border: `1px solid ${result.includes("Error") ? "#ef4444" : "#4ade80"}` }}>
              <p style={{ color: result.includes("Error") ? "#ef4444" : "#4ade80", margin: 0 }}>{result}</p>
            </div>
          )}
        </div>

        {/* Right Column - Preview & Progress */}
        <div>
          {/* Video Preview */}
          <div style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
            <h3 style={{ margin: "0 0 16px", color: "white", fontSize: "18px" }}>🎬 Preview</h3>
            <div style={{
              width: "100%",
              aspectRatio: aspectRatio === "9:16" ? "9/16" : aspectRatio === "1:1" ? "1/1" : aspectRatio === "4:3" ? "4/3" : "16/9",
              backgroundColor: "#0a0a0a",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              maxHeight: "300px",
            }}>
              {activeJob?.output_url ? (
                <video
                  src={activeJob.output_url}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              ) : (
                <div style={{ textAlign: "center", color: "#444" }}>
                  <p style={{ fontSize: "48px", margin: 0 }}>🎬</p>
                  <p style={{ fontSize: "14px", marginTop: "8px" }}>
                    {activeJob ? "Rendering..." : "Video preview"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Render Progress */}
          {activeJob && activeJob.status !== "completed" && activeJob.status !== "failed" && (
            <div style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
              <h3 style={{ margin: "0 0 12px", color: "white", fontSize: "18px" }}>⏳ Render Progress</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#888" }}>Job #{activeJob.id}</span>
                <span style={{ color: getProgressColor(activeJob.progress || 0), fontWeight: "600" }}>
                  {activeJob.progress || 0}%
                </span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#333", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${activeJob.progress || 0}%`,
                    height: "100%",
                    backgroundColor: getProgressColor(activeJob.progress || 0),
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["Queued", "Processing", "Rendering", "Encoding", "Done"].map((stage, i) => {
                  const progress = activeJob.progress || 0;
                  const stageProgress = [0, 20, 50, 80, 100];
                  const isActive = progress >= stageProgress[i] && progress < (stageProgress[i + 1] || 101);
                  const isDone = progress >= (stageProgress[i + 1] || 100);
                  return (
                    <span
                      key={stage}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: isDone ? "#1f3a2f" : isActive ? "#2d1f4e" : "#0a0a0a",
                        border: `1px solid ${isDone ? "#4ade80" : isActive ? "#7c3aed" : "#333"}`,
                        borderRadius: "4px",
                        fontSize: "12px",
                        color: isDone ? "#4ade80" : isActive ? "#a78bfa" : "#666",
                      }}
                    >
                      {isDone ? "✓ " : isActive ? "● " : ""}{stage}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Job */}
          {activeJob?.status === "completed" && (
            <div style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#1f3a2f", borderRadius: "8px", border: "1px solid #4ade80" }}>
              <h3 style={{ margin: "0 0 12px", color: "#4ade80", fontSize: "18px" }}>✓ Video Complete!</h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a
                  href={activeJob.output_url || "#"}
                  download
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#4ade80",
                    color: "#0a0a0a",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  ⬇️ Download MP4
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(activeJob.output_url || "")}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "transparent",
                    color: "#4ade80",
                    border: "1px solid #4ade80",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  📋 Copy Link
                </button>
              </div>
            </div>
          )}

          {/* NFT Minting */}
          <div style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
            <h3 style={{ margin: "0 0 12px", color: "white", fontSize: "18px" }}>🎨 NFT Minting</h3>
            {!activeJob?.output_url ? (
              <p style={{ color: "#666", margin: 0 }}>Complete a video render to mint as NFT</p>
            ) : nftMinted ? (
              <div style={{ padding: "16px", backgroundColor: "#1f3a2f", borderRadius: "8px", border: "1px solid #4ade80" }}>
                <p style={{ color: "#4ade80", margin: "0 0 8px", fontWeight: "600" }}>✓ NFT Minted Successfully!</p>
                <p style={{ color: "#888", margin: 0, fontSize: "13px" }}>
                  Token ID: #YOC-{activeJob.id.slice(0, 8).toUpperCase()}
                </p>
                <p style={{ color: "#888", margin: "4px 0 0", fontSize: "13px" }}>
                  Network: $MODULAR (Ethereum L2)
                </p>
              </div>
            ) : (
              <div>
                <p style={{ color: "#888", margin: "0 0 12px", fontSize: "14px" }}>
                  Mint this video as an NFT on the $MODULAR network
                </p>
                <button
                  onClick={mintAsNft}
                  disabled={mintingNft}
                  style={{
                    width: "100%",
                    padding: "12px",
                    backgroundColor: "#7c3aed",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: mintingNft ? "not-allowed" : "pointer",
                    opacity: mintingNft ? 0.7 : 1,
                    fontWeight: "600",
                  }}
                >
                  {mintingNft ? "Minting..." : "🚀 Mint as NFT"}
                </button>
              </div>
            )}
          </div>

          {/* Output Info */}
          <div style={{ padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "white" }}>Output Includes</h3>
            <ul style={{ color: "#888", paddingLeft: "20px", margin: 0, lineHeight: "1.8", fontSize: "14px" }}>
              <li>{resolution} MP4 video</li>
              <li>Lip-synced avatar animation</li>
              <li>AI voice narration</li>
              {addCaptions && <li>Auto-generated captions</li>}
              {musicTrack !== "none" && <li>Background music</li>}
              {addWatermark && <li>Logo watermark</li>}
              <li>Intro/outro stings</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
