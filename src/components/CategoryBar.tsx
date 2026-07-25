'use client';

import React from 'react';
import { CategoryType } from '@/lib/types';

interface CategoryBarProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
}

const CATEGORIES: CategoryType[] = [
  'All',
  '🤖 AI',
  '📱 Smartphones',
  '💻 Software',
  '🔐 Cybersecurity',
  '🚀 Startups',
  '🎮 Gaming',
  '🌌 Space',
  '⚡ Gadgets',
];

export function CategoryBar({
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  return (
    <div className="w-full space-y-4 mb-8">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
