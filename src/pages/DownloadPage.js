import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StickerPreview from '../components/StickerPreview';
import eagleLogoPath from '../assets/kd.png';

export default function DownloadPage(){
  const { state } = useLocation();
  const navigate = useNavigate();
  const uuid = state?.uuid || 'demo-uuid-123';

  const [vehicle, setVehicle] = useState('');
  const [size, setSize] = useState('');
  const [tagOption, setTagOption] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);

  const sizeMap = { Small:120, Medium:200, Large:300, 'Extra Large':420 };

  function confirm() {
    const needCustom = tagOption === 'Custom';
    if(!vehicle || !size || !tagOption || (needCustom && !customTag)) return;
    setProcessing(true);
    setReady(false);
    setTimeout(()=>{
      setProcessing(false);
      setReady(true);
    }, 1200);
  }

  async function exportComposite(format = 'png'){
    const qrCanvas = document.getElementById('download-qr');
    if(!qrCanvas){ alert('QR canvas not found'); return; }

    const tagline = tagOption === 'Custom' ? customTag : tagOption || '';

    // build final canvas with padding and tagline
    const padding = 24;
    const qrW = qrCanvas.width || qrCanvas.offsetWidth || 200;
    const qrH = qrCanvas.height || qrCanvas.offsetHeight || qrW;
    const taglineHeight = tagline ? 48 : 24;
    const finalW = qrW + padding * 2;
    const finalH = qrH + padding * 2 + taglineHeight;

    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = finalW;
    finalCanvas.height = finalH;
    const ctx = finalCanvas.getContext('2d');

    // background gradient
    const g = ctx.createLinearGradient(0,0,finalW,finalH);
    g.addColorStop(0,'#071126'); g.addColorStop(1,'#0b3a5a');
    ctx.fillStyle = g; ctx.fillRect(0,0,finalW,finalH);

    // subtle card
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    const r = 14;
    function roundRect(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
    roundRect(6,6, finalW-12, finalH-12, r); ctx.fill();

    // draw qr image
    const img = new Image(); img.crossOrigin = 'anonymous'; img.src = qrCanvas.toDataURL('image/png');
    await new Promise(res => { img.onload = res; img.onerror = res; });
    const imgX = (finalW - img.width)/2;
    const imgY = padding;
    ctx.drawImage(img, imgX, imgY);

   // small logo centered over QR
    const logoSize = Math.min(48, Math.round(img.width * 0.18));
    const logoX = finalW/2 - logoSize/2;
    const logoY = imgY + img.height/2 - logoSize/2;
    
    // Load and draw eagle logo
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = eagleLogoPath;
    await new Promise(res => { logoImg.onload = res; logoImg.onerror = res; });
    
    // Draw semi-transparent background for logo
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);
    
    // Draw the eagle logo
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

    // tagline
    if(tagline){
      ctx.fillStyle = '#e6eef8'; ctx.font = '18px Poppins, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(tagline, finalW/2, imgY + img.height + 28);
    }

    const safeLabel = (tagline || 'digital-contact').replace(/\s+/g,'-').replace(/[^a-zA-Z0-9-_]/g,'').toLowerCase();
    const filename = `dc-${vehicle || 'item'}-${safeLabel}.png`;

    if(format === 'png'){
      const url = finalCanvas.toDataURL('image/png');
      const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      return;
    }

    // PDF export using jsPDF loaded from CDN
    if(format === 'pdf'){
      if(!window.jspdf){
        await new Promise((res, rej)=>{
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          s.onload = res; s.onerror = rej; document.head.appendChild(s);
        }).catch(()=>{});
      }
      try{
        const { jsPDF } = window.jspdf || window.jspdf; // UMD exposes window.jspdf.jsPDF
        const pdf = new jsPDF({ unit: 'px', format: [finalW, finalH] });
        pdf.addImage(finalCanvas.toDataURL('image/png'), 'PNG', 0, 0, finalW, finalH);
        pdf.save(filename.replace('.png','.pdf'));
      }catch(e){
        // fallback: download PNG
        const url = finalCanvas.toDataURL('image/png');
        const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      }
    }
  }

  return (
    <div className="container">
      <div style={{maxWidth:720, margin:'18px auto'}}>
        <h2>Customize your QR</h2>

        <div className="download-controls" style={{marginTop:12}}>
          <div className="download-control">
            <div className="label">QR type</div>
            <select value={vehicle} onChange={e=>{ setVehicle(e.target.value); setSize(''); setTagOption(''); setCustomTag(''); }}>
              <option value="">Select QR type</option>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="Scooter">Scooter</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {vehicle && (
            <div className="download-control">
              <div className="label">Dimensions</div>
              <select value={size} onChange={e=>{ setSize(e.target.value); setTagOption(''); setCustomTag(''); }}>
                <option value="">Select dimensions</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </div>
          )}

          {size && (
            <div className="download-control">
              <div className="label">Add something interesting</div>
              <select value={tagOption} onChange={e=>{ setTagOption(e.target.value); if(e.target.value !== 'Custom') setCustomTag(''); }}>
                <option value="">Select an option</option>
                <option value="Scan to connect">Scan to connect</option>
                <option value="Lost? Parked Wrong? Scan Me">Lost? Parked Wrong? Scan Me</option>
                <option value="Contact me">Contact me</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          )}

          {tagOption === 'Custom' && (
            <div className="download-control">
              <div className="label">Your custom tagline</div>
              <input value={customTag} onChange={e=>setCustomTag(e.target.value)} placeholder="Enter your tagline" />
            </div>
          )}
        </div>

        <div className="download-cta" style={{marginTop:18}}>
          <button className="main-btn" onClick={confirm} disabled={processing}>Confirm</button>
          <button className="ghost-btn" onClick={()=>navigate(-1)}>Cancel</button>
        </div>

        <div style={{marginTop:24}}>
          {processing && <div className="muted">Preparing your branded QR…</div>}

          {ready && (
            <div style={{textAlign:'center'}}>
              <div style={{display:'inline-block', padding:12, borderRadius:12, background:'rgba(255,255,255,0.02)'}}>
                <StickerPreview uuid={uuid} minimal={true} size={sizeMap[size]} id="download-qr" />
              </div>
              <div style={{marginTop:12}} className="muted">{tagOption === 'Custom' ? customTag : tagOption}</div>
              <div className="download-actions">
                <button className="pdf-btn" onClick={()=>exportComposite('png')}>Download PNG</button>
                <button className="pdf-btn" onClick={()=>exportComposite('pdf')}>Download PDF</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
