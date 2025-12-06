"use client";
import { useState, useEffect, useCallback } from "react";

interface ReadyPlayerMeFrameProps {
  onAvatarCreated: (avatarUrl: string) => void;
  onClose?: () => void;
  subdomain?: string;
}

export default function ReadyPlayerMeFrame({ 
  onAvatarCreated, 
  onClose,
  subdomain = "demo" 
}: ReadyPlayerMeFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Ready Player Me iframe configuration
  const rpmUrl = `https://${subdomain}.readyplayer.me/avatar?frameApi`;
  
  // Handle messages from RPM iframe
  const handleMessage = useCallback((event: MessageEvent) => {
    // Verify origin
    if (!event.origin.includes("readyplayer.me")) return;
    
    try {
      const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      
      if (data.source === "readyplayerme") {
        switch (data.eventName) {
          case "v1.frame.ready":
            setIsLoading(false);
            // Send configuration to iframe
            const iframe = document.getElementById("rpm-frame") as HTMLIFrameElement;
            if (iframe?.contentWindow) {
              iframe.contentWindow.postMessage(
                JSON.stringify({
                  target: "readyplayerme",
                  type: "subscribe",
                  eventName: "v1.**"
                }),
                "*"
              );
            }
            break;
            
          case "v1.avatar.exported":
            // Avatar URL received
            if (data.data?.url) {
              // Convert to GLB format for Three.js
              const glbUrl = data.data.url.replace(".glb", ".glb") + "?morphTargets=ARKit&textureAtlas=1024";
              onAvatarCreated(glbUrl);
            }
            break;
            
          case "v1.user.set":
            console.log("RPM User set:", data.data);
            break;
        }
      }
    } catch (e) {
      // Handle non-JSON messages
    }
  }, [onAvatarCreated]);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  return (
    <div style={{ 
      position: "fixed", 
      inset: 0, 
      backgroundColor: "rgba(0,0,0,0.95)", 
      zIndex: 1000,
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Header */}
      <div style={{ 
        padding: "16px 24px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid #333"
      }}>
        <div>
          <h2 style={{ margin: 0, color: "white", fontSize: "20px" }}>✨ Create Your Avatar</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>
            Customize your 3D avatar with Ready Player Me
          </p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#333", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            ✕ Close
          </button>
        )}
      </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div style={{ 
          position: "absolute", 
          inset: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          zIndex: 10
        }}>
          <div style={{ textAlign: "center", color: "white" }}>
            <div style={{ 
              width: "50px", 
              height: "50px", 
              border: "3px solid #333", 
              borderTopColor: "#7c3aed", 
              borderRadius: "50%", 
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px"
            }} />
            <p>Loading Avatar Creator...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      )}
      
      {/* RPM iframe */}
      <iframe
        id="rpm-frame"
        src={rpmUrl}
        style={{ 
          flex: 1, 
          width: "100%", 
          border: "none",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s"
        }}
        allow="camera *; microphone *; clipboard-write"
      />
    </div>
  );
}
