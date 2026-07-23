import type { InvoiceType, MealCategory, OrderStatus, PaymentMethod } from '../types';

export const formatCurrency = (value: number) => `NT$${new Intl.NumberFormat('zh-TW').format(value)}`;
export const formatDate = (value: string) => value.replaceAll('-', '/').slice(0, 10);
export const categoryLabels: Record<MealCategory, string> = { main: '主食便當', healthy: '健康餐盒', vegetarian: '素食便當', soup: '湯品', drink: '飲品', snack: '點心' };
export const statusLabels: Record<OrderStatus, string> = { pending: '待確認', processing: '處理中', completed: '已完成', cancelled: '已取消' };
export const paymentLabels: Record<PaymentMethod, string> = { cash: '現金', monthly: '月結', company: '公司統一付款', card: '信用卡' };
export const invoiceLabels: Record<InvoiceType, string> = { none: '不需要', 'two-copy': '二聯式', 'three-copy': '三聯式' };
export const todayIso = () => new Date().toISOString().slice(0, 10);
