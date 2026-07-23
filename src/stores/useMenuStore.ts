import { create } from 'zustand';
import type { MealCategory } from '../types';
import { todayIso } from '../utils/format';

interface MenuState {
  selectedCategory: 'all' | MealCategory;
  searchKeyword: string;
  selectedDate: string;
  selectedLocation: string;
  setSelectedCategory: (value: 'all' | MealCategory) => void;
  setSearchKeyword: (value: string) => void;
  setSelectedDate: (value: string) => void;
  setSelectedLocation: (value: string) => void;
  resetFilters: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  selectedCategory: 'all', searchKeyword: '', selectedDate: todayIso(), selectedLocation: 'L01',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  resetFilters: () => set({ selectedCategory: 'all', searchKeyword: '', selectedDate: todayIso(), selectedLocation: 'L01' }),
}));
