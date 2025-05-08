"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Loading } from "@/components/ui/loading"
import { ActivityItem, useActivity } from "@/lib/hooks/use-activity"
import { format, formatDistanceToNow } from "date-fns"
import { BookOpen, Clock, Info, Users } from "lucide-react"
import { useState } from "react"

export default function RecentActivity() {
  const { data: activities, isLoading, error } = useActivity()
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openActivityDetails = (activity: ActivityItem) => {
    setSelectedActivity(activity)
    setDrawerOpen(true)
  }

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
    <>
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
                  <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-x-2 gap-y-2">
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
                    {activity.type === "study_log" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-6 px-2 text-xs"
                        onClick={() => openActivityDetails(activity)}
                      >
                        <Info className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b">
            <DrawerTitle>Study Details</DrawerTitle>
            <DrawerDescription>
              {selectedActivity?.type === "study_log"
                ? `${selectedActivity.user.name}'s study session`
                : "Group Activity"}
            </DrawerDescription>
          </DrawerHeader>

          {selectedActivity && (
            <div className="px-4 py-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-12 w-12 overflow-hidden rounded-full bg-muted flex items-center justify-center">
                    {selectedActivity.user.avatar_url ? (
                      <img
                        src={selectedActivity.user.avatar_url}
                        alt={selectedActivity.user.name || ""}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <Users className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedActivity.user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(selectedActivity.created_at), "PPP 'at' p")}
                    </p>
                  </div>
                </div>

                {selectedActivity.type === "study_log" && (
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Subject</h4>
                      <p className="text-lg">{selectedActivity.subject}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-1">Duration</h4>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-lg">{selectedActivity.minutes} minutes</p>
                      </div>
                    </div>

                    {selectedActivity.description && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Notes</h4>
                        <div className="bg-background p-3 rounded border text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {selectedActivity.description}
                        </div>
                      </div>
                    )}

                    {selectedActivity.group && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Group</h4>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-lg">{selectedActivity.group.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <DrawerFooter className="border-t pt-4">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
