// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
  apiKey: '…',
  authDomain: '…',
  projectId: '…',
  // etc. copy from console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

/**
 * lazy‑create an invisible reCAPTCHA verifier,
 * call before signInWithPhoneNumber().
 */
export function setupRecaptcha(containerId = 'recaptcha-container') {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      containerId,
      { size: 'invisible' },
      auth
    );
  }
  return window.recaptchaVerifier;
}
