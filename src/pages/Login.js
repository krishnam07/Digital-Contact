import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("dc_users") || "[]");
    const user = users.find(u => u.phone === phone);
    if (!user) return alert("User not found");
    const bcrypt = await import("bcryptjs");
    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) return alert("Invalid credentials");
    localStorage.setItem("dc_current", user.id);
    alert("Logged in");
    navigate('/profile');
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ textAlign: "left" }}>Contact Number</div>
        <input value={phone} onChange={e=>setPhone(e.target.value)} className="main-input" />

        <div style={{ textAlign: "left", marginTop: 12 }}>Password</div>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="main-input" />

        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="main-btn login-btn" type="submit">Login</button>
          <button type="button" className="main-btn register-btn" style={{ marginLeft: 8 }} onClick={()=>navigate('/register')}>Register</button>
          <button type="button" className="main-btn" style={{ marginLeft: 8, background: 'transparent', color: '#cfe6ff', boxShadow: 'none' }} onClick={()=>navigate('/forgot')}>Forgot password?</button>
        </div>
      </form>
    </div>
  );
}
