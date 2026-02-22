import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  function goHome() {
    navigate('/');
  }

  function onKey(e) {
    if (e.key === 'Enter' || e.key === ' ') goHome();
  }

  return (
    <header className="brand" role="banner">
      <div
        className="brand-clickable"
        role="button"
        tabIndex={0}
        onClick={goHome}
        onKeyDown={onKey}
        aria-label="Go to Digital Contact home"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
      >
        <div className="logo" aria-hidden>DC</div>
        <div>
          <div className="title">Digital Contact</div>
          <div className="subtitle">Scan. Connect. Done.</div>
        </div>
      </div>
    </header>
  );
}
