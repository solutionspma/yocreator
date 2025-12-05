"use client";
import { useState } from "react";

export default function VideoPage() {
  const [script, setScript] = useState("");
  const [speaker, setSpeaker] = useState("default");
  const [avatar, setAvatar] = useState("stock_1");
  const [template, setTemplate] = useState("commercial");
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

  async function createVideoJob() {
    if (!script.trim()) return alert("Enter a script first");
    setCreating(true);
    setResult(null);
    try {
      const payload = {
        type: "video",
        status: "queued",
        payload: { script, speaker, avatar, template },
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
      setResult(`Job created: #${data[0]?.id || "unknown"}`);
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <a href="/" style={{ color: "#888", textDecoration: "none" }}>← Back to Home</a>
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "20px" }}>🎬 Video Creator</h1>
      <p style={{ color: "#888", marginBottom: "40px" }}>Create AI-powered videos with avatars and voice</p>

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
            <option value="female_1">Female Voice 1</option>
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
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
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
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Script</label>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter your video script here..."
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
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Background Music (Coming Soon)</label>
        <div style={{
          padding: "30px",
          backgroundColor: "#1a1a1a",
          border: "2px dashed #333",
          borderRadius: "8px",
          textAlign: "center",
          color: "#666",
        }}>
          <p>🎵 Drop MP3/WAV file here</p>
        </div>
      </div>

      <button
        onClick={createVideoJob}
        disabled={creating}
        style={{
          padding: "14px 24px",
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: creating ? "not-allowed" : "pointer",
          opacity: creating ? 0.7 : 1,
        }}
      >
        {creating ? "Creating Job..." : "🚀 Generate Video"}
      </button>

      {result && (
        <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
          <p style={{ color: "#4ade80" }}>{result}</p>
          <p style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>
            Check the <a href="/studio/projects" style={{ color: "#93c5fd" }}>Projects</a> page to see job status.
          </p>
        </div>
      )}

      <div style={{ marginTop: "60px", padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Output Includes</h3>
        <ul style={{ color: "#888", paddingLeft: "20px", lineHeight: "1.8" }}>
          <li>1080p MP4 video</li>
          <li>Lip-synced avatar animation</li>
          <li>AI-generated voice narration</li>
          <li>Background music mixing</li>
          <li>Auto-generated captions</li>
          <li>Logo watermark option</li>
          <li>Intro/outro stings</li>
        </ul>
      </div>
    </main>
  );
}
