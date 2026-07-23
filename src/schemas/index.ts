import { z } from 'zod';
import { todayIso } from '../utils/format';

export const loginSchema = z.object({ account: z.string().min(1, '請輸入帳號'), password: z.string().min(6, '密碼至少需要 6 個字元'), remember: z.boolean() });
export type LoginForm = z.infer<typeof loginSchema>;

export const mealDetailSchema = z.object({ quantity: z.coerce.number().int().min(1, '數量至少為 1'), optionIds: z.array(z.string()), note: z.string().max(100, '備註最多 100 個字元') });
export type MealDetailForm = z.infer<typeof mealDetailSchema>;

export const checkoutSchema = z.object({
  customerName: z.string().min(2, '請輸入訂購人姓名'), customerPhone: z.string().regex(/^09\d{2}-?\d{3}-?\d{3}$/, '請輸入正確的台灣手機號碼'),
  department: z.string().min(1, '請選擇公司或部門'), deliveryDate: z.string().min(1, '請選擇送餐日期').refine((value) => value >= todayIso(), '送餐日期不得早於今天'),
  deliveryTime: z.string().min(1, '請選擇送餐時段'), deliveryLocation: z.string().min(1, '請選擇送餐地點'),
  paymentMethod: z.enum(['cash', 'monthly', 'company', 'card']), invoiceType: z.enum(['none', 'two-copy', 'three-copy']),
  taxId: z.string().optional(), invoiceTitle: z.string().optional(), note: z.string().max(200, '備註最多 200 個字元'),
}).superRefine((values, context) => {
  if (values.invoiceType === 'three-copy') {
    if (!/^\d{8}$/.test(values.taxId ?? '')) context.addIssue({ code: 'custom', path: ['taxId'], message: '請輸入 8 位數公司統編' });
    if (!values.invoiceTitle?.trim()) context.addIssue({ code: 'custom', path: ['invoiceTitle'], message: '請輸入發票抬頭' });
  }
});
export type CheckoutForm = z.infer<typeof checkoutSchema>;

export const employeeSchema = z.object({ name: z.string().min(2, '請輸入姓名'), email: z.string().email('Email 格式不正確'), phone: z.string().regex(/^09\d{2}-?\d{3}-?\d{3}$/, '手機格式不正確'), departmentId: z.string().min(1, '請選擇部門'), title: z.string().min(1, '請輸入職稱'), role: z.enum(['admin', 'member']) });
export type EmployeeForm = z.infer<typeof employeeSchema>;

export const profileSchema = z.object({ name: z.string().min(2, '請輸入姓名'), email: z.string().email('Email 格式不正確'), phone: z.string().regex(/^09\d{2}-?\d{3}-?\d{3}$/, '手機格式不正確') });
export type ProfileForm = z.infer<typeof profileSchema>;

export const passwordSchema = z.object({ currentPassword: z.string().min(1, '請輸入目前密碼'), newPassword: z.string().min(8, '新密碼至少需要 8 個字元'), confirmPassword: z.string().min(1, '請再次輸入新密碼') }).refine((values) => values.newPassword === values.confirmPassword, { path: ['confirmPassword'], message: '兩次密碼不一致' });
export type PasswordForm = z.infer<typeof passwordSchema>;
