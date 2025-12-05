"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../lib/AuthContext";

export default function NavBar() {
  const { user, logout: authLogout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function logout() {
    authLogout();
    window.location.href = "/";
  }

  return (
    <nav style={{
      backgroundColor: "#0a0a0a",
      borderBottom: "1px solid #222",
      padding: "0 40px",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "70px",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>🎬</span>
          <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>YOcreator</span>
        </Link>

        {/* Main Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link href="/studio" style={navLinkStyle}>Studio</Link>
          <Link href="/studio/voice" style={navLinkStyle}>Voice</Link>
          <Link href="/studio/avatar" style={navLinkStyle}>Avatar</Link>
          <Link href="/studio/video" style={navLinkStyle}>Video</Link>
          <Link href="/studio/projects" style={navLinkStyle}>Projects</Link>
          {user?.role === "genesis" && (
            <Link href="/admin" style={{ ...navLinkStyle, color: "#f59e0b" }}>👑 Admin</Link>
          )}
        </div>

        {/* User Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {user ? (
            <>
              <Link href="/settings" style={navLinkStyle}>⚙️ Settings</Link>
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <span style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: user.role === "genesis" ? "#f59e0b" : "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}>
                    {user.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                  <span style={{ fontSize: "14px" }}>{user.username}</span>
                </button>
                {menuOpen && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "8px",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    minWidth: "160px",
                    overflow: "hidden",
                  }}>
                    <Link href="/settings" style={dropdownItemStyle}>Profile</Link>
                    <Link href="/settings" style={dropdownItemStyle}>Settings</Link>
                    <button onClick={logout} style={{ ...dropdownItemStyle, border: "none", width: "100%", textAlign: "left", color: "#ef4444" }}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                padding: "10px 20px",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
              }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const navLinkStyle: React.CSSProperties = {
  color: "#888",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "500",
  transition: "color 0.2s",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "block",
  padding: "12px 16px",
  color: "#bbb",
  textDecoration: "none",
  fontSize: "14px",
  borderBottom: "1px solid #222",
  backgroundColor: "transparent",
  cursor: "pointer",
};
