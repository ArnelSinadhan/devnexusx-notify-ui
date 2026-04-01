// ─── Toast Types ───────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastPosition =
  | "top-right"
  | "top-left"
  | "top-center"
  | "bottom-right"
  | "bottom-left"
  | "bottom-center";

export type ToastAnimation = "fade" | "slide" | "bounce";

export type Theme = "light" | "dark" | "auto";

export interface ToastOptions {
  /** Message to display */
  message: string;
  /** Notification type — drives icon + color */
  type?: ToastType;
  /** Auto-dismiss duration in ms. 0 = sticky. Default: 4000 */
  duration?: number;
  /** Screen position. Default: 'top-right' */
  position?: ToastPosition;
  /** Entry/exit animation. Default: 'slide' */
  animation?: ToastAnimation;
  /** Light or dark chrome. Default: 'light' */
  theme?: Theme;
  /** Render custom HTML string inside the toast body */
  html?: string;
  /** Called when the toast is dismissed */
  onDismiss?: (id: string) => void;
  /** Called when the toast is clicked */
  onClick?: (id: string) => void;
  /** Extra CSS class names */
  className?: string;
  /** Whether the toast can be dismissed by clicking. Default: true */
  dismissible?: boolean;
  /** Show a progress bar for auto-dismiss. Default: true */
  progressBar?: boolean;
  /** Custom icon: HTML string, emoji string, or false to hide. Default: built-in SVG per type */
  icon?: string | false;
}

export interface ResolvedToastOptions extends Required<
  Pick<
    ToastOptions,
    | "message"
    | "type"
    | "duration"
    | "position"
    | "animation"
    | "theme"
    | "dismissible"
    | "progressBar"
  >
> {
  html?: string;
  onDismiss?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
  icon?: string | false;
}

export interface ToastInstance {
  id: string;
  options: ResolvedToastOptions;
  createdAt: number;
  element?: HTMLElement;
}

// ─── Modal Types ───────────────────────────────────────────────

export type ModalVariant = "confirm" | "alert" | "success";

export interface ModalOptions {
  /** Modal heading */
  title?: string;
  /** Body text or HTML */
  message: string;
  /** Variant drives default icon + button layout */
  variant?: ModalVariant;
  /** Confirm button label. Default: 'OK' */
  confirmText?: string;
  /** Cancel button label (confirm variant only). Default: 'Cancel' */
  cancelText?: string;
  /** Theme override */
  theme?: Theme;
  /** Allow closing via overlay click. Default: true for alert, false for confirm */
  overlayClose?: boolean;
  /** Extra CSS class */
  className?: string;
  /** Render custom HTML inside the modal body */
  html?: string;
  /** Custom icon: HTML string, emoji string, or false to hide. Default: built-in SVG per variant */
  icon?: string | false;
}

export interface ModalResult {
  confirmed: boolean;
}

// ─── Global Config ─────────────────────────────────────────────

export interface NotifyConfig {
  /** Default toast position */
  position?: ToastPosition;
  /** Default duration in ms */
  duration?: number;
  /** Default animation */
  animation?: ToastAnimation;
  /** Default theme */
  theme?: Theme;
  /** Maximum visible toasts before queueing. Default: 5 */
  maxVisible?: number;
  /** Z-index base. Default: 9999 */
  zIndex?: number;
}
