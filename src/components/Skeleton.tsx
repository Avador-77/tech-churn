'use client';

import React from 'react';

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col bg-neutral-900/40 rounded-2xl border border-neutral-800/60 overflow-hidden animate-pulse h-[380px]">
      <div className="h-48 w-full bg-neutral-800/80" />
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 w-1/4 bg-neutral-800 rounded-full" />
          <div className="h-5 w-3/4 bg-neutral-800 rounded" />
          <div className="h-4 w-full bg-neutral-800/60 rounded" />
          <div className="h-4 w-2/3 bg-neutral-800/60 rounded" />
        </div>
        <div className="pt-3 border-t border-neutral-800 flex justify-between items-center">
          <div className="h-6 w-24 bg-neutral-800 rounded-lg" />
          <div className="h-7 w-20 bg-neutral-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}
