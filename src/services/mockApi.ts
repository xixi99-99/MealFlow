import { departments, locations, meals, orders, reportData, users } from '../mocks/data';
import type { DeliveryLocation, Department, Meal, Order, PaginatedResponse, ReportData, User } from '../types';

const delay = (milliseconds = 260) => new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
const clone = <T,>(value: T): T => structuredClone(value);

export const mockApi = {
  async getMeals(): Promise<Meal[]> { await delay(); return clone(meals); },
  async getOrders(page = 1, pageSize = 5): Promise<PaginatedResponse<Order>> { await delay(); const start = (page - 1) * pageSize; return { data: clone(orders.slice(start, start + pageSize)), page, pageSize, total: orders.length, totalPages: Math.ceil(orders.length / pageSize) }; },
  async getOrder(id: string): Promise<Order | undefined> { await delay(180); return clone(orders.find((order) => order.id === id)); },
  async getUsers(): Promise<User[]> { await delay(); return clone(users); },
  async getDepartments(): Promise<Department[]> { await delay(); return clone(departments); },
  async getLocations(): Promise<DeliveryLocation[]> { await delay(); return clone(locations); },
  async getReports(): Promise<ReportData> { await delay(); return clone(reportData); },
};
