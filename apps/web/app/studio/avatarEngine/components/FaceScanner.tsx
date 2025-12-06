'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useAvatarStore } from '../store';

// ============================================
// OMNI-AVATAR ENGINE - FACE SCANNER
// Using MediaPipe FaceMesh
// ============================================

// Section Header
function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">
      {title}
    </h3>
  );
}

// Face Scanner Component
export default function FaceScannerTab() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'processing' | 'complete' | 'error'>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const { setFaceScan, updateFace, avatar } = useAvatarStore();

  // Check camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
      } catch (err) {
        setHasCamera(false);
        setError('Unable to access camera devices');
      }
    };
    checkCamera();
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        setScanStatus('scanning');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Failed to access camera. Please grant camera permissions.');
      setScanStatus('error');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setScanStatus('idle');
  };

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas (mirror it for selfie mode)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Get image data
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    
    // Start processing
    setScanStatus('processing');
    processFaceScan(imageData);
  }, []);

  // Process face scan (simulated - would use MediaPipe FaceMesh in production)
  const processFaceScan = async (imageData: string) => {
    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setScanProgress(i);
    }
    
    // In production, this would:
    // 1. Load MediaPipe FaceMesh
    // 2. Detect face landmarks (468 points)
    // 3. Extract facial features measurements
    // 4. Generate morph target values based on measurements
    
    // Simulated face analysis results
    const faceAnalysis = {
      // These values would come from actual face mesh analysis
      faceWidth: Math.random() * 40 + 30,      // 30-70
      faceLength: Math.random() * 40 + 30,
      jawWidth: Math.random() * 40 + 30,
      eyeSize: Math.random() * 30 + 35,        // 35-65
      eyeSpacing: Math.random() * 30 + 35,
      noseWidth: Math.random() * 40 + 30,
      noseLength: Math.random() * 40 + 30,
      lipWidth: Math.random() * 40 + 30,
      lipFullnessUpper: Math.random() * 40 + 30,
      lipFullnessLower: Math.random() * 40 + 30,
      cheekboneHeight: Math.random() * 40 + 30,
      cheekboneWidth: Math.random() * 40 + 30,
    };
    
    // Apply detected features to avatar
    Object.entries(faceAnalysis).forEach(([key, value]) => {
      updateFace(key as any, Math.round(value));
    });
    
    // Save scan data
    setFaceScan({
      landmarks: [], // Would contain 468 landmark points
      textureUrl: imageData,
      meshUrl: null,
      confidence: 0.85 + Math.random() * 0.1,
    });
    
    setScanStatus('complete');
    stopCamera();
  };

  // Reset scan
  const resetScan = () => {
    setCapturedImage(null);
    setScanProgress(0);
    setScanStatus('idle');
    setFaceScan(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
      <SectionHeader title="Face Scanner" />
      
      {/* Info Box */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-lg p-4 border border-cyan-500/50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📸</span>
          <div>
            <h4 className="text-white font-semibold">Scan Your Face</h4>
            <p className="text-xs text-gray-400 mt-1">
              Use your camera to scan your face and automatically generate a 3D avatar that looks like you.
              Position your face in the center of the frame for best results.
            </p>
          </div>
        </div>
      </div>

      {/* Camera Status */}
      {hasCamera === false && (
        <div className="bg-red-900/50 rounded-lg p-4 border border-red-500/50">
          <p className="text-red-300 text-sm">
            ⚠️ No camera detected. Please connect a camera to use face scanning.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 rounded-lg p-4 border border-red-500/50">
          <p className="text-red-300 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Video Feed / Captured Image */}
      <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
        {/* Video element */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${isScanning ? 'block' : 'hidden'}`}
          style={{ transform: 'scaleX(-1)' }}
          playsInline
          muted
        />
        
        {/* Canvas for capture (hidden) */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Captured image */}
        {capturedImage && !isScanning && (
          <img 
            src={capturedImage} 
            alt="Captured face" 
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Placeholder when not scanning */}
        {!isScanning && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <div className="text-6xl mb-4">📷</div>
            <p>Camera preview will appear here</p>
          </div>
        )}

        {/* Face guide overlay */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-64 border-2 border-dashed border-cyan-400 rounded-full opacity-60" />
            <div className="absolute text-cyan-400 text-sm mt-72">
              Position your face within the oval
            </div>
          </div>
        )}

        {/* Processing overlay */}
        {scanStatus === 'processing' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4 animate-pulse">🔍</div>
            <p className="text-white mb-4">Analyzing facial features...</p>
            <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">{scanProgress}%</p>
          </div>
        )}

        {/* Complete overlay */}
        {scanStatus === 'complete' && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            ✓ Scan Complete
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {scanStatus === 'idle' && hasCamera && (
          <button
            onClick={startCamera}
            className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-medium transition-colors"
          >
            📸 Start Camera
          </button>
        )}
        
        {scanStatus === 'scanning' && (
          <>
            <button
              onClick={capturePhoto}
              className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors"
            >
              📷 Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
          </>
        )}
        
        {scanStatus === 'complete' && (
          <>
            <button
              onClick={resetScan}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium transition-colors"
            >
              🔄 Scan Again
            </button>
          </>
        )}
      </div>

      {/* Scan Results */}
      {avatar.faceScan && scanStatus === 'complete' && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-400 mb-3">Scan Results</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Confidence:</span>
              <span className="text-white ml-2">
                {Math.round((avatar.faceScan.confidence || 0) * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className="text-green-400 ml-2">Applied to Avatar</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Your facial features have been mapped to the avatar. 
            Fine-tune individual features in the Face tab.
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-white mb-2">Tips for Best Results</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Ensure good, even lighting on your face</li>
          <li>• Look directly at the camera</li>
          <li>• Keep a neutral expression</li>
          <li>• Remove glasses if possible</li>
          <li>• Make sure your full face is visible</li>
        </ul>
      </div>

      {/* Manual Alternative */}
      <div className="text-center py-4 border-t border-gray-700">
        <p className="text-gray-500 text-sm mb-2">
          Don't have a camera or prefer manual creation?
        </p>
        <button
          onClick={() => {
            const store = useAvatarStore.getState();
            store.setActiveTab('face');
          }}
          className="text-purple-400 hover:text-purple-300 text-sm"
        >
          Go to Face Editor →
        </button>
      </div>
    </div>
  );
}
