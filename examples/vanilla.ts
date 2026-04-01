// ═══════════════════════════════════════════════════════════════
// notify-ui — Vanilla JavaScript Example
// ═══════════════════════════════════════════════════════════════

import {
  configure,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  toast,
  dismiss,
  dismissAll,
  confirm,
  alert,
  alertSuccess,
} from 'notify-ui';

// ─── 1. Global Configuration (optional) ────────────────────────

configure({
  position: 'top-right',
  duration: 4000,
  animation: 'slide',
  theme: 'light',
  maxVisible: 5,
  zIndex: 9999,
});

// ─── 2. Basic Toasts ──────────────────────────────────────────

showSuccess('Profile saved successfully');
showError('Failed to upload file. Please try again.');
showWarning('Your session expires in 5 minutes');
showInfo('A new version is available');

// ─── 3. Custom Options ───────────────────────────────────────

toast({
  message: 'Custom notification',
  type: 'info',
  duration: 6000,
  position: 'bottom-center',
  animation: 'bounce',
  theme: 'dark',
  progressBar: true,
  onClick: (id) => {
    console.log('Clicked toast:', id);
    dismiss(id);
  },
  onDismiss: (id) => {
    console.log('Toast dismissed:', id);
  },
});

// ─── 4. Custom HTML Content ──────────────────────────────────

toast({
  message: '',
  type: 'success',
  html: `
    <div>
      <strong>Order #1234 shipped!</strong>
      <p style="margin:4px 0 0;opacity:.7;font-size:13px">
        Track your package →
      </p>
    </div>
  `,
  duration: 0, // sticky — user must dismiss
});

// ─── 5. Dismiss Controls ────────────────────────────────────

const toastId = showInfo('Processing your request…', { duration: 0 });

// Later…
dismiss(toastId);

// Or nuke everything
dismissAll();

// ─── 6. Modal — Confirm Dialog ──────────────────────────────

async function handleDelete() {
  const confirmed = await confirm({
    message: 'This will permanently delete your account and all data.',
    title: 'Delete Account?',
    confirmText: 'Delete',
    cancelText: 'Keep Account',
    theme: 'light',
  });

  if (confirmed) {
    showSuccess('Account deleted');
  } else {
    showInfo('Deletion cancelled');
  }
}

// ─── 7. Modal — Alert ───────────────────────────────────────

async function showNotice() {
  await alert('Scheduled maintenance tonight at 11 PM EST.', {
    title: 'Maintenance Window',
  });
  console.log('User acknowledged the alert');
}

// ─── 8. Modal — Success Dialog ──────────────────────────────

async function onPaymentComplete() {
  await alertSuccess('Your payment of $49.99 has been processed.', {
    title: 'Payment Received',
    theme: 'dark',
  });
}

// ─── 9. Dark Theme ──────────────────────────────────────────

showSuccess('Dark mode notification', { theme: 'dark' });
showError('Dark error', { theme: 'dark', position: 'bottom-left' });
