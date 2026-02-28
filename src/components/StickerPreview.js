import { QRCodeCanvas } from "qrcode.react";
import logoImg from "../assets/kd.png";

export default function StickerPreview({ uuid, minimal = false, size = 160, id, onClick }) {
  return (
    <div className={`sticker-preview ${minimal ? 'sticker-minimal' : ''}`}>
      {!minimal && (
        <>
          <h3>SCAN. CONNECT. DONE.</h3>
          <p>Lost? Parked Wrong? Scan Me</p>
        </>
      )}

    <div className="qr-wrap" style={{ position: 'relative', display: 'inline-block', ...(onClick && { cursor: 'pointer' }) }} onClick={onClick}>
        <QRCodeCanvas id={id} value={JSON.stringify({ uuid })} size={size} />
        <img src={logoImg} alt="Logo" className="qr-logo" aria-hidden />
      </div>

      {!minimal && <p style={{ marginTop: "10px" }}>Company Name</p>}
    </div>
  );
}
