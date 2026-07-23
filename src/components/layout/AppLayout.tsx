import { useEffect, useRef } from 'react';
import { BarChart3, Building2, ChevronDown, CircleUserRound, ClipboardList, Heart, Home, LogOut, Menu, Settings, ShoppingCart, Soup, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';
import { useUIStore } from '../../stores/useUIStore';
import { cn } from '../../utils/cn';
import { Badge, Button, Toast } from '../common/ui';
import { GlobalCartDrawer } from '../cart/CartPanel';

const navigation = [
  { to: '/', label: '首頁', icon: Home }, { to: '/menu', label: '菜單瀏覽', icon: Soup }, { to: '/orders', label: '我的訂單', icon: ClipboardList },
  { to: '/favorites', label: '常用清單', icon: Heart }, { to: '/company', label: '公司管理', icon: Building2, adminOnly: true },
  { to: '/reports', label: '統計報表', icon: BarChart3 }, { to: '/settings', label: '帳號設定', icon: Settings },
];

const Brand = ({ tabletAware = false }: { tabletAware?: boolean }) => <div className="flex h-16 items-center gap-3 px-5"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#403a2c] text-white"><Soup size={20}/></div><div className={tabletAware ? 'hidden xl:block' : ''}><p className="font-semibold tracking-wide text-stone-900">食刻便當</p><p className="text-[10px] uppercase tracking-[.2em] text-stone-400">MealFlow</p></div></div>;

const NavigationLinks = ({ tabletAware = false, onNavigate }: { tabletAware?: boolean; onNavigate?: () => void }) => {
  const user = useAuthStore((state) => state.user);
  return <nav className="flex-1 space-y-1 px-3 py-3">{navigation.filter((item) => !item.adminOnly || user?.role === 'admin').map(({ to, label, icon: Icon }) => <NavLink end={to === '/'} key={to} to={to} onClick={onNavigate} title={tabletAware ? label : undefined} className={({ isActive }) => cn('flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-sm transition', isActive ? 'bg-[#f2eee5] font-medium text-[#403a2c]' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800', tabletAware && 'justify-center px-0 xl:justify-start xl:px-3')}><Icon size={19}/><span className={tabletAware ? 'hidden xl:inline' : ''}>{label}</span></NavLink>)}</nav>;
};

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout); const navigate = useNavigate();
  return <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-stone-200 bg-white md:flex xl:w-64"><Brand tabletAware/><div className="hidden xl:block"><div className="mx-4 border-t border-stone-100"/></div><NavigationLinks tabletAware/><div className="px-3 pb-4"><Button variant="ghost" className="w-full px-0 xl:justify-start xl:px-3" onClick={() => { logout(); navigate('/login'); }}><LogOut size={19}/><span className="hidden xl:inline">登出</span></Button></div><span className="pointer-events-none absolute left-16 top-0 hidden h-full w-px bg-white xl:hidden"/></aside>;
};

export const MobileSidebar = () => {
  const open = useUIStore((state) => state.isSidebarOpen); const close = useUIStore((state) => state.closeSidebar); const logout = useAuthStore((state) => state.logout); const navigate = useNavigate();
  return <div className={cn('fixed inset-0 z-50 md:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!open}><div className={cn('absolute inset-0 bg-stone-950/35 transition-opacity', open ? 'opacity-100' : 'opacity-0')} onClick={close}/><aside className={cn('absolute inset-y-0 left-0 flex w-[min(84vw,300px)] flex-col bg-white shadow-2xl transition-transform', open ? 'translate-x-0' : '-translate-x-full')}><div className="flex items-center justify-between"><Brand/><Button variant="ghost" size="icon" onClick={close}><X size={19}/></Button></div><NavigationLinks onNavigate={close}/><div className="p-3"><Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); close(); navigate('/login'); }}><LogOut size={19}/>登出</Button></div></aside></div>;
};

const pageTitles: Record<string, string> = { '/': '首頁總覽', '/menu': '菜單瀏覽', '/cart': '購物車', '/checkout': '確認結帳', '/orders': '我的訂單', '/favorites': '常用清單', '/company': '公司管理', '/reports': '統計報表', '/settings': '帳號設定' };
export const Header = () => {
  const location = useLocation(); const totalQuantity = useCartStore((state) => state.totalQuantity); const user = useAuthStore((state) => state.user);
  const openSidebar = useUIStore((state) => state.openSidebar); const openCart = useUIStore((state) => state.openCart); const isUserMenuOpen = useUIStore((state) => state.isUserMenuOpen); const toggleUserMenu = useUIStore((state) => state.toggleUserMenu); const closeAll = useUIStore((state) => state.closeAllOverlays); const logout = useAuthStore((state) => state.logout); const navigate = useNavigate(); const menuRef = useRef<HTMLDivElement>(null);
  const title = Object.entries(pageTitles).find(([path]) => path !== '/' && location.pathname.startsWith(path))?.[1] ?? pageTitles[location.pathname] ?? '訂單詳情';
  useEffect(() => { const onPointer = (event: MouseEvent) => { if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target) && isUserMenuOpen) closeAll(); }; const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeAll(); }; document.addEventListener('mousedown', onPointer); document.addEventListener('keydown', onKey); return () => { document.removeEventListener('mousedown', onPointer); document.removeEventListener('keydown', onKey); }; }, [closeAll, isUserMenuOpen]);
  return <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-200/80 bg-white/95 px-4 backdrop-blur sm:px-6"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="md:hidden" onClick={openSidebar} aria-label="開啟導覽"><Menu size={20}/></Button><h1 className="font-semibold text-stone-800">{title}</h1></div><div className="flex items-center gap-2 sm:gap-3"><Button onClick={openCart} className="relative"><ShoppingCart size={17}/><span className="hidden sm:inline">購物車</span>{totalQuantity > 0 && <Badge tone="warning" className="ml-0 bg-[#d8a339] px-2 text-white">{totalQuantity}</Badge>}</Button><div className="relative" ref={menuRef}><button onClick={toggleUserMenu} className="flex min-h-11 items-center gap-2 rounded-[10px] px-2 text-left hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#75694f]"><CircleUserRound className="text-stone-500" size={24}/><span className="hidden sm:block"><span className="block text-xs font-medium text-stone-800">{user?.name}</span><span className="block text-[10px] text-stone-400">{user?.company}</span></span><ChevronDown className="hidden text-stone-400 sm:block" size={15}/></button>{isUserMenuOpen && <div className="absolute right-0 top-12 w-52 rounded-xl border border-stone-200 bg-white p-2 shadow-xl"><div className="border-b border-stone-100 px-3 py-2 text-xs text-stone-500">{user?.email}</div><button onClick={() => { closeAll(); navigate('/settings'); }} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-stone-50"><Settings size={16}/>帳號設定</button><button onClick={() => { logout(); navigate('/login'); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#9a514a] hover:bg-red-50"><LogOut size={16}/>登出</button></div>}</div></div></header>;
};

export const MobileNavigation = () => <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-stone-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] md:hidden">{navigation.filter((item) => ['/', '/menu', '/orders', '/favorites'].includes(item.to)).map(({ to, label, icon: Icon }) => <NavLink end={to === '/'} key={to} to={to} className={({ isActive }) => cn('flex min-h-16 flex-col items-center justify-center gap-1 text-[10px]', isActive ? 'font-medium text-[#403a2c]' : 'text-stone-400')}><Icon size={19}/>{label}</NavLink>)}</nav>;

export const AppLayout = () => {
  const location = useLocation(); const closeAll = useUIStore((state) => state.closeAllOverlays);
  useEffect(() => closeAll(), [location.pathname, closeAll]);
  return <div className="min-h-screen bg-[#f7f6f3] text-stone-800"><Sidebar/><MobileSidebar/><div className="md:pl-20 xl:pl-64"><Header/><main className="mx-auto max-w-[1680px] p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 md:pb-8"><Outlet/></main></div><MobileNavigation/><GlobalCartDrawer/><Toast/></div>;
};
