import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

function maskNumber(num) {
  if (!num) return "";
  const s = num.toString();
  if (s.length <= 4) return s;
  return s.slice(0, 2) + "X".repeat(Math.max(0, s.length - 4)) + s.slice(-2);
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emergency, setEmergency] = useState("");
  const [allowEmergency, setAllowEmergency] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    const id = localStorage.getItem('dc_current');
    if (!id) return navigate('/login');
    const users = JSON.parse(localStorage.getItem('dc_users') || '[]');
    const u = users.find(x=>x.id===id);
    if (!u) return navigate('/login');
    setUser(u);
    setName(u.name); setPhone(u.phone); setEmergency(u.emergency); setAllowEmergency(!!u.allowEmergency);
  },[]);

  function save() {
    const users = JSON.parse(localStorage.getItem('dc_users') || '[]');
    const idx = users.findIndex(x=>x.id===user.id);
    if (idx === -1) return;
    users[idx] = { ...users[idx], name, phone, emergency, allowEmergency };
    localStorage.setItem('dc_users', JSON.stringify(users));
    setUser(users[idx]);
    setEditing(false);
  }

  function downloadQR(size=400){
    const container = document.getElementById('profile-qr');
    if (!container) return; const canvas = container.querySelector('canvas');
    if (!canvas) return alert('QR not ready');
    const tmp = document.createElement('canvas'); tmp.width=size; tmp.height=size; const ctx=tmp.getContext('2d');
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,size,size); ctx.drawImage(canvas,0,0,size,size);
    const a=document.createElement('a'); a.href=tmp.toDataURL('image/png'); a.download=`dc-qr-${size}.png`; a.click();
  }

  if (!user) return null;

  return (
    <div className="container">
      <h2>Profile</h2>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {!editing ? (
          <div>
            <div><strong>{user.name}</strong></div>
            <div>Contact: {maskNumber(user.phone)}</div>
            <div>Emergency: {maskNumber(user.emergency)}</div>
            <div>Emergency Access: {user.allowEmergency ? 'Allowed' : 'Not allowed'}</div>
            <div style={{ marginTop: 12 }}>
              <button className="main-btn login-btn" onClick={()=>setEditing(true)}>Edit</button>
              <button className="main-btn register-btn" onClick={()=>downloadQR(600)} style={{ marginLeft: 8 }}>Download QR</button>
            </div>
            <div id="profile-qr" style={{ display: 'inline-block', marginTop: 18, padding:12, background: 'white', borderRadius: 8 }}>
              <QRCodeCanvas value={JSON.stringify({ uuid: user.uuid })} size={220} />
            </div>
          </div>
        ) : (
          <div>
            <div className="form-grid">
              <div className="form-row">
                <label className="form-label">Full Name</label>
                <input className="main-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" />
              </div>

              <div className="form-row">
                <label className="form-label">Contact Number</label>
                <input className="main-input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Full number (visible to you only)" />
              </div>

              <div className="form-row">
                <label className="form-label">Emergency Number</label>
                <input className="main-input" value={emergency} onChange={e=>setEmergency(e.target.value)} placeholder="Emergency contact number" />
              </div>

              <div className="form-row">
                <label className="form-label">Privacy</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type='checkbox' checked={allowEmergency} onChange={e=>setAllowEmergency(e.target.checked)} />
                  <div style={{ color: '#cfe6ff' }}>Allow emergency contact call</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop:12 }}>
              <button className='main-btn login-btn' onClick={save}>Save</button>
              <button className='main-btn register-btn' onClick={()=>setEditing(false)} style={{ marginLeft:8 }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
