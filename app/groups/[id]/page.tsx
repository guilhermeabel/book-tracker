"use client"

import GroupLeaderboard from "@/components/group-leaderboard"
import RecentActivity from "@/components/recent-activity"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGroup } from "@/lib/hooks/use-group"
import { ArrowLeft, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { use } from "react"

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: group, isLoading } = useGroup(id)

  if (isLoading) {
    return <Loading />
  }

  if (!group) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Group not found</h1>
          <Button asChild>
            <Link href="/groups">Back to Groups</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/groups">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Group Overview</CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{group.memberCount}</p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Trophy className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{group.studyHours}</p>
                <p className="text-sm text-muted-foreground">Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Students in this study group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${member.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar_url || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                    </div>
                  </div>
                  <div className="text-sm">{member.hours} hrs</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leaderboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="leaderboard" className="space-y-4">
          <GroupLeaderboard />
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  )
}
