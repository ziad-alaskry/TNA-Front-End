import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface UIState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  modalStack: string[];
  pushModal: (modalId: string) => void;
  popModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toasts: [],
  addToast: (message, type) => set((state) => ({
    toasts: [...state.toasts, { id: Math.random().toString(36).substr(2, 9), message, type }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
  modalStack: [],
  pushModal: (modalId) => set((state) => ({ modalStack: [...state.modalStack, modalId] })),
  popModal: () => set((state) => ({ modalStack: state.modalStack.slice(0, -1) })),
}));
