import { Flame, Heart, Plus } from 'lucide-react';
import type { Meal } from '../../types';
import { categoryLabels, formatCurrency } from '../../utils/format';
import { Badge, Button, Card } from '../common/ui';

export const MealCard = ({ meal, onOpen, onQuickAdd, onToggleFavorite }: { meal: Meal; onOpen: (meal: Meal) => void; onQuickAdd: (meal: Meal) => void; onToggleFavorite: (meal: Meal) => void }) => (
  <Card className="group relative overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(62,53,38,.09)]">
    <button className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#75694f]" onClick={() => onOpen(meal)} aria-label={`查看${meal.name}詳情`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100"><img src={meal.image} alt={meal.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"/>{meal.isPopular && <Badge tone="warning" className="absolute left-3 top-3 bg-white/90 shadow-sm"><Flame size={12} className="mr-1"/>熱門</Badge>}{meal.stock === 0 && <div className="absolute inset-0 grid place-items-center bg-stone-950/45"><span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-700">今日售完</span></div>}</div>
      <div className="p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold text-stone-900">{meal.name}</h3><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-stone-500">{meal.description}</p></div></div><div className="mt-3 flex items-center justify-between"><div><p className="text-base font-semibold text-stone-900">{formatCurrency(meal.price)}</p><p className="mt-0.5 text-[11px] text-stone-400">{categoryLabels[meal.category]} · 剩餘 {meal.stock} 份</p></div></div></div>
    </button>
    <button onClick={() => onToggleFavorite(meal)} aria-label={meal.isFavorite ? '取消收藏' : '加入收藏'} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-stone-500 shadow-sm transition hover:scale-105 hover:text-[#9a514a] focus:outline-none focus:ring-2 focus:ring-[#75694f]"><Heart size={17} fill={meal.isFavorite ? 'currentColor' : 'none'} className={meal.isFavorite ? 'text-[#9a514a]' : ''}/></button>
    <Button size="icon" variant="secondary" className="absolute bottom-4 right-4" disabled={meal.stock === 0} aria-label={`加入${meal.name}至購物車`} onClick={() => onQuickAdd(meal)}><Plus size={17}/></Button>
  </Card>
);
