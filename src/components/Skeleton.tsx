import React from 'react';
import { cn } from '../types';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)} />
  );
};

export const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-3">
    <Skeleton className="aspect-[4/5] mb-3" />
    <Skeleton className="h-4 w-1/2 mb-2" />
    <Skeleton className="h-3 w-1/3 mb-4" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-1/4" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  </div>
);

export const StatsSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
    <Skeleton className="h-4 w-1/4 mb-4" />
    <Skeleton className="h-8 w-1/2 mb-2" />
    <Skeleton className="h-3 w-1/3" />
  </div>
);
