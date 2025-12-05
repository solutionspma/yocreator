"use client";
import { AuthProvider } from "../lib/AuthContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavBar />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </AuthProvider>
  );
}
