import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuthStore } from '../stores/useAuthStore';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { MenuPage } from '../pages/menu/MenuPage';
import { CartPage } from '../pages/cart/CartPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';
import { CheckoutSuccessPage } from '../pages/checkout/CheckoutSuccessPage';
import { OrdersPage } from '../pages/orders/OrdersPage';
import { OrderDetailPage } from '../pages/orders/OrderDetailPage';
import { FavoritesPage } from '../pages/favorites/FavoritesPage';
import { CompanyPage } from '../pages/company/CompanyPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { Button, Card, EmptyState } from '../components/common/ui';

export const ProtectedRoute = () => { const authenticated = useAuthStore((state) => state.isAuthenticated); const location = useLocation(); return authenticated ? <Outlet/> : <Navigate to="/login" replace state={{ from: location.pathname }}/>; };
export const RoleRoute = () => { const user = useAuthStore((state) => state.user); return user?.role === 'admin' ? <Outlet/> : <Navigate to="/" replace/>; };
const NotFoundPage = () => { const navigate = useNavigate(); return <div className="mx-auto max-w-xl"><Card><EmptyState title="找不到這個頁面" description="網址可能已變更，請返回首頁繼續操作。" action={<Button onClick={() => navigate('/')}>返回首頁</Button>}/></Card></div>; };

export const AppRoutes = () => <Routes><Route path="/login" element={<LoginPage/>}/><Route element={<ProtectedRoute/>}><Route element={<AppLayout/>}><Route index element={<DashboardPage/>}/><Route path="menu" element={<MenuPage/>}/><Route path="cart" element={<CartPage/>}/><Route path="checkout" element={<CheckoutPage/>}/><Route path="checkout/success" element={<CheckoutSuccessPage/>}/><Route path="orders" element={<OrdersPage/>}/><Route path="orders/:orderId" element={<OrderDetailPage/>}/><Route path="favorites" element={<FavoritesPage/>}/><Route element={<RoleRoute/>}><Route path="company" element={<CompanyPage/>}/></Route><Route path="reports" element={<ReportsPage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="*" element={<NotFoundPage/>}/></Route></Route></Routes>;
