import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Meal } from '../types';

interface Totals { subtotal: number; shippingFee: number; discount: number; total: number; totalQuantity: number; }
interface CartState extends Totals {
  items: CartItem[];
  addItem: (meal: Meal, quantity: number, optionIds?: string[], note?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const calculate = (items: CartItem[]): Totals => {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal > 0 && subtotal < 300 ? 30 : 0;
  const discount = subtotal >= 600 ? 50 : 0;
  return { subtotal, shippingFee, discount, total: subtotal + shippingFee - discount, totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0) };
};

const itemKey = (mealId: string, optionIds: string[], note: string) => `${mealId}:${[...optionIds].sort().join(',')}:${note.trim()}`;

export const useCartStore = create<CartState>()(persist((set) => ({
  items: [], subtotal: 0, shippingFee: 0, discount: 0, total: 0, totalQuantity: 0,
  addItem: (meal, quantity, optionIds = [], note = '') => set((state) => {
    if (meal.stock <= 0) return state;
    const key = itemKey(meal.id, optionIds, note);
    const existing = state.items.find((item) => itemKey(item.meal.id, item.optionIds, item.note) === key);
    const optionPrice = meal.options.filter((option) => optionIds.includes(option.id)).reduce((sum, option) => sum + option.price, 0);
    const items = existing
      ? state.items.map((item) => item.id === existing.id ? { ...item, quantity: Math.min(meal.stock, item.quantity + quantity) } : item)
      : [...state.items, { id: `${meal.id}-${Date.now()}`, meal, quantity: Math.min(meal.stock, quantity), optionIds, note, unitPrice: meal.price + optionPrice }];
    return { items, ...calculate(items) };
  }),
  removeItem: (id) => set((state) => { const items = state.items.filter((item) => item.id !== id); return { items, ...calculate(items) }; }),
  updateQuantity: (id, quantity) => set((state) => {
    const items = state.items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.meal.stock, quantity)) } : item);
    return { items, ...calculate(items) };
  }),
  clearCart: () => ({ items: [], ...calculate([]) }),
}), { name: 'mealflow-cart' }));
