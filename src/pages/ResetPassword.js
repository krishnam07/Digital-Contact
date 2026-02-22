import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword(){
  const loc = useLocation();
  const navigate = useNavigate();
  const initialPhone = loc.state?.phone || '';

  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(()=>{
    // if no reset payload, maybe redirect
    const payload = JSON.parse(localStorage.getItem('dc_reset') || 'null');
    if (!payload) {
      // nothing pending
    } else if (!phone) setPhone(payload.phone);
  },[]);

  function verifyOtp(e){
    e.preventDefault();
    const payload = JSON.parse(localStorage.getItem('dc_reset') || 'null');
    if (!payload) return alert('No OTP request found.');
    if (Date.now() > payload.expires) return alert('OTP expired. Please request again.');
    if (payload.phone !== phone) return alert('Phone mismatch.');
    if (payload.otp !== otp) return alert('Invalid OTP');
    setVerified(true);
    setMessage('OTP verified — set your new password.');
  }

  async function setPassword(e){
    e.preventDefault();
    if (!verified) return alert('Verify OTP first');
    if (!newPass || newPass !== confirm) return alert('Passwords do not match');
    const bcrypt = await import('bcryptjs');
    const hash = bcrypt.hashSync(newPass, 10);
    const users = JSON.parse(localStorage.getItem('dc_users') || '[]');
    const idx = users.findIndex(u=>u.phone===phone);
    if (idx === -1) return alert('User not found');
    users[idx].passwordHash = hash;
    localStorage.setItem('dc_users', JSON.stringify(users));
    localStorage.removeItem('dc_reset');
    alert('Your password has been successfully changed.');
    navigate('/login');
  }

  return (
    <div className="container">
      <h2>Reset Password</h2>

      <form onSubmit={verified ? setPassword : verifyOtp} style={{ maxWidth:420, margin:'0 auto' }}>
        <div style={{ textAlign:'left' }}>Mobile Number</div>
        <input className="main-input" value={phone} onChange={e=>setPhone(e.target.value)} />

        {!verified ? (
          <>
            <div style={{ textAlign:'left', marginTop:10 }}>Enter OTP</div>
            <input className="main-input" value={otp} onChange={e=>setOtp(e.target.value)} />
            <div style={{ marginTop:12 }}>
              <button className="main-btn login-btn" type="submit">Verify OTP</button>
              <button type="button" className="main-btn register-btn" style={{ marginLeft:8 }} onClick={()=>navigate('/forgot')}>Resend</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign:'left', marginTop:10 }}>New Password</div>
            <input className="main-input" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} />

            <div style={{ textAlign:'left', marginTop:10 }}>Confirm Password</div>
            <input className="main-input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />

            <div style={{ marginTop:12 }}>
              <button className="main-btn register-btn" type="submit">Confirm</button>
            </div>
          </>
        )}
      </form>

      {message ? <p style={{ marginTop:12, color:'#cfe6ff' }}>{message}</p> : null}
    </div>
  );
}
