"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGroup } from "@/lib/hooks/use-group"
import { useParams } from "next/navigation"

export default function GroupLeaderboard() {
  const params = useParams()
  const { data: group, isLoading } = useGroup(params.id as string)

  if (isLoading || !group) {
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
