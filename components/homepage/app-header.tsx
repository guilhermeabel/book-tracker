"use client"

import { UserAvatar } from "@/components/user-avatar"

export const AppHeader = () => {
	return (
		<div className="flex items-center gap-4">
			<UserAvatar />
			<div>
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-pink-500 to-blue-900 animate-gradient-x">StudyRats</h1>
				<p className="text-sm sm:text-base text-muted-foreground">Track your study progress and compete with friends.</p>
			</div>
		</div>
	)
}
