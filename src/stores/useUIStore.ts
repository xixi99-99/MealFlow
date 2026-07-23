import { create } from 'zustand';

type ToastType = 'success' | 'warning' | 'error';
interface ToastMessage { id: number; message: string; type: ToastType; }
interface UIState {
  isSidebarOpen: boolean;
  isCartOpen: boolean;
  isUserMenuOpen: boolean;
  toast: ToastMessage | null;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  toggleUserMenu: () => void;
  closeAllOverlays: () => void;
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false, isCartOpen: false, isUserMenuOpen: false, toast: null,
  openSidebar: () => set({ isSidebarOpen: true }), closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openCart: () => set({ isCartOpen: true }), closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleUserMenu: () => set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
  closeAllOverlays: () => set({ isSidebarOpen: false, isCartOpen: false, isUserMenuOpen: false }),
  showToast: (message, type = 'success') => set({ toast: { id: Date.now(), message, type } }),
  hideToast: () => set({ toast: null }),
}));
