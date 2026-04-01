import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import type { ToastOptions, ModalOptions, NotifyConfig } from "../types";
import {
  toast,
  configure,
  dismiss,
  dismissAll,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} from "../core/toast";
import { modal, confirm, alert, alertSuccess } from "../core/modal";

// ─── Context Shape ─────────────────────────────────────────────

export interface NotifyAPI {
  toast: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  showSuccess: (msg: string, opts?: Partial<ToastOptions>) => string;
  showError: (msg: string, opts?: Partial<ToastOptions>) => string;
  showWarning: (msg: string, opts?: Partial<ToastOptions>) => string;
  showInfo: (msg: string, opts?: Partial<ToastOptions>) => string;
  modal: (opts: ModalOptions) => Promise<{ confirmed: boolean }>;
  confirm: (opts: Omit<ModalOptions, "variant">) => Promise<boolean>;
  alert: (
    msg: string,
    opts?: Partial<ModalOptions>,
  ) => Promise<{ confirmed: boolean }>;
  alertSuccess: (
    msg: string,
    opts?: Partial<ModalOptions>,
  ) => Promise<{ confirmed: boolean }>;
}

const NotifyContext = createContext<NotifyAPI | null>(null);

// ─── Provider ──────────────────────────────────────────────────

export interface NotifyProviderProps {
  children: ReactNode;
  config?: NotifyConfig;
}

export function NotifyProvider({ children, config: cfg }: NotifyProviderProps) {
  if (cfg) configure(cfg);

  useEffect(() => {
    if (cfg) configure(cfg);
  }, [cfg]);

  const api: NotifyAPI = useMemo(
    () => ({
      toast,
      dismiss,
      dismissAll,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      modal,
      confirm,
      alert,
      alertSuccess,
    }),
    [],
  );

  return (
    <NotifyContext.Provider value={api}>{children}</NotifyContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────

export function useNotify(): NotifyAPI {
  const ctx = useContext(NotifyContext);
  if (!ctx) {
    throw new Error(
      "[notify-ui] useNotify() must be used inside <NotifyProvider>. " +
        "Wrap your app with <NotifyProvider> first.",
    );
  }
  return ctx;
}

// ─── Standalone Hook (no provider needed) ──────────────────────

export function useNotifyStandalone(cfg?: NotifyConfig): NotifyAPI {
  useEffect(() => {
    if (cfg) configure(cfg);
  }, [cfg]);

  return useMemo(
    () => ({
      toast,
      dismiss,
      dismissAll,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      modal,
      confirm,
      alert,
      alertSuccess,
    }),
    [],
  );
}
