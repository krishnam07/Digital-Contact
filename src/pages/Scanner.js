import { useState, useRef, useEffect } from "react";
import QrScanner from "qr-scanner";

function maskNumber(num) {
  if (!num) return "";
  const s = num.toString();
  if (s.length <= 4) return s;
  return s.slice(0, 2) + "X".repeat(Math.max(0, s.length - 4)) + s.slice(-2);
}

export default function Scanner(){
  const [scannedUuid, setScannedUuid] = useState("");
  const [result, setResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  function lookup(uuid){
    const users = JSON.parse(localStorage.getItem('dc_users')||'[]');
    const u = users.find(x=>x.uuid===uuid);
    setResult(u||null);
  }

  function onScan(){
    lookup(scannedUuid);
  }

  async function requestCameraPermission() {
    try {
      setCameraError(null);
      setScanning(true);
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      
      // Stop the stream, we'll let QrScanner handle it
      stream.getTracks().forEach(track => track.stop());
      
      // Camera permission granted, now start scanning
      startScanning();
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please enable camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError('Error accessing camera: ' + err.message);
      }
      setScanning(false);
    }
  }

  async function startScanning() {
    if (!videoRef.current) return;
    
    try {
      if (scannerRef.current) {
        await scannerRef.current.destroy();
      }
      
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          // Parse the scanned QR data
          try {
            const data = JSON.parse(result.data);
            if (data.uuid) {
              setScannedUuid(data.uuid);
              lookup(data.uuid);
              stopScanning();
            }
          } catch (e) {
            // If not JSON, try using it as-is
            setScannedUuid(result.data);
            lookup(result.data);
            stopScanning();
          }
        },
        { 
          onDecodeError: () => {}, // Suppress error spam
          maxScansPerSecond: 5,
        }
      );
      
      setCameraActive(true);
      await scannerRef.current.start();
    } catch (err) {
      setCameraError('Error starting scanner: ' + err.message);
      setScanning(false);
    }
  }

  async function stopScanning() {
    if (scannerRef.current) {
      await scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setCameraActive(false);
    setScanning(false);
  }

  useEffect(() => {
    // Auto-start camera on component mount
    requestCameraPermission();
    
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const current = localStorage.getItem('dc_current');

  return (
    <div className="container" style={{ padding: scanning && !cameraActive ? 0 : undefined }}>
      {scanning && !cameraActive ? (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 20
        }}>
          <div style={{ fontSize: 48 }}>📷</div>
          <p style={{ color: '#cfe6ff', fontSize: 18 }}>Requesting camera access...</p>
          <p style={{ color: '#8fa3b8', fontSize: 14 }}>Please approve camera permission in your browser</p>
        </div>
      ) : cameraError ? (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: 20,
          padding: 20
        }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <p style={{ color: '#ffb3b3', fontSize: 16, textAlign: 'center' }}>{cameraError}</p>
          <button className="main-btn login-btn" onClick={() => requestCameraPermission()}>
            🔄 Retry
          </button>
        </div>
      ) : cameraActive ? (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000'
        }}>
          <video 
            ref={videoRef} 
            style={{
              flex: 1,
              objectFit: 'cover',
              width: '100%'
            }}
          />
          
          <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ margin: 0, color: '#fff' }}>Scanning...</h2>
            <button 
              className="main-btn login-btn" 
              onClick={stopScanning}
              style={{ margin: 0 }}
            >
              ✕ Close
            </button>
          </div>

          {/* Scanning frame overlay */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            aspectRatio: '1',
            border: '3px solid rgba(67, 233, 123, 0.5)',
            borderRadius: 20,
            boxShadow: 'inset 0 0 30px rgba(67, 233, 123, 0.1)',
            pointerEvents: 'none'
          }} />

          {/* Result overlay */}
          {result && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(180deg, transparent, rgba(7, 17, 38, 0.95))',
              padding: '40px 20px 20px',
              minHeight: '40%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, backdropFilter: 'blur(10px)' }}>
                <div style={{ marginBottom: 12, fontSize: 20, fontWeight: 600, color: '#fff' }}>✓ Found Contact</div>
                <div style={{ marginBottom: 8, fontSize: 18, fontWeight: 600, color: '#cfe6ff' }}>{result.name}</div>
                <div style={{ color: '#8fa3b8', marginBottom: 12 }}>Contact: {maskNumber(result.phone)}</div>
                {result.email && <div style={{ color: '#8fa3b8', marginBottom: 12 }}>Email: {result.email}</div>}
                
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  {current ? (
                    <>
                      <a className="main-btn register-btn" href={`tel:${result.phone}`} style={{ flex: 1, textAlign: 'center', margin: 0 }}>📞 Call</a>
                      {result.allowEmergency && result.emergency && <a className="main-btn login-btn" href={`tel:${result.emergency}`} style={{ flex: 1, textAlign: 'center', margin: 0 }}>🚨 Emergency</a>}
                    </>
                  ) : (
                    <div style={{ color: '#ffd9c2' }}>Login to contact owner</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
