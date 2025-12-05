"use client";
import { useEffect, useState } from "react";

interface Job {
  id: string;
  type: string;
  status: string;
  progress?: number;
  payload: any;
  result_url?: string;
  output_url?: string;
  error?: string;
  created_at: string;
}

export default function ProjectsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<string | null>(null);

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

  async function loadJobs() {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setLoading(false);
      return;
    }
    try {
      let url = `${SUPABASE_URL}/rest/v1/render_jobs?select=*&order=created_at.desc&limit=50`;
      if (filter !== "all") {
        url += `&status=eq.${filter}`;
      }
      const r = await fetch(url, { headers: { apikey: SUPABASE_KEY } });
      const data = await r.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("loadJobs error", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, [filter]);

  // Process queued jobs via API
  async function processQueue() {
    setProcessing(true);
    setProcessResult(null);
    try {
      const res = await fetch("/api/process", { method: "GET" });
      const data = await res.json();
      if (data.processed > 0) {
        setProcessResult(`✓ Processed ${data.processed} job(s)`);
        loadJobs();
      } else {
        setProcessResult("No queued jobs to process");
      }
    } catch (e: any) {
      setProcessResult(`Error: ${e.message}`);
    } finally {
      setProcessing(false);
      setTimeout(() => setProcessResult(null), 5000);
    }
  }

  // Process a single job
  async function processJob(jobId: string) {
    setProcessing(true);
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (data.success) {
        setProcessResult(`✓ Job completed!`);
      } else {
        setProcessResult(`Error: ${data.error}`);
      }
      loadJobs();
    } catch (e: any) {
      setProcessResult(`Error: ${e.message}`);
    } finally {
      setProcessing(false);
      setTimeout(() => setProcessResult(null), 5000);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed": return "#4ade80";
      case "processing": return "#f59e0b";
      case "queued": return "#3b82f6";
      case "error": return "#ef4444";
      default: return "#888";
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "voice": return "🎤";
      case "avatar": return "👤";
      case "video": return "🎬";
      case "final": return "🎞️";
      default: return "📄";
    }
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto" }}>
      <a href="/" style={{ color: "#888", textDecoration: "none" }}>← Back to Home</a>
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "20px" }}>📁 Projects</h1>
      <p style={{ color: "#888", marginBottom: "30px" }}>View and manage your render jobs</p>

      {/* Process Queue Banner */}
      {processResult && (
        <div style={{
          padding: "12px 20px",
          marginBottom: "20px",
          backgroundColor: processResult.includes("✓") ? "#1f3a2f" : "#3a1f1f",
          border: `1px solid ${processResult.includes("✓") ? "#4ade80" : "#ef4444"}`,
          borderRadius: "8px",
          color: processResult.includes("✓") ? "#4ade80" : "#ef4444",
        }}>
          {processResult}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap" }}>
        {["all", "queued", "processing", "completed", "error"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              backgroundColor: filter === f ? "#2563eb" : "#1a1a1a",
              color: "white",
              border: "1px solid #333",
              borderRadius: "6px",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {f}
          </button>
        ))}
        
        {/* Process Queue Button */}
        <button
          onClick={processQueue}
          disabled={processing}
          style={{
            padding: "8px 20px",
            backgroundColor: "#059669",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: processing ? "not-allowed" : "pointer",
            fontWeight: "600",
            opacity: processing ? 0.7 : 1,
          }}
        >
          {processing ? "⏳ Processing..." : "▶️ Process Queue"}
        </button>

        <button
          onClick={loadJobs}
          style={{
            padding: "8px 16px",
            backgroundColor: "#1a1a1a",
            color: "#888",
            border: "1px solid #333",
            borderRadius: "6px",
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading...</p>
      ) : jobs.length === 0 ? (
        <div style={{ padding: "60px", textAlign: "center", backgroundColor: "#1a1a1a", borderRadius: "12px", border: "1px solid #333" }}>
          <p style={{ fontSize: "48px", marginBottom: "20px" }}>📭</p>
          <p style={{ color: "#888", fontSize: "18px" }}>No jobs found</p>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
            Create a job from Voice, Avatar, or Video pages
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                padding: "20px",
                backgroundColor: "#1a1a1a",
                borderRadius: "12px",
                border: "1px solid #333",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <span style={{ fontSize: "32px" }}>{getTypeIcon(job.type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>{job.type}</span>
                    <span style={{ color: "#666", fontSize: "14px" }}>#{job.id.slice(0, 8)}</span>
                  </div>
                  <div style={{ color: "#888", fontSize: "14px" }}>
                    {new Date(job.created_at).toLocaleString()}
                  </div>
                  {job.error && (
                    <div style={{ color: "#ef4444", fontSize: "14px", marginTop: "4px" }}>
                      Error: {job.error}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    padding: "6px 12px",
                    backgroundColor: `${getStatusColor(job.status)}20`,
                    color: getStatusColor(job.status),
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    textTransform: "capitalize",
                  }}
                >
                  {job.status}
                </span>
                {job.status === "queued" && (
                  <button
                    onClick={() => processJob(job.id)}
                    disabled={processing}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#059669",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: processing ? "not-allowed" : "pointer",
                      fontSize: "14px",
                    }}
                  >
                    ▶️ Process
                  </button>
                )}
                {(job.output_url || job.result_url) && (
                  <a
                    href={job.output_url || job.result_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "14px",
                    }}
                  >
                    ⬇️ Download
                  </a>
                )}
              </div>
              
              {/* Progress Bar */}
              {job.status === "processing" && (
                <div style={{ marginTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#888", fontSize: "12px" }}>Processing...</span>
                    <span style={{ color: "#f59e0b", fontSize: "12px" }}>{job.progress || 0}%</span>
                  </div>
                  <div style={{ width: "100%", height: "6px", backgroundColor: "#333", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${job.progress || 0}%`,
                        height: "100%",
                        backgroundColor: "#f59e0b",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "60px", padding: "20px", backgroundColor: "#1a1a1a", borderRadius: "8px", border: "1px solid #333" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Job Status Guide</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", color: "#888" }}>
          <div><span style={{ color: "#3b82f6" }}>● Queued</span> — Waiting for worker</div>
          <div><span style={{ color: "#f59e0b" }}>● Processing</span> — Currently rendering</div>
          <div><span style={{ color: "#4ade80" }}>● Completed</span> — Ready to download</div>
          <div><span style={{ color: "#ef4444" }}>● Error</span> — Something went wrong</div>
        </div>
      </div>
    </main>
  );
}
