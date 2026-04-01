import type { ModalOptions, ModalResult } from "../types";
import { injectStyles } from "../styles/inject";
import { icons } from "./icons";
import { resolveTheme, createElement } from "./utils";
import { getConfig } from "./toast";

// ─── Defaults ──────────────────────────────────────────────────

const VARIANT_DEFAULTS: Record<string, Partial<ModalOptions>> = {
  confirm: {
    title: "Are you sure?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    overlayClose: false,
  },
  alert: { title: "Notice", confirmText: "OK", overlayClose: true },
  success: { title: "Success!", confirmText: "OK", overlayClose: true },
};

// ─── Public API ────────────────────────────────────────────────

export function modal(opts: ModalOptions): Promise<ModalResult> {
  injectStyles();

  const variant = opts.variant ?? "alert";
  const globalTheme = getConfig().theme;
  const merged = {
    ...VARIANT_DEFAULTS[variant],
    ...stripUndefined(opts),
    variant,
  };
  const theme = resolveTheme(merged.theme ?? globalTheme ?? "light");

  return new Promise<ModalResult>((resolve) => {
    let resolved = false;
    const finish = (confirmed: boolean) => {
      if (resolved) return;
      resolved = true;
      close(confirmed);
    };

    // ── Overlay ──
    const overlay = createElement("div", {
      class: "nui-modal-overlay",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": merged.title || "Dialog",
    });

    if (merged.overlayClose) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) finish(false);
      });
    }

    // ── Card ──
    const card = createElement("div", {
      class: `nui-modal nui-theme-${theme} ${merged.className || ""}`.trim(),
    });

    // Icon
    const iconKey =
      variant === "confirm"
        ? "confirm"
        : variant === "alert"
          ? "alert"
          : "success";
    const iconWrapper = createElement(
      "div",
      { class: `nui-modal-icon nui-variant-${variant}`, "aria-hidden": "true" },
      icons[iconKey],
    );
    card.appendChild(iconWrapper);

    // Title
    if (merged.title) {
      const title = createElement("h2", {
        class: "nui-modal-title",
        id: "nui-modal-title",
      });
      title.textContent = merged.title;
      card.appendChild(title);
      overlay.setAttribute("aria-labelledby", "nui-modal-title");
    }

    // Message
    const msg = createElement("div", {
      class: "nui-modal-message",
      id: "nui-modal-desc",
    });
    if (merged.html) {
      msg.innerHTML = merged.html;
    } else {
      msg.textContent = merged.message ?? "";
    }
    card.appendChild(msg);
    overlay.setAttribute("aria-describedby", "nui-modal-desc");

    // Actions
    const actions = createElement("div", { class: "nui-modal-actions" });

    if (variant === "confirm" && merged.cancelText) {
      const cancelBtn = createElement("button", {
        class: "nui-modal-btn nui-modal-btn-cancel",
        type: "button",
      });
      cancelBtn.textContent = merged.cancelText;
      cancelBtn.addEventListener("click", () => finish(false));
      actions.appendChild(cancelBtn);
    }

    const confirmBtn = createElement("button", {
      class: "nui-modal-btn nui-modal-btn-confirm",
      type: "button",
    });
    confirmBtn.textContent = merged.confirmText || "OK";
    confirmBtn.addEventListener("click", () => finish(true));
    actions.appendChild(confirmBtn);

    card.appendChild(actions);
    overlay.appendChild(card);

    // ── Mount ──
    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add("nui-modal-visible");
    });

    // Focus the confirm button
    confirmBtn.focus();

    // ── Keyboard ──
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish(false);
      // Simple focus trap
      if (e.key === "Tab") {
        const focusable =
          card.querySelectorAll<HTMLElement>("button, [tabindex]");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    // ── Close ──
    function close(confirmed: boolean) {
      document.removeEventListener("keydown", onKey);
      overlay.classList.remove("nui-modal-visible");

      const onEnd = () => {
        overlay.removeEventListener("transitionend", onEnd);
        overlay.remove();
        resolve({ confirmed });
      };
      overlay.addEventListener("transitionend", onEnd);
      setTimeout(onEnd, 400); // fallback
    }
  });
}

/** Shortcut: confirmation dialog returning a boolean */
export function confirm(
  opts: Omit<ModalOptions, "variant"> & { variant?: "confirm" },
): Promise<boolean> {
  return modal({ ...opts, variant: "confirm" }).then((r) => r.confirmed);
}

/** Shortcut: success dialog */
export function alertSuccess(
  message: string,
  opts?: Partial<ModalOptions>,
): Promise<ModalResult> {
  return modal({ ...opts, message, variant: "success" });
}

/** Shortcut: warning/alert dialog */
export function alert(
  message: string,
  opts?: Partial<ModalOptions>,
): Promise<ModalResult> {
  return modal({ ...opts, message, variant: "alert" });
}

// ─── Helpers ───────────────────────────────────────────────────

function stripUndefined<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const k of Object.keys(obj) as Array<keyof T>) {
    if (obj[k] !== undefined) result[k] = obj[k];
  }
  return result;
}
