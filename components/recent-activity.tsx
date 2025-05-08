"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { useActivity } from "@/lib/hooks/use-activity"
import { formatDistanceToNow } from "date-fns"
import { BookOpen, Clock, Users } from "lucide-react"

export default function RecentActivity() {
  const { data: activities, isLoading, error } = useActivity()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Loading activity from your study groups...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loading size="sm" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Something went wrong while loading activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>No recent activity in your groups yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Join a group or log study time to start seeing activity here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>See what's happening in your study groups.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 ${activity.isCurrentUser
                ? "bg-primary/10 p-3 rounded-lg border border-primary/20"
                : ""
                }`}
            >
              <div className="flex-shrink-0 h-10 w-10 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                {activity.user.avatar_url ? (
                  <img
                    src={activity.user.avatar_url}
                    alt={activity.user.name || ""}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <Users className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-sm break-words">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {activity.type === "study_log" ? "logged study time for" : "joined group"}{" "}
                  {activity.type === "study_log" && activity.subject && (
                    <span className="font-medium">"{activity.subject}"</span>
                  )}{" "}
                  {activity.type === "joined_group" && activity.group && (
                    <span className="font-medium">{activity.group.name}</span>
                  )}
                </p>
                <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-y-2">
                  <span className="w-full sm:w-auto">{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
                  {activity.type === "study_log" && activity.minutes && (
                    <span className="flex items-center gap-1 mr-3">
                      <Clock className="h-3 w-3 flex-shrink-0" />
                      {activity.minutes} minutes
                    </span>
                  )}
                  {activity.type === "study_log" && activity.group && (
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <BookOpen className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{activity.group.name}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
