import { Skeleton } from "@/components/ui/skeleton"

export const HeaderSkeleton = () => {
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<Skeleton className="h-10 w-[138px]" />
			<div className="flex gap-2">
				<Skeleton className="h-10 w-[138px]" />
				<Skeleton className="h-10 w-[138px]" />
				<Skeleton className="h-10 w-[138px]" />
			</div>
		</div>
	)
}
