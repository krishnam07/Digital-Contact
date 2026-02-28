import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import StickerPreview from "../components/StickerPreview";

function maskNumber(num) {
  if (!num) return "";
  const s = num.toString();
  if (s.length <= 4) return s;
  return s.slice(0, 2) + "X".repeat(Math.max(0, s.length - 4)) + s.slice(-2);
}

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergency, setEmergency] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [allowEmergency, setAllowEmergency] = useState(true);
  const [registeredId, setRegisteredId] = useState(null);
  const qrRef = useRef();
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    if (!name || !phone || !password) return alert("Please fill required fields");
    if (password !== confirm) return alert("Passwords do not match");

    // lazy hash using bcryptjs (ensure dependency installed)
    const bcrypt = await import("bcryptjs");
    const hash = bcrypt.hashSync(password, 10);

    const users = JSON.parse(localStorage.getItem("dc_users") || "[]");
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
    const uuid = "dc-" + id;
    const user = { id, name, phone, email, emergency, passwordHash: hash, allowEmergency, uuid };
    users.push(user);
    localStorage.setItem("dc_users", JSON.stringify(users));
    localStorage.setItem("dc_current", id);
    setRegisteredId(id);
    
    // Redirect to profile page after 1 second
    setTimeout(() => {
      navigate('/profile');
    }, 1000);
  }

  function downloadQR(size = 400) {
    // find canvas inside generated QR container
    const container = document.getElementById("generated-qr");
    if (!container) return;
    const canvas = container.querySelector("canvas");
    if (!canvas) return alert("QR not ready yet");
    // create an offscreen canvas to scale to size
    const tmp = document.createElement("canvas");
    tmp.width = size;
    tmp.height = size;
    const ctx = tmp.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0,0,size,size);
    ctx.drawImage(canvas, 0, 0, size, size);
    const link = document.createElement("a");
    link.href = tmp.toDataURL("image/png");
    link.download = `digital-contact-qr-${size}.png`;
    link.click();
  }

  const registeredUser = registeredId && JSON.parse(localStorage.getItem("dc_users") || "[]").find(u=>u.id===registeredId);

  return (
    <div className="container">
      <h2>Register</h2>

      {!registeredUser ? (
        <form onSubmit={handleRegister} style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input value={name} onChange={e=>setName(e.target.value)} className="main-input" placeholder="e.g. Krishnam Agrawal" required />
            </div>

            <div className="form-row">
              <label className="form-label">Contact Number <span className="required">*</span></label>
              <input value={phone} onChange={e=>setPhone(e.target.value)} className="main-input" placeholder="e.g. +919812345678" required />
            </div>

            <div className="form-row">
              <label className="form-label">Emergency Contact</label>
              <input value={emergency} onChange={e=>setEmergency(e.target.value)} className="main-input" placeholder="Optional — trusted contact" />
            </div>

            <div className="form-row">
              <label className="form-label">Privacy</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" checked={allowEmergency} onChange={e=>setAllowEmergency(e.target.checked)} />
                <div style={{ color: '#cfe6ff' }}>Allow emergency contact call</div>
              </div>
            </div>

            <div className="form-row">
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="main-input" placeholder="Optional — your email address" />
            </div>

            <div className="form-row">
              <label className="form-label">Password <span className="required">*</span></label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="main-input" placeholder="Create a secure password" required />
            </div>

            <div className="form-row">
              <label className="form-label">Confirm Password <span className="required">*</span></label>
              <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="main-input" placeholder="Re-enter password" required />
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="main-btn register-btn" type="submit">Register</button>
            <button className="main-btn login-btn" type="button" onClick={()=>navigate('/login')}>Have an account?</button>
            <div className="form-note">We store your number securely. OTP verification will be used for mobile verification.</div>
          </div>
        </form>
      ) : (
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h3>Registered — {registeredUser.name}</h3>
          <p>Contact: {maskNumber(registeredUser.phone)}</p>

          <div id="generated-qr" style={{ display: "inline-block", padding: 12, background: "white", borderRadius: 8 }}>
            <QRCodeCanvas value={JSON.stringify({ uuid: registeredUser.uuid })} size={220} />
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="main-btn register-btn" onClick={()=>downloadQR(400)}>Download PNG (400px)</button>
            <button className="main-btn login-btn" onClick={()=>downloadQR(800)} style={{ marginLeft: 8 }}>Download PNG (800px)</button>
          </div>
        </div>
      )}
    </div>
  );
}
