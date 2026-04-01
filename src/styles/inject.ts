/**
 * All styles live in a single string that gets injected into <head> once.
 * This avoids requiring consumers to import a CSS file.
 */

export const STYLE_ID = 'notify-ui-styles';

export function injectStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS_TEXT;
  document.head.appendChild(style);
}

const CSS_TEXT = /* css */ `
/* ═══════════════════════════════════════════════════════
   notify-ui — runtime styles
   ═══════════════════════════════════════════════════════ */

/* ─── CSS Variables (light default) ─────────────────── */
:root {
  --nui-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  --nui-radius: 10px;
  --nui-shadow: 0 8px 30px rgba(0,0,0,.12);
  --nui-transition: 320ms cubic-bezier(.4,0,.2,1);
}

/* ─── Toast Container ───────────────────────────────── */
.nui-toast-container {
  position: fixed;
  z-index: var(--nui-z, 9999);
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: min(420px, calc(100vw - 32px));
  padding: 16px;
  box-sizing: border-box;
}
.nui-toast-container * { box-sizing: border-box; }

/* positions */
.nui-pos-top-right    { top:0; right:0; align-items:flex-end; }
.nui-pos-top-left     { top:0; left:0;  align-items:flex-start; }
.nui-pos-top-center   { top:0; left:50%; transform:translateX(-50%); align-items:center; }
.nui-pos-bottom-right { bottom:0; right:0; align-items:flex-end; flex-direction:column-reverse; }
.nui-pos-bottom-left  { bottom:0; left:0;  align-items:flex-start; flex-direction:column-reverse; }
.nui-pos-bottom-center{ bottom:0; left:50%; transform:translateX(-50%); align-items:center; flex-direction:column-reverse; }

/* ─── Toast ─────────────────────────────────────────── */
.nui-toast {
  position: relative;
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  min-width: 300px;
  padding: 14px 16px;
  border-radius: var(--nui-radius);
  font-family: var(--nui-font);
  font-size: 14px;
  line-height: 1.5;
  box-shadow: var(--nui-shadow);
  overflow: hidden;
  cursor: default;
  transition: opacity var(--nui-transition), transform var(--nui-transition);
}

/* light theme */
.nui-toast.nui-theme-light {
  background: #fff;
  color: #1a1a2e;
  border: 1px solid #e8e8ee;
}
/* dark theme */
.nui-toast.nui-theme-dark {
  background: #1e1e2e;
  color: #e4e4ef;
  border: 1px solid #2e2e42;
}

/* type accent — left bar */
.nui-toast::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  border-radius: var(--nui-radius) 0 0 var(--nui-radius);
}
.nui-toast.nui-type-success::before { background: #22c55e; }
.nui-toast.nui-type-error::before   { background: #ef4444; }
.nui-toast.nui-type-warning::before { background: #f59e0b; }
.nui-toast.nui-type-info::before    { background: #3b82f6; }

/* icon */
.nui-toast-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.nui-type-success .nui-toast-icon { color: #22c55e; }
.nui-type-error   .nui-toast-icon { color: #ef4444; }
.nui-type-warning .nui-toast-icon { color: #f59e0b; }
.nui-type-info    .nui-toast-icon { color: #3b82f6; }

/* body */
.nui-toast-body { flex: 1; min-width: 0; }
.nui-toast-message { word-break: break-word; }

/* close button */
.nui-toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: inherit;
  opacity: .45;
  font-size: 18px;
  line-height: 1;
  transition: opacity .15s;
}
.nui-toast-close:hover { opacity: 1; }

/* progress bar */
.nui-toast-progress {
  position: absolute;
  left: 0; bottom: 0;
  height: 3px;
  border-radius: 0 0 var(--nui-radius) var(--nui-radius);
  opacity: .35;
}
.nui-type-success .nui-toast-progress { background: #22c55e; }
.nui-type-error   .nui-toast-progress { background: #ef4444; }
.nui-type-warning .nui-toast-progress { background: #f59e0b; }
.nui-type-info    .nui-toast-progress { background: #3b82f6; }

/* ─── Animations ────────────────────────────────────── */

/* fade */
.nui-anim-fade-enter { opacity: 0; }
.nui-anim-fade-active { opacity: 1; }
.nui-anim-fade-exit { opacity: 0; }

/* slide (from right by default — overridden per position) */
.nui-anim-slide-enter { opacity: 0; transform: translateX(100%); }
.nui-pos-top-left .nui-anim-slide-enter,
.nui-pos-bottom-left .nui-anim-slide-enter { transform: translateX(-100%); }
.nui-pos-top-center .nui-anim-slide-enter,
.nui-pos-bottom-center .nui-anim-slide-enter { transform: translateY(-40px); }
.nui-anim-slide-active { opacity: 1; transform: translateX(0) translateY(0); }
.nui-anim-slide-exit { opacity: 0; transform: translateX(100%); }
.nui-pos-top-left .nui-anim-slide-exit,
.nui-pos-bottom-left .nui-anim-slide-exit { transform: translateX(-100%); }
.nui-pos-top-center .nui-anim-slide-exit,
.nui-pos-bottom-center .nui-anim-slide-exit { transform: translateY(-40px); }

/* bounce */
@keyframes nui-bounce-in {
  0%   { opacity:0; transform: scale(.7); }
  50%  { transform: scale(1.05); }
  70%  { transform: scale(.95); }
  100% { opacity:1; transform: scale(1); }
}
.nui-anim-bounce-enter { animation: nui-bounce-in .45s ease forwards; }
.nui-anim-bounce-exit  { opacity: 0; transform: scale(.7); }

/* ─── Modal Overlay ─────────────────────────────────── */
.nui-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: calc(var(--nui-z, 9999) + 10);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity .25s ease;
  padding: 24px;
}
.nui-modal-overlay.nui-modal-visible { opacity: 1; }

/* ─── Modal Card ────────────────────────────────────── */
.nui-modal {
  position: relative;
  width: 100%;
  max-width: 440px;
  border-radius: calc(var(--nui-radius) + 4px);
  font-family: var(--nui-font);
  padding: 28px 28px 22px;
  box-shadow: 0 24px 60px rgba(0,0,0,.2);
  transform: scale(.92) translateY(10px);
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), opacity .25s ease;
  opacity: 0;
}
.nui-modal-visible .nui-modal { transform: scale(1) translateY(0); opacity: 1; }

.nui-modal.nui-theme-light {
  background: #fff;
  color: #1a1a2e;
  border: 1px solid #e8e8ee;
}
.nui-modal.nui-theme-dark {
  background: #1e1e2e;
  color: #e4e4ef;
  border: 1px solid #2e2e42;
}

.nui-modal-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 24px;
}
.nui-modal-icon.nui-variant-confirm { background: #dbeafe; color: #3b82f6; }
.nui-modal-icon.nui-variant-alert   { background: #fef3c7; color: #f59e0b; }
.nui-modal-icon.nui-variant-success { background: #dcfce7; color: #22c55e; }
.nui-theme-dark .nui-modal-icon.nui-variant-confirm { background: #1e3a5f; }
.nui-theme-dark .nui-modal-icon.nui-variant-alert   { background: #422006; }
.nui-theme-dark .nui-modal-icon.nui-variant-success { background: #052e16; }

.nui-modal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  text-align: center;
}
.nui-modal-message {
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  margin: 0 0 24px;
  opacity: .8;
}
.nui-modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.nui-modal-btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-family: var(--nui-font);
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background .15s, transform .1s;
  outline: none;
}
.nui-modal-btn:active { transform: scale(.97); }
.nui-modal-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(59,130,246,.5);
}
.nui-modal-btn-confirm {
  background: #3b82f6;
  color: #fff;
}
.nui-modal-btn-confirm:hover { background: #2563eb; }
.nui-modal-btn-cancel {
  background: transparent;
  border: 1px solid #d1d5db;
  color: inherit;
}
.nui-theme-dark .nui-modal-btn-cancel { border-color: #3f3f5c; }
.nui-modal-btn-cancel:hover { background: rgba(0,0,0,.05); }
.nui-theme-dark .nui-modal-btn-cancel:hover { background: rgba(255,255,255,.05); }

/* Screen reader only */
.nui-sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
`;
