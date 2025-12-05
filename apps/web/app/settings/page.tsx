"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const isGenesis = user?.role === "genesis";

  const tabs = [
    { id: "account", label: "Account" },
    { id: "billing", label: "Billing & Payments" },
    { id: "tiers", label: "Access Tiers", genesis: true },
    { id: "web3", label: "Web3 & NFT" },
    { id: "api", label: "API Keys" },
    { id: "cms", label: "CMS Controls", genesis: true },
  ];

  return (
    <main style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <a href="/" style={{ color: "#888", textDecoration: "none" }}>← Back to Home</a>
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginTop: "20px" }}>⚙️ Settings</h1>
      <p style={{ color: "#888", marginBottom: "40px" }}>
        {isGenesis ? "Genesis Master Account - Full Platform Control" : "Manage your account settings"}
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "30px", flexWrap: "wrap" }}>
        {tabs.filter(t => !t.genesis || isGenesis).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 20px",
              backgroundColor: activeTab === tab.id ? "#2563eb" : "#1a1a1a",
              color: "white",
              border: "1px solid #333",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Account Tab */}
      {activeTab === "account" && (
        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Account Information</h2>
          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Username</label>
              <input type="text" value={user?.username || ""} readOnly style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Email</label>
              <input type="email" placeholder="your@email.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Account Tier</label>
              <input type="text" value={user?.tier || "Free"} readOnly style={{ ...inputStyle, color: "#4ade80" }} />
            </div>
            <button style={buttonStyle}>Save Changes</button>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "billing" && (
        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Payment Integration</h2>
          
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "15px", color: "#bbb" }}>Authorize.net</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#888", fontSize: "14px" }}>API Login ID</label>
                <input type="text" placeholder="98ZaZP6zy" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#888", fontSize: "14px" }}>Transaction Key</label>
                <input type="password" placeholder="••••••••" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "15px", color: "#bbb" }}>Stripe</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#888", fontSize: "14px" }}>Publishable Key</label>
                <input type="text" placeholder="pk_live_..." style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#888", fontSize: "14px" }}>Secret Key</label>
                <input type="password" placeholder="sk_live_..." style={inputStyle} />
              </div>
            </div>
          </div>

          <button style={buttonStyle}>Save Payment Settings</button>
        </div>
      )}

      {/* Access Tiers Tab (Genesis Only) */}
      {activeTab === "tiers" && isGenesis && (
        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Access Tiers & Pricing</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { name: "Free", price: "$0", features: ["5 voice generations/mo", "2 avatar renders/mo", "720p export"] },
              { name: "Pro", price: "$29", features: ["50 voice generations/mo", "20 avatar renders/mo", "1080p export", "Priority queue"] },
              { name: "Enterprise", price: "$99", features: ["Unlimited generations", "Unlimited renders", "4K export", "API access", "Dedicated support"] },
            ].map((tier) => (
              <div key={tier.name} style={{ backgroundColor: "#0f0f0f", padding: "20px", borderRadius: "8px", border: "1px solid #333" }}>
                <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>{tier.name}</h3>
                <p style={{ fontSize: "32px", fontWeight: "bold", color: "#2563eb", marginBottom: "15px" }}>{tier.price}<span style={{ fontSize: "14px", color: "#888" }}>/mo</span></p>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {tier.features.map((f, i) => (
                    <li key={i} style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>✓ {f}</li>
                  ))}
                </ul>
                <button style={{ ...buttonStyle, width: "100%", marginTop: "15px", backgroundColor: "#333" }}>Edit Tier</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Web3 Tab */}
      {activeTab === "web3" && (
        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Web3 & NFT Settings</h2>
          
          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Wallet Address</label>
              <input type="text" placeholder="0x..." style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Modular Token Contract</label>
              <input type="text" placeholder="Contract address for $MODULAR" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>NFT Collection Contract</label>
              <input type="text" placeholder="ERC-721 contract address" style={inputStyle} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" id="autoMint" />
              <label htmlFor="autoMint" style={{ color: "#bbb" }}>Auto-mint completed renders as NFTs</label>
            </div>
            <button style={buttonStyle}>Save Web3 Settings</button>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === "api" && (
        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>API Keys</h2>
          
          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>OpenAI API Key</label>
              <input type="password" placeholder="sk-..." style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>ElevenLabs API Key</label>
              <input type="password" placeholder="Voice cloning API" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Replicate API Token</label>
              <input type="password" placeholder="For avatar generation" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>RunPod API Key</label>
              <input type="password" placeholder="GPU worker access" style={inputStyle} />
            </div>
            <button style={buttonStyle}>Save API Keys</button>
          </div>
        </div>
      )}

      {/* CMS Tab (Genesis Only) */}
      {activeTab === "cms" && isGenesis && (
        <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>CMS Controls</h2>
          
          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Platform Name</label>
              <input type="text" defaultValue="YOcreator Studio" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Primary Color</label>
              <input type="color" defaultValue="#2563eb" style={{ ...inputStyle, height: "50px", padding: "5px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Logo URL</label>
              <input type="text" placeholder="https://..." style={inputStyle} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#bbb" }}>Footer Text</label>
              <input type="text" defaultValue="© 2025 Pitch Marketing Agency" style={inputStyle} />
            </div>
            <button style={buttonStyle}>Save CMS Settings</button>
          </div>
        </div>
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#0f0f0f",
  border: "1px solid #333",
  borderRadius: "8px",
  color: "white",
  fontSize: "16px",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 24px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};
