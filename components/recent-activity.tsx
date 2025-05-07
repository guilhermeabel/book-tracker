"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
              className={`flex items-start gap-4 ${activity.isCurrentUser ? "bg-primary/10 p-3 rounded-lg border border-primary/20" : ""
                }`}
            >
              <Avatar>
                <AvatarImage src={activity.user.avatar_url || "/placeholder.svg"} alt={activity.user.name || ""} />
                <AvatarFallback>{(activity.user.name || "?").charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{" "}
                  {activity.type === "study_log" ? "logged study time for" : "joined group"}{" "}
                  {activity.type === "study_log" && activity.subject && (
                    <span className="font-medium">"{activity.subject}"</span>
                  )}{" "}
                  {activity.type === "joined_group" && activity.group && (
                    <span className="font-medium">{activity.group.name}</span>
                  )}
                </p>
                <div className="flex items-center text-xs text-muted-foreground gap-3">
                  <span>{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
                  {activity.type === "study_log" && activity.minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.minutes} minutes
                    </span>
                  )}
                  {activity.type === "study_log" && activity.group && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {activity.group.name}
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
