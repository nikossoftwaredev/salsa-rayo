import { Skeleton } from "@/components/ui/skeleton"

const ScheduleSkeleton = () => (
  <div className="flex items-center justify-center flex-col space-y-12 scroll-mt-20">
    <Skeleton className="h-10 w-48" />

    <div className="w-full max-w-4xl space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row items-stretch bg-card/80 rounded-2xl overflow-hidden border border-border/20"
        >
          <div className="md:w-44 p-5 md:p-8 flex items-center justify-center bg-secondary/10">
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex-1 p-4 md:p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 flex-1 max-w-32" />
                <div className="flex -space-x-2">
                  <Skeleton className="size-8 md:size-10 rounded-full" />
                  <Skeleton className="size-8 md:size-10 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default ScheduleSkeleton
