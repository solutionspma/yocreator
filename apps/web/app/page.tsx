"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [creating, setCreating] = useState(false);
  const [jobs, setJobs] = useState<Array<any>>([]);
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

  async function loadJobs() {
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/render_jobs?select=*&order=created_at.desc&limit=5`,
        { headers: { apikey: SUPABASE_KEY } }
      );
      const data = await r.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("loadJobs error", e);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function createTestJob() {
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
    setCreating(true);
    try {
      const payload = {
        type: "voice",
        status: "queued",
        payload: { text: "Hello from YoCreator" },
      };
      await fetch(`${SUPABASE_URL}/rest/v1/render_jobs`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      });
      await loadJobs();
    } catch (e) {
      console.error("createTestJob error", e);
    } finally {
      setCreating(false);
    }
  }

  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '20px' }}>
        YOcreator Studio
      </h1>
      <p style={{ fontSize: '24px', color: '#888', marginBottom: '40px' }}>
        Voice · Avatar · Video · Cloud Render
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '60px'
      }}>
        <a href="/studio/voice" style={{
          padding: '30px',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          textDecoration: 'none',
          color: 'white',
          border: '1px solid #333',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>🎤 Voice</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>Generate AI voices</p>
        </a>

        <a href="/studio/avatar" style={{
          padding: '30px',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          textDecoration: 'none',
          color: 'white',
          border: '1px solid #333',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>👤 Avatar</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>Build custom avatars</p>
        </a>

        <a href="/studio/video" style={{
          padding: '30px',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          textDecoration: 'none',
          color: 'white',
          border: '1px solid #333',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>🎬 Video</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>Create AI videos</p>
        </a>

        <a href="/studio/projects" style={{
          padding: '30px',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          textDecoration: 'none',
          color: 'white',
          border: '1px solid #333',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>📁 Projects</h2>
          <p style={{ color: '#888', fontSize: '14px' }}>View your projects</p>
        </a>
      </div>

      <div style={{ marginTop: '60px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Status</h3>
        <p style={{ color: '#4ade80', fontSize: '14px' }}>✓ Connected to Supabase</p>
        <p style={{ color: '#888', fontSize: '12px', marginTop: '10px' }}>
          API: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Not configured'}
        </p>
        <div style={{ marginTop: '20px' }}>
          <button onClick={createTestJob} disabled={creating || !SUPABASE_URL || !SUPABASE_KEY} style={{
            padding: '12px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            {creating ? 'Creating…' : 'Create Test Render Job'}
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Recent Jobs</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {jobs.map((j) => (
              <li key={j.id} style={{ padding: '8px 0', borderBottom: '1px solid #333' }}>
                <span style={{ color: '#bbb' }}>#{j.id}</span> · <strong>{j.type}</strong> · <span style={{ color: j.status === 'completed' ? '#4ade80' : j.status === 'error' ? '#ef4444' : '#f59e0b' }}>{j.status}</span>
                {j.result_url ? (
                  <span> · <a href={j.result_url} style={{ color: '#93c5fd' }} target="_blank" rel="noreferrer">result</a></span>
                ) : null}
              </li>
            ))}
            {jobs.length === 0 && (
              <li style={{ color: '#888' }}>No jobs yet.</li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
