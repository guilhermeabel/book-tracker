import { Skeleton } from "@/components/ui/skeleton"

export const TabsSkeleton = () => {
	return (
		<div className="space-y-4">
			<div className="flex border-b border-b-muted w-fit">
				<Skeleton className="h-8 w-28 rounded-md mx-1" />
				<Skeleton className="h-8 w-28 rounded-md mx-1" />
				<Skeleton className="h-8 w-28 rounded-md mx-1" />
			</div>
			<Skeleton className="h-64 w-full" />
		</div>
	)
}
