import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StickerPreview from "../components/StickerPreview";
import { CallIcon } from "../components/Icon";

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

  function logout() {
    // remove current user marker and any token, then navigate to login
    localStorage.removeItem('dc_current');
    localStorage.removeItem('dc_token');
    navigate('/login');
  }


  if (!user) return null;

  return (
    <div className="container">
      <h2>Profile</h2>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {!editing ? (
          <div>
            <div><strong>{user.name}</strong></div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <CallIcon style={{ width:18, height:18 }} />
              <span>
                Contact: {user.phone ? (
                  <a href={`tel:${user.phone}`} style={{ color:'inherit', textDecoration:'none' }}>{maskNumber(user.phone)}</a>
                ) : <span>—</span>}
              </span>
              {user.phone && (
                <button
                  className="main-btn call-btn"
                  onClick={()=>window.location.href = `tel:${user.phone}`}
                  style={{
                    background:'#28a745',
                    borderColor:'#28a745',
                    color:'#fff',
                    padding:'6px 16px',
                    fontSize:13,
                    borderRadius:20,
                    cursor:'pointer',
                    boxShadow:'0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  Call me
                </button>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:8 }}>
              <CallIcon style={{ width:18, height:18 }} />
              <span>
                Emergency: {user.emergency ? (
                  <a href={`tel:${user.emergency}`} style={{ color:'inherit', textDecoration:'none' }}>{maskNumber(user.emergency)}</a>
                ) : <span>—</span>}
              </span>
              {user.emergency && (
                <button
                  className="main-btn call-btn"
                  onClick={()=>window.location.href = `tel:${user.emergency}`}
                  style={{
                    background:'#28a745',
                    borderColor:'#28a745',
                    color:'#fff',
                    padding:'6px 16px',
                    fontSize:13,
                    borderRadius:20,
                    cursor:'pointer',
                    boxShadow:'0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  Call me
                </button>
              )}
            </div>
            <div>Emergency Access: {user.allowEmergency ? 'Allowed' : 'Not allowed'}</div>
            <div style={{ marginTop: 12 }}>
              <button type="button" className="main-btn login-btn" onClick={()=>setEditing(true)}>Edit</button>
              <button type="button" className="main-btn register-btn" onClick={()=>navigate('/download', { state: { uuid: user.uuid } })} style={{ marginLeft: 8 }}>Download QR</button>
              <button type="button" className="main-btn" onClick={logout} style={{ marginLeft: 8, background:'#f55', borderColor:'#f55' }}>Logout</button>
            </div>
            <div style={{ marginTop: 18, textAlign: 'center' }}>
              <StickerPreview uuid={user.uuid} minimal={true} size={220} id="profile-qr" onClick={()=>navigate('/download', { state: { uuid: user.uuid } })} />
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
              <button type="button" className='main-btn login-btn' onClick={save}>Save</button>
              <button type="button" className='main-btn register-btn' onClick={()=>setEditing(false)} style={{ marginLeft:8 }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
