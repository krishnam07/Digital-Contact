import { useState } from "react";

function maskNumber(num) {
  if (!num) return "";
  const s = num.toString();
  if (s.length <= 4) return s;
  return s.slice(0, 2) + "X".repeat(Math.max(0, s.length - 4)) + s.slice(-2);
}

export default function Scanner(){
  const [scannedUuid, setScannedUuid] = useState("");
  const [result, setResult] = useState(null);

  function lookup(uuid){
    const users = JSON.parse(localStorage.getItem('dc_users')||'[]');
    const u = users.find(x=>x.uuid===uuid);
    setResult(u||null);
  }

  function onScan(){
    lookup(scannedUuid);
  }

  const current = localStorage.getItem('dc_current');

  return (
    <div className="container">
      <h2>QR Scanner</h2>
      <p>Paste scanned payload (example: {`{"uuid":"dc-..."}`}) or pick a sample UUID.</p>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <input value={scannedUuid} onChange={e=>setScannedUuid(e.target.value)} className="main-input" placeholder='{"uuid":"dc-..."}' />
        <div style={{ marginTop: 10 }}>
          <button className="main-btn login-btn" onClick={onScan}>Lookup</button>
        </div>

        <div style={{ marginTop: 18 }}>
          {!result ? (
            <div style={{ color: '#cfe6ff' }}>No result</div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 8 }}>
              <div><strong>{result.name}</strong></div>
              {current ? (
                <div>
                  <div>Contact: {maskNumber(result.phone)}</div>
                  <div style={{ marginTop: 8 }}>
                    <a className="main-btn register-btn" href={`tel:${result.phone}`}>📞 Call Owner</a>
                    {result.allowEmergency ? <a className="main-btn login-btn" style={{ marginLeft: 8 }} href={`tel:${result.emergency}`}>🚨 Emergency Call</a> : null}
                  </div>
                </div>
              ) : (
                <div>
                  <div>Contact: {maskNumber(result.phone)}</div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ color: '#ffd9c2' }}>Please download app & register/login to contact owner</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
