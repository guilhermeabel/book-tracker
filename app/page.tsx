"use client"

import GroupLeaderboard from "@/components/group-leaderboard"
import RecentActivity from "@/components/recent-activity"
import StudyLogForm from "@/components/study-log-form"
import StudyStats from "@/components/study-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Loading } from "@/components/ui/loading"
import { StatsCardSkeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGroups } from "@/lib/hooks/use-groups"
import { BookOpen, Clock, Plus, TrendingUp, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { Suspense, useState } from "react"

export default function Dashboard() {
  const { data: groups, isLoading } = useGroups()
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-pink-500 to-blue-900 animate-gradient-x">StudyRats</h1>
          <p className="text-muted-foreground">Track your study progress and compete with friends.</p>
        </div>
        {groups && groups.length > 0 && (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/groups">
                <Users className="mr-2 h-4 w-4" />
                My Groups
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/groups/join">
                <Users className="mr-2 h-4 w-4" />
                Join Group
              </Link>
            </Button>
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Study
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[90vh] overflow-y-auto max-w-md mx-auto">
                <DrawerHeader className="text-left">
                  <DrawerTitle>Record Study Session</DrawerTitle>
                  <DrawerDescription>Log your study progress to compete with your groups</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                  <StudyLogForm
                    onSuccess={() => setDrawerOpen(false)}
                    showCard={false}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<StatsCardSkeleton />}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127 hours</div>
              <p className="text-xs text-muted-foreground">+2.5 hours from last week</p>
            </CardContent>
          </Card>
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects Studied</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Group Rank</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#3</div>
              <p className="text-xs text-muted-foreground">In "Study Group 1"</p>
            </CardContent>
          </Card>
        </Suspense>
        <Suspense fallback={<StatsCardSkeleton />}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </Suspense>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="stats">My Stats</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="space-y-4">
          <Suspense fallback={<Loading />}>
            <RecentActivity />
          </Suspense>
        </TabsContent>
        <TabsContent value="stats" className="space-y-4">
          <Suspense fallback={<Loading />}>
            <StudyStats />
          </Suspense>
        </TabsContent>
        <TabsContent value="leaderboard" className="space-y-4">
          <Suspense fallback={<Loading />}>
            <GroupLeaderboard />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
