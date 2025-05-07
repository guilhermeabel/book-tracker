"use client"

import { cn } from "@/lib/utils"
import { Loading } from "./loading"

interface SkeletonProps {
  className?: string
  showSpinner?: boolean
}

export function Skeleton({ className, showSpinner = false }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)}>
      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loading size="sm" className="opacity-50" />
        </div>
      )}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-[80px]" />
        <Skeleton className="h-4 w-[140px]" />
      </div>
    </div>
  )
}

export function StudyLogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
