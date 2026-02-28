import React from 'react';

export function ProfileIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" fill="#ffffff" opacity="0.95"/>
      <path d="M3 20.5c0-3.038 4.03-5.5 9-5.5s9 2.462 9 5.5" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function QRIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="3" y="3" width="6" height="6" fill="#ffffff"/>
      <rect x="15" y="3" width="6" height="6" fill="#ffffff"/>
      <rect x="3" y="15" width="6" height="6" fill="#ffffff"/>
      <rect x="11" y="11" width="2" height="2" fill="#ffffff"/>
      <rect x="14" y="11" width="2" height="2" fill="#ffffff"/>
      <rect x="11" y="14" width="2" height="2" fill="#ffffff"/>
    </svg>
  );
}

export function ScanIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="6" height="6" rx="1" fill="url(#g1)" opacity="0.95"/>
      <rect x="15" y="3" width="6" height="6" rx="1" fill="url(#g1)" opacity="0.95"/>
      <rect x="3" y="15" width="6" height="6" rx="1" fill="url(#g1)" opacity="0.95"/>
      <path d="M10 10h4v4" stroke="#e6f7ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CallIcon(props){
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.01l-2.2 2.2z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default null;
