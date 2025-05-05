"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

// Mock data for the leaderboard
const leaderboardData = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 1,
    subjects: 12,
    hours: 98,
    isCurrentUser: false,
  },
  {
    id: 2,
    name: "Jamie Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 2,
    subjects: 8,
    hours: 76,
    isCurrentUser: false,
  },
  {
    id: 3,
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 3,
    subjects: 6,
    hours: 62,
    isCurrentUser: true,
  },
  {
    id: 4,
    name: "Taylor Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 4,
    subjects: 5,
    hours: 48,
    isCurrentUser: false,
  },
  {
    id: 5,
    name: "Morgan Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    rank: 5,
    subjects: 4,
    hours: 42,
    isCurrentUser: false,
  },
]

export default function GroupLeaderboard() {
  const [selectedGroup, setSelectedGroup] = useState("study-group-1")

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle>Group Leaderboard</CardTitle>
            <CardDescription>See how you rank against other students in your group.</CardDescription>
          </div>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="study-group-1">Study Group 1</SelectItem>
              <SelectItem value="study-group-2">Study Group 2</SelectItem>
              <SelectItem value="study-group-3">Study Group 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted font-medium">
                  {user.rank}
                </div>
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.subjects} subjects</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{user.hours} hours</p>
                <p className="text-sm text-muted-foreground">total study time</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
