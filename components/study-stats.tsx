"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStudyStats } from "@/lib/hooks/use-study-stats"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function StudyStats() {
  const { data: stats, isLoading } = useStudyStats()

  if (isLoading || !stats) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const weeklyTotal = stats.weekly.reduce((sum, day) => sum + day.hours, 0)
  const monthlyTotal = stats.monthly.reduce((sum, week) => sum + week.hours, 0)
  const weeklyAverage = weeklyTotal / 7
  const monthlyAverage = monthlyTotal / 4

  const maxWeeklyDay = stats.weekly.reduce((max, day) => day.hours > max.hours ? day : max, stats.weekly[0])
  const maxMonthlyWeek = stats.monthly.reduce((max, week) => week.hours > max.hours ? week : max, stats.monthly[0])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Statistics</CardTitle>
        <CardDescription>Track your study habits over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weekly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => [`${value} hours`, "Study Time"]} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              {maxWeeklyDay.hours > 0
                ? `You studied the most on ${maxWeeklyDay.name} (${maxWeeklyDay.hours} hours)`
                : "No study data for this week"}
            </p>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => [`${value} hours`, "Study Time"]} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              {monthlyTotal > 0
                ? `You studied ${monthlyTotal.toFixed(1)} hours this month, averaging ${monthlyAverage.toFixed(1)} hours per week`
                : "No study data for this month"}
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
