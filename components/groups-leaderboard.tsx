"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGroup } from "@/lib/hooks/use-group"
import { useGroups } from "@/lib/hooks/use-groups"

export default function GroupsLeaderboard() {
	const { data: groups, isLoading: isLoadingGroups } = useGroups()

	if (isLoadingGroups || !groups) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-72" />
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			{groups.map((group) => (
				<GroupLeaderboardCard key={group.id} groupId={group.id} />
			))}
		</div>
	)
}

function GroupLeaderboardCard({ groupId }: { groupId: string }) {
	const { data: group, isLoading } = useGroup(groupId)

	if (isLoading || !group) {
		return (
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-48" />
					<Skeleton className="h-4 w-72" />
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-16 w-full" />
						))}
					</div>
				</CardContent>
			</Card>
		)
	}

	// Sort members by hours in descending order
	const sortedMembers = [...group.members].sort((a, b) => b.hours - a.hours)

	return (
		<Card>
			<CardHeader>
				<CardTitle>{group.name}</CardTitle>
				<CardDescription>Top performers in this group</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{sortedMembers.slice(0, 3).map((member, index) => (
						<div
							key={member.id}
							className={`flex items-center justify-between p-3 rounded-lg ${member.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
								}`}
						>
							<div className="flex items-center gap-4">
								<div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-medium">
									{index + 1}
								</div>
								<Avatar>
									<AvatarImage src={member.avatar_url || "/placeholder.svg"} alt={member.name} />
									<AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{member.name}</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-medium">{member.hours} hours</p>
								<p className="text-sm text-muted-foreground">total study time</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
} 
