import { create } from 'zustand';

type ToastTone = 'neutral' | 'success' | 'error';

interface ToastInput {
  description?: string;
  durationMs?: number;
  title: string;
  tone?: ToastTone;
}

interface ToastItem extends Required<Omit<ToastInput, 'durationMs'>> {
  durationMs: number;
  id: string;
}

interface ModalPayload {
  cancelLabel?: string;
  confirmLabel?: string;
  description?: string;
  onCancel?: (() => void) | null;
  onConfirm?: (() => void) | null;
  title: string;
}

interface ModalState extends ModalPayload {
  visible: boolean;
}

interface UiState {
  confirmModal: () => void;
  dismissModal: () => void;
  dismissToast: (id: string) => void;
  modal: ModalState;
  openModal: (payload: ModalPayload) => void;
  showToast: (input: ToastInput) => string;
  toasts: ToastItem[];
}

const initialModalState: ModalState = {
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  description: undefined,
  onCancel: null,
  onConfirm: null,
  title: '',
  visible: false,
};

function createToastId() {
  return `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useUiStore = create<UiState>((set, get) => ({
  confirmModal: () => {
    const current = get().modal;
    current.onConfirm?.();
    set({ modal: initialModalState });
  },
  dismissModal: () => {
    const current = get().modal;
    current.onCancel?.();
    set({ modal: initialModalState });
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  modal: initialModalState,
  openModal: (payload) =>
    set({
      modal: {
        cancelLabel: payload.cancelLabel ?? 'Cancel',
        confirmLabel: payload.confirmLabel ?? 'Confirm',
        description: payload.description,
        onCancel: payload.onCancel ?? null,
        onConfirm: payload.onConfirm ?? null,
        title: payload.title,
        visible: true,
      },
    }),
  showToast: (input) => {
    const toast: ToastItem = {
      description: input.description ?? '',
      durationMs: input.durationMs ?? 3500,
      id: createToastId(),
      title: input.title,
      tone: input.tone ?? 'neutral',
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    setTimeout(() => {
      get().dismissToast(toast.id);
    }, toast.durationMs);

    return toast.id;
  },
  toasts: [],
}));
