"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGroup } from "@/lib/hooks/use-group"
import { useParams } from "next/navigation"

export default function GroupLeaderboard() {
  const params = useParams()
  const { data: group, isLoading } = useGroup(params.id as string)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full max-w-xs" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!group) {
    return null
  }

  // Sort members by hours in descending order
  const sortedMembers = [...group.members].sort((a, b) => b.hours - a.hours)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Leaderboard</CardTitle>
        <CardDescription>See how you rank against other students in your group.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMembers.map((member, index) => (
            <div
              key={member.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg gap-2 ${member.isCurrentUser
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-muted"
                }`}
            >
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <Avatar className="flex-shrink-0">
                  <AvatarImage src={member.avatar_url || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium truncate">{member.name}</p>
                </div>
              </div>
              <div className="text-left sm:text-right ml-10 sm:ml-0">
                <p className="font-medium">{member.hours * 60} minutes</p>
                <p className="text-xs sm:text-sm text-muted-foreground">total study time</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
