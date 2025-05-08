import { Skeleton } from "@/components/ui/skeleton"

export const TabsSkeleton = () => {
	return (
		<div className="space-y-4">
			<div className="flex w-full justify-between overflow-x-auto border-b border-b-muted">
				<Skeleton className="h-8 flex-1 rounded-md mx-1" />
				<Skeleton className="h-8 flex-1 rounded-md mx-1" />
				<Skeleton className="h-8 flex-1 rounded-md mx-1" />
			</div>
			<Skeleton className="h-64 w-full" />
		</div>
	)
}
