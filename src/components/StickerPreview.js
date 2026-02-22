import { QRCodeCanvas } from "qrcode.react";

export default function StickerPreview({ uuid, minimal = false, size = 160, id }) {
  return (
    <div className={`sticker-preview ${minimal ? 'sticker-minimal' : ''}`}>
      {!minimal && (
        <>
          <h3>SCAN. CONNECT. DONE.</h3>
          <p>Lost? Parked Wrong? Scan Me</p>
        </>
      )}

      <div className="qr-wrap" style={{ position: 'relative', display: 'inline-block' }}>
        <QRCodeCanvas id={id} value={JSON.stringify({ uuid })} size={size} />
        <div className="qr-logo" aria-hidden>DC</div>
      </div>

      {!minimal && <p style={{ marginTop: "10px" }}>Company Name</p>}
    </div>
  );
}
