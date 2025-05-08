import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSetupSkeleton() {
	return (
		<Card className="border-primary/10 max-w-md w-full mx-auto">
			<CardHeader className="space-y-2">
				<Skeleton className="h-6 w-40 mx-auto" />
				<Skeleton className="h-4 w-64 mx-auto" />
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-3 w-56" />
				</div>
				<Skeleton className="h-10 w-full" />
			</CardContent>
		</Card>
	)
} 
