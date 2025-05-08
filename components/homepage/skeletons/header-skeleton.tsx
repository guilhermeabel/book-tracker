import { Skeleton } from "@/components/ui/skeleton"

export const HeaderSkeleton = () => {
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<Skeleton className="h-10 w-[138px]" />
			<div className="flex flex-wrap gap-2 w-full md:w-auto mt-4 md:mt-0">
				<Skeleton className="h-10 flex-1 md:w-[120px] md:flex-none" />
				<Skeleton className="h-10 flex-1 md:w-[120px] md:flex-none" />
				<Skeleton className="h-10 flex-1 md:w-[120px] md:flex-none" />
			</div>
		</div>
	)
}
