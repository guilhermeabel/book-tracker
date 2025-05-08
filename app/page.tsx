"use client"

import GroupsLeaderboard from "@/components/groups-leaderboard"
import { AppHeader } from "@/components/homepage/app-header"
import { HeaderSkeleton } from "@/components/homepage/skeletons/header-skeleton"
import { StatsCardSkeleton } from "@/components/homepage/skeletons/stats-skeleton"
import RecentActivity from "@/components/recent-activity"
import StudyLogForm from "@/components/study-log-form"
import StudyStats from "@/components/study-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGroups } from "@/lib/hooks/use-groups"
import { useStudyStats } from "@/lib/hooks/use-study-stats"
import { ArrowUp, Clock, Plus, TrendingUp, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { Suspense, useState } from "react"

export default function Dashboard() {
  const { data: groups, isLoading: isLoadingGroups } = useGroups()
  const { data: stats, isLoading: isLoadingStats } = useStudyStats()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="container mx-auto py-6 space-y-8 pt-12">
      {isLoadingGroups ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex flex-col md:flex-row justify-start items-start gap-4">
          <AppHeader />
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
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingStats ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalHours || 0} hours</div>
                <p className="text-xs text-muted-foreground">
                  {stats && stats.weeklyChange > 0 ? (
                    <span className="text-green-500 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +{stats.weeklyChange} hours from last week
                    </span>
                  ) : stats && stats.weeklyChange < 0 ? (
                    <span className="text-red-500">
                      {stats.weeklyChange} hours from last week
                    </span>
                  ) : (
                    "No change from last week"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.streak || 0} days</div>
                <p className="text-xs text-muted-foreground">
                  {stats && stats.streak > 0 ? "Keep it up!" : "Start your streak today!"}
                </p>
              </CardContent>
            </Card>

            {stats?.groupRank && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Group Rank</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">#{stats.groupRank.rank}</div>
                  <p className="text-xs text-muted-foreground">In "{stats.groupRank.groupName}"</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="stats">My Stats</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="space-y-4">
          <Suspense fallback={<StatsCardSkeleton />}>
            <RecentActivity />
          </Suspense>
        </TabsContent>
        <TabsContent value="stats" className="space-y-4">
          <Suspense fallback={<StatsCardSkeleton />}>
            <StudyStats />
          </Suspense>
        </TabsContent>
        <TabsContent value="leaderboard" className="space-y-4">
          <Suspense fallback={<StatsCardSkeleton />}>
            <GroupsLeaderboard />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
