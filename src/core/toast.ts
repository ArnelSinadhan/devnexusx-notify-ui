import type {
  ToastOptions,
  ToastInstance,
  ToastPosition,
  NotifyConfig,
  ResolvedToastOptions,
} from "../types";
import { injectStyles } from "../styles/inject";
import { icons } from "./icons";
import { uid, resolveTheme, createElement } from "./utils";

// ─── Defaults ──────────────────────────────────────────────────

const DEFAULTS: Required<
  Pick<
    ToastOptions,
    | "type"
    | "duration"
    | "position"
    | "animation"
    | "theme"
    | "dismissible"
    | "progressBar"
  >
> = {
  type: "info",
  duration: 4000,
  position: "top-right",
  animation: "slide",
  theme: "light",
  dismissible: true,
  progressBar: true,
};

// ─── State ─────────────────────────────────────────────────────

const containers = new Map<ToastPosition, HTMLElement>();
const activeToasts = new Map<string, ToastInstance>();
const queue: ToastInstance[] = [];
let config: NotifyConfig = {};
let maxVisible = 5;

// ─── Public API ────────────────────────────────────────────────

export function configure(cfg: NotifyConfig): void {
  config = { ...config, ...cfg };
  if (cfg.maxVisible) maxVisible = cfg.maxVisible;
}

/** Expose current config for other modules (e.g. modal) */
export function getConfig(): NotifyConfig {
  return config;
}

export function toast(opts: ToastOptions): string {
  injectStyles();

  const merged = {
    ...DEFAULTS,
    ...stripUndefined({
      position: config.position,
      duration: config.duration,
      animation: config.animation,
      theme: config.theme,
    }),
    ...stripUndefined(opts),
  } as ResolvedToastOptions;

  const instance: ToastInstance = {
    id: uid(),
    options: merged,
    createdAt: Date.now(),
  };

  // Queue logic
  const positionCount = [...activeToasts.values()].filter(
    (t) => t.options.position === merged.position,
  ).length;

  if (positionCount >= maxVisible) {
    queue.push(instance);
    return instance.id;
  }

  renderToast(instance);
  return instance.id;
}

export function dismiss(id: string): void {
  const inst = activeToasts.get(id);
  if (!inst?.element) return;
  exitToast(inst);
}

export function dismissAll(): void {
  for (const inst of activeToasts.values()) {
    if (inst.element) exitToast(inst);
  }
}

// ─── Convenience Shortcuts ─────────────────────────────────────

export const showSuccess = (message: string, opts?: Partial<ToastOptions>) =>
  toast({ ...opts, message, type: "success" });

export const showError = (message: string, opts?: Partial<ToastOptions>) =>
  toast({ ...opts, message, type: "error" });

export const showWarning = (message: string, opts?: Partial<ToastOptions>) =>
  toast({ ...opts, message, type: "warning" });

export const showInfo = (message: string, opts?: Partial<ToastOptions>) =>
  toast({ ...opts, message, type: "info" });

// ─── Rendering ─────────────────────────────────────────────────

function getContainer(position: ToastPosition): HTMLElement {
  let el = containers.get(position);
  if (el && document.body.contains(el)) return el;

  el = createElement("div", {
    class: `nui-toast-container nui-pos-${position}`,
    "aria-live": "polite",
    "aria-relevant": "additions removals",
    role: "log",
  });

  if (config.zIndex) {
    el.style.setProperty("--nui-z", String(config.zIndex));
  }

  document.body.appendChild(el);
  containers.set(position, el);
  return el;
}

function renderToast(inst: ToastInstance): void {
  const { options } = inst;
  const theme = resolveTheme(options.theme);

  // Build DOM
  const el = createElement("div", {
    class: [
      "nui-toast",
      `nui-type-${options.type}`,
      `nui-theme-${theme}`,
      `nui-anim-${options.animation}-enter`,
      options.className || "",
    ]
      .filter(Boolean)
      .join(" "),
    role: "status",
    "aria-atomic": "true",
  });

  // Icon
  if (options.icon !== false) {
    const iconHtml =
      typeof options.icon === "string" ? options.icon : icons[options.type];
    const iconEl = createElement(
      "span",
      { class: "nui-toast-icon", "aria-hidden": "true" },
      iconHtml,
    );
    el.appendChild(iconEl);
  }

  // Body
  const body = createElement("div", { class: "nui-toast-body" });
  if (options.html) {
    body.innerHTML = `<div class="nui-toast-message">${options.html}</div>`;
  } else {
    const msg = createElement("div", { class: "nui-toast-message" });
    msg.textContent = options.message;
    body.appendChild(msg);
  }
  el.appendChild(body);

  // Close button
  if (options.dismissible) {
    const btn = createElement(
      "button",
      {
        class: "nui-toast-close",
        "aria-label": "Dismiss notification",
        type: "button",
      },
      icons.close,
    );
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      exitToast(inst);
    });
    el.appendChild(btn);
  }

  // Progress bar
  if (options.progressBar && options.duration > 0) {
    const bar = createElement("div", { class: "nui-toast-progress" });
    bar.style.width = "100%";
    bar.style.transition = `width ${options.duration}ms linear`;
    el.appendChild(bar);
    // Trigger reflow then animate
    requestAnimationFrame(() => {
      bar.style.width = "0%";
    });
  }

  // Click handler
  if (options.onClick) {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => options.onClick?.(inst.id));
  }

  inst.element = el;
  activeToasts.set(inst.id, inst);

  // Attach to DOM
  const container = getContainer(options.position);
  container.appendChild(el);

  // Animate in
  requestAnimationFrame(() => {
    el.classList.remove(`nui-anim-${options.animation}-enter`);
    el.classList.add(`nui-anim-${options.animation}-active`);
  });

  // Auto dismiss
  if (options.duration > 0) {
    setTimeout(() => exitToast(inst), options.duration);
  }
}

function exitToast(inst: ToastInstance): void {
  const el = inst.element;
  if (!el || !el.parentNode) return;

  const anim = inst.options.animation;
  el.classList.remove(`nui-anim-${anim}-active`);
  el.classList.add(`nui-anim-${anim}-exit`);

  const onEnd = () => {
    el.removeEventListener("transitionend", onEnd);
    el.remove();
    activeToasts.delete(inst.id);
    inst.options.onDismiss?.(inst.id);
    flushQueue(inst.options.position);
  };

  el.addEventListener("transitionend", onEnd);

  // Fallback in case transitionend doesn't fire
  setTimeout(onEnd, 500);
}

function flushQueue(position: ToastPosition): void {
  const positionCount = [...activeToasts.values()].filter(
    (t) => t.options.position === position,
  ).length;

  if (positionCount >= maxVisible) return;

  const idx = queue.findIndex((q) => q.options.position === position);
  if (idx === -1) return;

  const next = queue.splice(idx, 1)[0];
  renderToast(next);
}

// ─── Helpers ───────────────────────────────────────────────────

function stripUndefined<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const k of Object.keys(obj) as Array<keyof T>) {
    if (obj[k] !== undefined) result[k] = obj[k];
  }
  return result;
}
