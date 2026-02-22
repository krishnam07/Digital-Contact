import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword(){
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function sendOtp(e){
    e.preventDefault();
    if (!phone) return alert('Enter your mobile number');
    const users = JSON.parse(localStorage.getItem('dc_users') || '[]');
    const user = users.find(u=>u.phone===phone);
    if (!user) return alert('Phone number not found');

    const otp = Math.floor(100000 + Math.random()*900000).toString();
    const payload = { phone, otp, expires: Date.now() + 5*60*1000 };
    localStorage.setItem('dc_reset', JSON.stringify(payload));
    // In a real app: send via SMS gateway. Here we show it for demo.
    setMessage('An OTP has been sent to your mobile (demo).');
    // For demo, provide the OTP in the message
    setTimeout(()=>{
      navigate('/reset', { state: { phone } });
    }, 900);
  }

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={sendOtp} style={{ maxWidth:420, margin:'0 auto' }}>
        <div style={{ textAlign:'left' }}>Registered Mobile Number</div>
        <input className="main-input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. +919812345678" />
        <div style={{ marginTop:12 }}>
          <button className="main-btn login-btn" type="submit">Send OTP</button>
          <button type="button" className="main-btn register-btn" style={{ marginLeft:8 }} onClick={()=>navigate('/login')}>Back to Login</button>
        </div>
      </form>
      {message ? <p style={{ marginTop:12, color:'#cfe6ff' }}>{message}</p> : null}
    </div>
  );
}
