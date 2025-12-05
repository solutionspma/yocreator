"use client";
import { AuthProvider } from "../lib/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <NavBar />
        <div style={{ flex: 1 }}>
          {children}
        </div>
        <Footer />
      </ProtectedRoute>
    </AuthProvider>
  );
}
