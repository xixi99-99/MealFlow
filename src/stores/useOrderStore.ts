import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { meals, orders as mockOrders } from '../mocks/data';
import type { CheckoutPayload, Order } from '../types';
import { useCartStore } from './useCartStore';

interface ReorderResult { added: number; unavailable: string[]; }
interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (payload: CheckoutPayload) => Promise<Order>;
  cancelOrder: (id: string) => boolean;
  reorder: (id: string) => ReorderResult;
  setCurrentOrder: (order: Order | null) => void;
}

const createTimeline = () => ['訂單已建立', '店家已確認', '餐點準備中', '配送中', '已完成'].map((label, index) => ({ label, completed: index === 0, time: index === 0 ? new Date().toLocaleString('zh-TW', { hour12: false }) : undefined }));

export const useOrderStore = create<OrderState>()(persist((set, get) => ({
  orders: mockOrders,
  currentOrder: null,
  createOrder: async (payload) => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 750));
    const cart = useCartStore.getState();
    const order: Order = {
      id: `MF${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}`, orderedAt: new Date().toISOString(), deliveryDate: payload.deliveryDate,
      deliveryTime: payload.deliveryTime, customerName: payload.customerName, customerPhone: payload.customerPhone, department: payload.department,
      deliveryLocation: payload.deliveryLocation, paymentMethod: payload.paymentMethod, invoiceType: payload.invoiceType, taxId: payload.taxId,
      invoiceTitle: payload.invoiceTitle, note: payload.note, status: 'pending', subtotal: cart.subtotal, shippingFee: cart.shippingFee,
      discount: cart.discount, total: cart.total, timeline: createTimeline(),
      items: cart.items.map((item) => ({ id: item.id, mealId: item.meal.id, mealName: item.meal.name, image: item.meal.image, quantity: item.quantity,
        options: item.meal.options.filter((option) => item.optionIds.includes(option.id)).map((option) => option.name), unitPrice: item.unitPrice, subtotal: item.unitPrice * item.quantity })),
    };
    set((state) => ({ orders: [order, ...state.orders], currentOrder: order }));
    cart.clearCart();
    return order;
  },
  cancelOrder: (id) => {
    const target = get().orders.find((order) => order.id === id);
    if (!target || target.status !== 'pending') return false;
    set((state) => ({ orders: state.orders.map((order) => order.id === id ? { ...order, status: 'cancelled' } : order), currentOrder: state.currentOrder?.id === id ? { ...state.currentOrder, status: 'cancelled' } : state.currentOrder }));
    return true;
  },
  reorder: (id) => {
    const order = get().orders.find((entry) => entry.id === id);
    if (!order) return { added: 0, unavailable: [] };
    const unavailable: string[] = [];
    let added = 0;
    order.items.forEach((item) => {
      const meal = meals.find((entry) => entry.id === item.mealId);
      if (!meal || meal.stock === 0) unavailable.push(item.mealName);
      else { useCartStore.getState().addItem(meal, Math.min(item.quantity, meal.stock)); added += 1; }
    });
    return { added, unavailable };
  },
  setCurrentOrder: (currentOrder) => set({ currentOrder }),
}), { name: 'mealflow-orders' }));
