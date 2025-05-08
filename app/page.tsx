"use client"

import GroupsLeaderboard from "@/components/groups-leaderboard"
import { AppHeader } from "@/components/homepage/app-header"
import { HeaderSkeleton } from "@/components/homepage/skeletons/header-skeleton"
import { StatsCardSkeleton } from "@/components/homepage/skeletons/stats-skeleton"
import { TabsSkeleton } from "@/components/homepage/skeletons/tabs-skeleton"
import LandingPage from "@/components/landing-page"
import RecentActivity from "@/components/recent-activity"
import StudyLogForm from "@/components/study-log-form"
import StudyStats from "@/components/study-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Loading } from "@/components/ui/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/hooks/use-auth"
import { useGroups } from "@/lib/hooks/use-groups"
import { useStudyStats } from "@/lib/hooks/use-study-stats"
import { ArrowUp, Clock, Plus, TrendingUp, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { Suspense, useState } from "react"

export default function Home() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black opacity-80">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-8 px-4 py-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-pink-500 to-blue-900 animate-gradient-x">
                StudyRats
              </span>
            </h1>
            <p className="text-muted-foreground text-center animate-pulse">
              Preparing your reading journey...
            </p>
            <Loading height="h-12" />
          </div>
        </div>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  if (!isAuthenticated) {
    return <LandingPage />
  }

  // Show dashboard for authenticated users
  return <Dashboard />
}

function Dashboard() {
  const { data: groups, isLoading: isLoadingGroups } = useGroups()
  const { data: stats, isLoading: isLoadingStats } = useStudyStats()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Check if the user is a new user (no groups)
  const hasNoGroups = !isLoadingGroups && (!groups || groups.length === 0)
  const hasNoActivity = !isLoadingStats && (!stats || stats.totalHours === 0)
  const isNewUser = hasNoGroups && hasNoActivity

  return (
    <div className="container mx-auto py-6 space-y-8 pt-12">
      {isLoadingGroups ? (
        <HeaderSkeleton />
      ) : (
        <>
          {!isNewUser && groups && groups.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <AppHeader />
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
            </div>
          )}
        </>
      )}

      {isNewUser ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto mb-10 space-y-4">
            <div className="flex flex-row gap-1 items-center justify-center">
              <h1 className="text-3xl font-bold tracking-tight">Welcome to</h1>
              <h1 style={{ paddingTop: '1px' }} className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-900 via-pink-500 to-blue-900 animate-gradient-x">StudyRats</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Track your reading progress, join study groups, and compete with friends.
            </p>
            <p className="text-muted-foreground">
              Get started by joining a group or creating your own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 w-full max-w-2xl">
            <Card className="transition-all hover:shadow-lg border-primary/10 hover:border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-center">Join a Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <p className="text-center text-sm text-muted-foreground">
                  Join an existing reading group with friends using an invite code.
                </p>
                <Button asChild className="w-full">
                  <Link href="/groups/join">
                    <Users className="mr-2 h-4 w-4" />
                    Join with Invite Code
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg border-primary/10 hover:border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-center">Create a Group</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <p className="text-center text-sm text-muted-foreground">
                  Start your own reading group and invite others to join you.
                </p>
                <Button asChild className="w-full">
                  <Link href="/groups/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create a Group
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isLoadingStats ? (
              <>
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
              </>
            ) : (
              <>
                {stats && stats.streak > 0 ? (
                  <div className="relative p-[1px] rounded-xl transform rotate-1 animate-float overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 rounded-xl"></div>
                    <div className="relative bg-gray-800/90 backdrop-blur-md rounded-xl p-6 shadow-lg h-full">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium mb-2">Study Streak</h3>
                        <TrendingUp className="h-4 w-4 text-pink-400" />
                      </div>
                      <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 animate-gradient-fast">{stats.streak == 1 ? `1 day` : `${stats.streak} days`}</div>
                      <p className="text-xs text-gray-300">
                        Keep it up!
                      </p>
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0 days</div>
                      <p className="text-xs text-muted-foreground">
                        Start your streak today!
                      </p>
                    </CardContent>
                  </Card>
                )}

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

                {stats?.groupRank && stats.groupRank.rank > 0 && (
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

          {isLoadingStats ? (
            <TabsSkeleton />
          ) : (
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
          )}
        </>
      )
      }
    </div >
  )
}
