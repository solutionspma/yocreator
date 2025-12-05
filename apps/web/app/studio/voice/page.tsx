"use client";
import { useState } from "react";

export default function VoicePage() {
  const [text, setText] = useState("");
  const [speaker, setSpeaker] = useState("default");
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

  async function createVoiceJob() {
    if (!text.trim()) return alert("Enter some text first");
    setCreating(true);
    setResult(null);
    try {
      const payload = {
        type: "voice",
        status: "queued",
        payload: { text, speaker },
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
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "20px" }}>🎤 Voice Generator</h1>
      <p style={{ color: "#888", marginBottom: "40px" }}>Create AI-generated voice from text</p>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Speaker</label>
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
          <option value="custom">Custom (Cloned)</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Script Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          rows={6}
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

      <button
        onClick={createVoiceJob}
        disabled={creating}
        style={{
          padding: "14px 24px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: creating ? "not-allowed" : "pointer",
          opacity: creating ? 0.7 : 1,
        }}
      >
        {creating ? "Creating Job..." : "Generate Voice"}
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
          <li>Enter your script text above</li>
          <li>Select a voice or use your cloned voice</li>
          <li>Click "Generate Voice" to create a render job</li>
          <li>The worker processes the job and generates audio</li>
          <li>Download your audio from the Projects page</li>
        </ol>
      </div>
    </main>
  );
}
