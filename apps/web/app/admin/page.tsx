"use client";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalJobs: 0, completedJobs: 0, revenue: 0 });

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      if (u.role !== "genesis") {
        window.location.href = "/";
      }
    } else {
      window.location.href = "/login";
    }
    loadData();
  }, []);

  async function loadData() {
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
    
    try {
      // Load jobs
      const jobsRes = await fetch(`${SUPABASE_URL}/rest/v1/render_jobs?select=*&order=created_at.desc&limit=100`, {
        headers: { apikey: SUPABASE_KEY },
      });
      const jobsData = await jobsRes.json();
      if (Array.isArray(jobsData)) {
        setJobs(jobsData);
        setStats(s => ({
          ...s,
          totalJobs: jobsData.length,
          completedJobs: jobsData.filter((j: any) => j.status === "completed").length,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!user || user.role !== "genesis") {
    return <main style={{ padding: "40px", textAlign: "center" }}>Loading...</main>;
  }

  return (
    <main style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>👑 Master Dashboard</h1>
          <p style={{ color: "#888" }}>Genesis Account: Full Platform Control</p>
        </div>
        <a href="/" style={{ color: "#888", textDecoration: "none" }}>← Back to Home</a>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "40px" }}>
        {[
          { label: "Total Users", value: stats.totalUsers || "—", icon: "👥", color: "#3b82f6" },
          { label: "Total Jobs", value: stats.totalJobs, icon: "📊", color: "#8b5cf6" },
          { label: "Completed", value: stats.completedJobs, icon: "✅", color: "#4ade80" },
          { label: "Revenue", value: `$${stats.revenue}`, icon: "💰", color: "#f59e0b" },
        ].map((stat) => (
          <div key={stat.label} style={{ 
            backgroundColor: "#1a1a1a", 
            padding: "24px", 
            borderRadius: "12px", 
            border: "1px solid #333" 
          }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: stat.color }}>{stat.value}</div>
            <div style={{ color: "#888", fontSize: "14px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {[
            { label: "User Management", href: "#users", icon: "👥" },
            { label: "Platform Settings", href: "/settings", icon: "⚙️" },
            { label: "CMS Editor", href: "/settings?tab=cms", icon: "🎨" },
            { label: "Marketing Engine", href: "#marketing", icon: "📣" },
            { label: "Analytics", href: "#analytics", icon: "📈" },
            { label: "GPU Nodes", href: "#nodes", icon: "🖥️" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              style={{
                padding: "16px 24px",
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                border: "1px solid #333",
                color: "white",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "20px" }}>{action.icon}</span>
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* Recent Jobs */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Recent Jobs</h2>
        <div style={{ backgroundColor: "#1a1a1a", borderRadius: "12px", border: "1px solid #333", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Created</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 10).map((job) => (
                <tr key={job.id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={tdStyle}>#{job.id}</td>
                  <td style={tdStyle}>
                    <span style={{ 
                      padding: "4px 8px", 
                      backgroundColor: "#333", 
                      borderRadius: "4px",
                      fontSize: "12px"
                    }}>
                      {job.type}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ 
                      color: job.status === "completed" ? "#4ade80" : 
                             job.status === "error" ? "#ef4444" : 
                             job.status === "processing" ? "#f59e0b" : "#3b82f6"
                    }}>
                      {job.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{new Date(job.created_at).toLocaleString()}</td>
                  <td style={tdStyle}>
                    <button style={{ 
                      padding: "6px 12px", 
                      backgroundColor: "#333", 
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "#666" }}>
                    No jobs yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management */}
      <div id="users" style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>User Management</h2>
        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <input 
              type="text" 
              placeholder="Search users..." 
              style={{
                padding: "10px 16px",
                backgroundColor: "#0f0f0f",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "white",
                width: "300px"
              }}
            />
            <button style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              + Add User
            </button>
          </div>
          <p style={{ color: "#666", textAlign: "center", padding: "40px" }}>
            User management table will populate from Supabase users table
          </p>
        </div>
      </div>

      {/* Marketing Engine */}
      <div id="marketing" style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>🥊 Marketing Engine</h2>
        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <h3 style={{ fontSize: "18px", marginBottom: "15px", color: "#bbb" }}>Email Campaigns</h3>
              <button style={actionBtnStyle}>Create Campaign</button>
              <button style={{ ...actionBtnStyle, backgroundColor: "#333" }}>View Analytics</button>
            </div>
            <div>
              <h3 style={{ fontSize: "18px", marginBottom: "15px", color: "#bbb" }}>Data Collection</h3>
              <button style={actionBtnStyle}>Export Leads</button>
              <button style={{ ...actionBtnStyle, backgroundColor: "#333" }}>Segment Users</button>
            </div>
          </div>
        </div>
      </div>

      {/* GPU Nodes */}
      <div id="nodes">
        <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>🖥️ GPU Node Network</h2>
        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
            {[
              { name: "Node-001", status: "online", gpu: "RTX 4090", jobs: 12 },
              { name: "Node-002", status: "online", gpu: "A100", jobs: 8 },
              { name: "Node-003", status: "offline", gpu: "RTX 3090", jobs: 0 },
            ].map((node) => (
              <div key={node.name} style={{ 
                backgroundColor: "#0f0f0f", 
                padding: "20px", 
                borderRadius: "8px",
                border: `1px solid ${node.status === "online" ? "#4ade80" : "#ef4444"}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <strong>{node.name}</strong>
                  <span style={{ 
                    padding: "4px 8px", 
                    backgroundColor: node.status === "online" ? "#4ade8033" : "#ef444433",
                    color: node.status === "online" ? "#4ade80" : "#ef4444",
                    borderRadius: "4px",
                    fontSize: "12px"
                  }}>
                    {node.status}
                  </span>
                </div>
                <p style={{ color: "#888", fontSize: "14px" }}>{node.gpu}</p>
                <p style={{ color: "#666", fontSize: "12px" }}>{node.jobs} jobs processed</p>
              </div>
            ))}
          </div>
          <button style={{ ...actionBtnStyle, marginTop: "20px" }}>+ Add Node</button>
        </div>
      </div>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  padding: "16px",
  textAlign: "left",
  color: "#888",
  fontSize: "14px",
  fontWeight: "500",
};

const tdStyle: React.CSSProperties = {
  padding: "16px",
  color: "white",
  fontSize: "14px",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "10px",
  marginBottom: "10px",
};
