import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: "#0a0a0a",
      borderTop: "1px solid #222",
      padding: "40px",
      marginTop: "auto",
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "40px",
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontSize: "24px" }}>🎬</span>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>YOcreator</span>
          </div>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
            AI-powered voice cloning, avatar creation, and video generation platform.
          </p>
        </div>

        {/* Studio */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#888" }}>STUDIO</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link href="/studio/voice" style={footerLinkStyle}>Voice Generator</Link>
            <Link href="/studio/avatar" style={footerLinkStyle}>Avatar Builder</Link>
            <Link href="/studio/video" style={footerLinkStyle}>Video Creator</Link>
            <Link href="/studio/projects" style={footerLinkStyle}>My Projects</Link>
          </div>
        </div>

        {/* Platform */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#888" }}>PLATFORM</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link href="/settings" style={footerLinkStyle}>Settings</Link>
            <Link href="/admin" style={footerLinkStyle}>Admin Dashboard</Link>
            <a href="#" style={footerLinkStyle}>API Documentation</a>
            <a href="#" style={footerLinkStyle}>Web3 Integration</a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "16px", color: "#888" }}>COMPANY</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a href="#" style={footerLinkStyle}>About</a>
            <a href="#" style={footerLinkStyle}>Pricing</a>
            <a href="#" style={footerLinkStyle}>Privacy Policy</a>
            <a href="#" style={footerLinkStyle}>Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: "1400px",
        margin: "40px auto 0",
        paddingTop: "24px",
        borderTop: "1px solid #222",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <p style={{ color: "#666", fontSize: "14px" }}>
          © 2025 Pitch Marketing Agency. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <span style={{ color: "#666", fontSize: "14px" }}>Powered by $MODULAR</span>
        </div>
      </div>
    </footer>
  );
}

const footerLinkStyle: React.CSSProperties = {
  color: "#666",
  textDecoration: "none",
  fontSize: "14px",
  transition: "color 0.2s",
};
