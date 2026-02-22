import CircleCard from "../components/CircleCard";
import { ProfileIcon, QRIcon, ScanIcon } from "../components/Icon";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">

      <section className="hero">
        <h1>Create and share your QR instantly</h1>
        <p>Design beautiful stickers, generate QR codes, and scan on the go — all in one place.</p>

        <div>
          <button className="main-btn register-btn" onClick={() => navigate("/register")}>
            Get Started
          </button>

          <button className="main-btn login-btn" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </section>

      <div className="circle-container fade-in" style={{ marginTop: 28 }}>
        <CircleCard icon={<ProfileIcon />} label="Profile" onClick={() => navigate("/profile")} />
        <CircleCard icon={<QRIcon />} label="Your QR Code" onClick={() => navigate("/qr")} />
      </div>

      <button className="main-btn scan-btn" onClick={() => navigate("/scanner")}> 
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <ScanIcon />
          <span>Scan</span>
        </span>
      </button>

      <div className="mission-blurb fade-in">
        <div className="lead">Instant connections when it matters.</div>
        <div className="intro">Digital Contact helps you create powerful QR codes that let people connect with you in real-life moments — wrong parking alerts, lost items, or emergency situations.</div>

        <ul className="mission-list">
          <li><div className="marker" aria-hidden></div><div><div className="bullet-text">Wrong parking</div><div className="small">Notify the owner quickly & politely</div></div></li>
          <li><div className="marker" aria-hidden></div><div><div className="bullet-text">Lost items</div><div className="small">Scan and help get items returned</div></div></li>
          <li><div className="marker" aria-hidden></div><div><div className="bullet-text">Emergency</div><div className="small">Instantly alert emergency contacts</div></div></li>
          <li><div className="marker" aria-hidden></div><div><div className="bullet-text">Safe & private</div><div className="small">Masks numbers and only allows contact through the app</div></div></li>
        </ul>

        <div className="mission-cta">One scan. One notification. One chance to help.</div>
        <div className="tagline">With just one scan, anyone can notify you quickly and safely. We believe technology should not only connect devices — but connect people. Stay connected. Stay responsible. Keep humanity alive.</div>
      </div>

      <div className="callout fade-in" aria-hidden={false}>
        <div className="icon-plate" aria-hidden>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 2a5 5 0 00-5 5v1H6a4 4 0 00-4 4v2a4 4 0 004 4h12a4 4 0 004-4v-2a4 4 0 00-4-4h-1V7a5 5 0 00-5-5z" fill="#fff" opacity="0.95"/>
          </svg>
        </div>

        <div className="content">
          <div className="title">Technology should solve real problems.</div>
          <div className="subtitle">Digital Contact is built to promote responsibility, quick response, and human kindness in everyday life.</div>
          <div className="quote">Because sometimes…</div>
          <div className="emphasis">One scan is all it takes to help someone.</div>
        </div>
      </div>
    </div>
  );
}
