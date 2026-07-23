export type UserRole = 'admin' | 'member';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'monthly' | 'company' | 'card';
export type InvoiceType = 'none' | 'two-copy' | 'three-copy';
export type MealCategory = 'main' | 'healthy' | 'vegetarian' | 'soup' | 'drink' | 'snack';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  title: string;
  company: string;
  role: UserRole;
  status: 'active' | 'inactive';
}

export interface Department { id: string; name: string; manager: string; memberCount: number; }
export interface DeliveryLocation { id: string; name: string; address: string; floor: string; contact: string; phone: string; isActive: boolean; }
export interface MealOption { id: string; name: string; group: 'rice' | 'flavor' | 'extra'; price: number; }
export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MealCategory;
  image: string;
  isPopular: boolean;
  isFavorite: boolean;
  stock: number;
  ingredients: string[];
  allergens: string[];
  calories: number;
  options: MealOption[];
}

export interface CartItem { id: string; meal: Meal; quantity: number; optionIds: string[]; note: string; unitPrice: number; }
export interface OrderItem { id: string; mealId: string; mealName: string; image: string; quantity: number; options: string[]; unitPrice: number; subtotal: number; }
export interface OrderTimeline { label: string; time?: string; completed: boolean; }
export interface Order {
  id: string;
  orderedAt: string;
  deliveryDate: string;
  deliveryTime: string;
  customerName: string;
  customerPhone: string;
  department: string;
  deliveryLocation: string;
  paymentMethod: PaymentMethod;
  invoiceType: InvoiceType;
  taxId?: string;
  invoiceTitle?: string;
  note: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  timeline: OrderTimeline[];
}

export interface CompanyRule { cutoffTime: string; minimumOrder: number; chargeShipping: boolean; freeShippingThreshold: number; preorderDays: number; allowCancellation: boolean; cancellationCutoff: string; }
export interface DashboardStatistic { label: string; value: number; format: 'number' | 'currency'; trend: number; }
export interface ReportPoint { date: string; amount: number; orders: number; }
export interface ReportData { trend: ReportPoint[]; categories: Array<{ name: string; value: number }>; departments: Array<{ name: string; amount: number }>; statuses: Array<{ name: string; value: number }>; }
export interface PaginatedResponse<T> { data: T[]; page: number; pageSize: number; total: number; totalPages: number; }
export interface CheckoutPayload { customerName: string; customerPhone: string; department: string; deliveryDate: string; deliveryTime: string; deliveryLocation: string; paymentMethod: PaymentMethod; invoiceType: InvoiceType; taxId?: string; invoiceTitle?: string; note: string; }
