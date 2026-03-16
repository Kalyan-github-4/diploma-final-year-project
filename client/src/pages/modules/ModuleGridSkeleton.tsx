import { Skeleton } from "@/components/ui/skeleton"

export type ModuleGridSkeletonProps = {
  count: number
}

export function ModuleGridSkeleton({ count }: ModuleGridSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-(--bg-elevated) border border-border rounded-2xl p-6 flex flex-col justify-between"
        >
          {/* Top */}
          <div className="flex justify-between items-start">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-4 w-16 rounded-sm" />
          </div>

          {/* Title */}
          <div className="mt-4 space-y-1">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Progress labels */}
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>

          {/* Progress bar */}
          <Skeleton className="mt-2 h-1 w-full rounded-full" />

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}