"use client"

import { cn } from "@/lib/utils"

interface LoadingProps {
	className?: string
	size?: "sm" | "md" | "lg"
}

export function Loading({ className, size = "lg" }: LoadingProps) {
	const sizeClasses = {
		sm: "w-8 h-8",
		md: "w-12 h-12",
		lg: "w-16 h-16",
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className={cn("relative", sizeClasses[size])}>
				<div
					className={cn(
						"absolute inset-0 rounded-full",
						"bg-gradient-to-r from-purple-900 via-pink-500 to-blue-900",
						"animate-spin",
					)}
				/>
				<div
					className={cn(
						"absolute inset-[4px] rounded-full bg-background",
					)}
				/>
			</div>
		</div>
	)
} 
