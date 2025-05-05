import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock } from "lucide-react"

// Mock data for recent activity
const activityData = [
  {
    id: 1,
    user: { name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    action: "finished studying",
    subject: "Mathematics",
    time: "2 hours ago",
    group: "Study Group 1",
    minutes: 45,
  },
  {
    id: 2,
    user: { name: "You", avatar: "/placeholder.svg?height=40&width=40" },
    action: "logged a session for",
    subject: "Physics",
    time: "5 hours ago",
    group: "Study Group 1",
    minutes: 60,
    isCurrentUser: true,
  },
  {
    id: 3,
    user: { name: "Jamie Smith", avatar: "/placeholder.svg?height=40&width=40" },
    action: "started studying",
    subject: "Chemistry",
    time: "Yesterday",
    group: "Study Group 1",
    minutes: 30,
  },
  {
    id: 4,
    user: { name: "Taylor Brown", avatar: "/placeholder.svg?height=40&width=40" },
    action: "joined group",
    group: "Study Group 1",
    time: "2 days ago",
  },
  {
    id: 5,
    user: { name: "Morgan Lee", avatar: "/placeholder.svg?height=40&width=40" },
    action: "logged a session for",
    subject: "Biology",
    time: "2 days ago",
    group: "Study Group 1",
    minutes: 75,
  },
]

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>See what's happening in your study groups.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activityData.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-4 ${
                activity.isCurrentUser ? "bg-primary/10 p-3 rounded-lg border border-primary/20" : ""
              }`}
            >
              <Avatar>
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
                  {activity.subject && <span className="font-medium">"{activity.subject}"</span>}{" "}
                  {activity.action === "joined group" && <span className="font-medium">{activity.group}</span>}
                </p>
                <div className="flex items-center text-xs text-muted-foreground gap-3">
                  <span>{activity.time}</span>
                  {activity.minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.minutes} minutes
                    </span>
                  )}
                  {activity.group && activity.action !== "joined group" && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {activity.group}
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
