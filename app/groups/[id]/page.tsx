import GroupLeaderboard from "@/components/group-leaderboard"
import RecentActivity from "@/components/recent-activity"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Trophy, Users } from "lucide-react"
import Link from "next/link"

// This would normally come from a database based on the group ID
const groupData = {
  id: "study-group-1",
  name: "Study Group 1",
  description: "A group for students who are serious about their studies.",
  memberCount: 24,
  subjects: 156,
  studyHours: 1240,
  rank: 3,
  topSubjects: [
    { name: "Mathematics", students: 12 },
    { name: "Physics", students: 10 },
    { name: "Chemistry", students: 8 },
    { name: "Biology", students: 7 },
    { name: "History", students: 6 },
  ],
  members: [
    { name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40", subjects: 12, hours: 98 },
    { name: "Jamie Smith", avatar: "/placeholder.svg?height=40&width=40", subjects: 8, hours: 76 },
    { name: "You", avatar: "/placeholder.svg?height=40&width=40", subjects: 6, hours: 62, isCurrentUser: true },
    { name: "Taylor Brown", avatar: "/placeholder.svg?height=40&width=40", subjects: 5, hours: 48 },
    { name: "Morgan Lee", avatar: "/placeholder.svg?height=40&width=40", subjects: 4, hours: 42 },
  ],
}

export default function GroupPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the group data based on params.id

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/groups">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{groupData.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Group Overview</CardTitle>
            <CardDescription>{groupData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{groupData.members.length}</p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <BookOpen className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{groupData.subjects}</p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Trophy className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{groupData.studyHours}</p>
                <p className="text-sm text-muted-foreground">Hours</p>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">Popular Subjects in this Group</h3>
            <div className="space-y-3">
              {groupData.topSubjects.map((subject, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{subject.name}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{subject.students} students</span>
                  </div>
                </div>
              ))}
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
              {groupData.members.map((member, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    member.isCurrentUser ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.subjects} subjects</p>
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
