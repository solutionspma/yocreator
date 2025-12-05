"use client";
import { useState } from "react";

export default function AvatarPage() {
  const [name, setName] = useState("");
  const [style, setStyle] = useState("realistic");
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

  async function createAvatarJob() {
    if (!name.trim()) return alert("Enter an avatar name first");
    setCreating(true);
    setResult(null);
    try {
      const payload = {
        type: "avatar",
        status: "queued",
        payload: { name, style },
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
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "20px" }}>👤 Avatar Builder</h1>
      <p style={{ color: "#888", marginBottom: "40px" }}>Create custom AI avatars for your videos</p>

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

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Style</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
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
          <option value="realistic">Realistic</option>
          <option value="cartoon">Cartoon</option>
          <option value="anime">Anime</option>
          <option value="3d">3D Rendered</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Upload Photos (Coming Soon)</label>
        <div style={{
          padding: "40px",
          backgroundColor: "#1a1a1a",
          border: "2px dashed #333",
          borderRadius: "8px",
          textAlign: "center",
          color: "#666",
        }}>
          <p>📷 Drag & drop 20-30 photos here</p>
          <p style={{ fontSize: "14px", marginTop: "8px" }}>or click to browse</p>
        </div>
      </div>

      <button
        onClick={createAvatarJob}
        disabled={creating}
        style={{
          padding: "14px 24px",
          backgroundColor: "#7c3aed",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: creating ? "not-allowed" : "pointer",
          opacity: creating ? 0.7 : 1,
        }}
      >
        {creating ? "Creating Job..." : "Build Avatar"}
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
        <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>How it works</h3>
        <ol style={{ color: "#888", paddingLeft: "20px", lineHeight: "1.8" }}>
          <li>Upload 20-30 photos of the face from different angles</li>
          <li>Or upload a Polycam 3D face scan</li>
          <li>Select your preferred style</li>
          <li>Our AI builds a 3D head mesh with lip-sync ready animations</li>
          <li>Use your avatar in video projects</li>
        </ol>
      </div>
    </main>
  );
}
