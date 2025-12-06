"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ScanPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  
  const [webcamActive, setWebcamActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [captures, setCaptures] = useState<string[]>([]);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user"); // Start with front camera for selfies
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashEffect, setFlashEffect] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Simple face detection using canvas brightness analysis
  useEffect(() => {
    if (!videoReady || !videoRef.current || !canvasRef.current) return;
    
    const checkForFace = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.videoWidth === 0) return;
      
      // Use a smaller canvas for detection
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Draw center portion of video (where face should be)
      const centerX = video.videoWidth / 2 - 150;
      const centerY = video.videoHeight / 2 - 200;
      ctx.drawImage(video, centerX, centerY, 300, 400, 0, 0, 100, 100);
      
      // Analyze if there's something in the center (basic detection)
      const imageData = ctx.getImageData(25, 25, 50, 50);
      const data = imageData.data;
      
      let brightness = 0;
      let variation = 0;
      let prevBrightness = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const b = (data[i] + data[i + 1] + data[i + 2]) / 3;
        brightness += b;
        if (i > 0) variation += Math.abs(b - prevBrightness);
        prevBrightness = b;
      }
      
      brightness /= (data.length / 4);
      variation /= (data.length / 4);
      
      // If there's decent brightness and variation, likely a face
      setFaceDetected(brightness > 30 && brightness < 230 && variation > 5);
    };
    
    const interval = setInterval(checkForFace, 500);
    return () => clearInterval(interval);
  }, [videoReady]);

  async function startCamera() {
    try {
      setVideoReady(false);
      
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setWebcamActive(true);
            setVideoReady(true);
            setError(null);
          });
        };
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      setError(`Camera error: ${err.message}. Please allow camera access.`);
      setWebcamActive(false);
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) {
      console.log("No video or canvas ref");
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Check if video is actually playing
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.log("Video not ready - dimensions:", video.videoWidth, video.videoHeight);
      alert("Camera still loading, please wait a moment...");
      return;
    }
    
    // Flash effect
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Set canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Mirror if using front camera
      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      
      ctx.drawImage(video, 0, 0);
      
      // Reset transform
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      console.log("Captured photo, length:", dataUrl.length);
      setCaptures(prev => [...prev, dataUrl]);
    }
  }

  function switchCamera() {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  }

  function removeCapture(index: number) {
    setCaptures(prev => prev.filter((_, i) => i !== index));
  }

  async function sendToDesktop() {
    if (captures.length === 0) {
      alert("Take at least one photo first!");
      return;
    }
    
    setSending(true);
    
    try {
      // Store in localStorage with the session ID
      const existingData = localStorage.getItem(`avatar-session-${sessionId}`);
      const data = existingData ? JSON.parse(existingData) : { captures: [] };
      data.captures = [...data.captures, ...captures];
      data.timestamp = Date.now();
      localStorage.setItem(`avatar-session-${sessionId}`, JSON.stringify(data));
      
      setSent(true);
      
      // Also try to use BroadcastChannel for same-device communication
      try {
        const channel = new BroadcastChannel(`avatar-${sessionId}`);
        channel.postMessage({ type: "captures", captures });
        channel.close();
      } catch (e) {
        // BroadcastChannel not supported
      }
    } catch (err: any) {
      setError(`Failed to send: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>✅</div>
        <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>Photos Captured!</h1>
        <p style={{ color: "#888", marginBottom: "30px" }}>{captures.length} photo{captures.length > 1 ? "s" : ""} saved. You can now use these in the Character Creator.</p>
        <button 
          onClick={() => { setSent(false); setCaptures([]); }}
          style={{ padding: "14px 28px", backgroundColor: "#7c3aed", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer" }}
        >
          Take More Photos
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "white", padding: "0", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", backgroundColor: "#111", borderBottom: "1px solid #222", textAlign: "center", flexShrink: 0 }}>
        <h1 style={{ fontSize: "18px", margin: 0 }}>📸 Face Scanner</h1>
        <p style={{ color: "#888", fontSize: "12px", margin: "4px 0 0" }}>
          {sessionId ? `Session: ${sessionId}` : "Direct Access"}
        </p>
      </div>

      {/* Camera View */}
      <div style={{ position: "relative", flex: 1, backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {/* Flash effect overlay */}
        {flashEffect && (
          <div style={{ position: "absolute", inset: 0, backgroundColor: "white", zIndex: 100, opacity: 0.8 }} />
        )}
        
        {error ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p style={{ color: "#f87171", marginBottom: "16px" }}>{error}</p>
            <button 
              onClick={startCamera}
              style={{ padding: "12px 24px", backgroundColor: "#7c3aed", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover", 
                transform: facingMode === "user" ? "scaleX(-1)" : "none" 
              }}
            />
            
            {/* Face guide overlay */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ 
                width: "220px", 
                height: "280px", 
                border: `3px dashed ${faceDetected ? "#22c55e" : "rgba(124, 58, 237, 0.7)"}`, 
                borderRadius: "50%",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)",
                transition: "border-color 0.3s"
              }} />
            </div>
            
            {/* Face detection indicator */}
            <div style={{ position: "absolute", top: "60px", left: 0, right: 0, textAlign: "center" }}>
              <span style={{ 
                backgroundColor: faceDetected ? "rgba(34, 197, 94, 0.9)" : "rgba(0,0,0,0.7)", 
                padding: "8px 16px", 
                borderRadius: "20px", 
                fontSize: "14px",
                transition: "background-color 0.3s"
              }}>
                {faceDetected ? "✓ Face detected - Tap Capture!" : "Position your face in the oval"}
              </span>
            </div>
            
            {/* Loading indicator */}
            {!videoReady && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.8)" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "40px", height: "40px", border: "3px solid #333", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                  <p>Starting camera...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </>
        )}
        
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {/* Controls */}
      <div style={{ padding: "16px", backgroundColor: "#111", flexShrink: 0 }}>
        {/* Capture count */}
        {captures.length > 0 && (
          <div style={{ marginBottom: "12px" }}>
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>📷 {captures.length} photo{captures.length > 1 ? "s" : ""} captured</p>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {captures.map((cap, i) => (
                <div key={i} style={{ position: "relative", flexShrink: 0 }}>
                  <img src={cap} alt={`Capture ${i + 1}`} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "2px solid #333" }} />
                  <button 
                    onClick={() => removeCapture(i)}
                    style={{ position: "absolute", top: "-6px", right: "-6px", width: "20px", height: "20px", backgroundColor: "#dc2626", color: "white", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Camera buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "12px" }}>
          <button 
            onClick={switchCamera}
            style={{ padding: "14px 20px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "12px", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            🔄 Flip
          </button>
          <button 
            onClick={capturePhoto}
            disabled={!videoReady}
            style={{ 
              padding: "16px 40px", 
              backgroundColor: faceDetected ? "#22c55e" : "#7c3aed", 
              color: "white", 
              border: "none", 
              borderRadius: "50px", 
              fontSize: "16px", 
              fontWeight: "700", 
              cursor: videoReady ? "pointer" : "not-allowed", 
              opacity: videoReady ? 1 : 0.5,
              boxShadow: faceDetected ? "0 0 20px rgba(34, 197, 94, 0.5)" : "none",
              transition: "all 0.3s"
            }}
          >
            📸 CAPTURE
          </button>
        </div>

        {/* Send button */}
        {captures.length > 0 && (
          <button 
            onClick={sendToDesktop}
            disabled={sending}
            style={{ 
              width: "100%",
              padding: "14px", 
              backgroundColor: "#16a34a", 
              color: "white", 
              border: "none", 
              borderRadius: "12px", 
              fontSize: "15px", 
              fontWeight: "600", 
              cursor: sending ? "not-allowed" : "pointer", 
              opacity: sending ? 0.7 : 1 
            }}
          >
            {sending ? "Saving..." : `✅ Done - Save ${captures.length} Photo${captures.length > 1 ? "s" : ""}`}
          </button>
        )}

        {/* Tips */}
        <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#1a1a1a", borderRadius: "8px" }}>
          <p style={{ color: "#666", fontSize: "12px", margin: 0, lineHeight: 1.5 }}>
            💡 <strong style={{ color: "#888" }}>Tips:</strong> Good lighting • Face the camera • Take 3-5 shots from different angles
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PhoneScanPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading scanner...</p>
      </div>
    }>
      <ScanPageContent />
    </Suspense>
  );
}
