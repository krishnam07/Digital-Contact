import StickerPreview from "../components/StickerPreview";
import { useNavigate } from 'react-router-dom';

export default function QRPage() {
  const uuid = "demo-uuid-123";
  const navigate = useNavigate();

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <h2 style={{ margin: 0 }}>Your Digital Contact</h2>
        <div className="qr-shield" title="Verified identity" aria-hidden>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l6 2v5c0 5-3.5 9-6 11-2.5-2-6-6-6-11V4l6-2z" fill="#3B82F6"/>
            <path d="M10 12l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
        <div className="qr-window">
          <StickerPreview uuid={uuid} minimal={true} />
        </div>
      </div>

      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
        <button className="main-btn register-btn" onClick={() => navigate('/download', { state: { uuid } })}>Download QR</button>
      </div>
    </div>
  );
}
