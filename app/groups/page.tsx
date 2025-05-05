import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Plus, Users } from "lucide-react"
import Link from "next/link"

// Mock data for groups
const groupsData = [
  {
    id: "study-group-1",
    name: "Study Group 1",
    description: "A group for students who are serious about their studies.",
    members: 24,
    subjects: 156,
    studyHours: 1240,
    rank: 3,
    topMembers: [
      { name: "Alex J", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Jamie S", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "You", avatar: "/placeholder.svg?height=32&width=32", isCurrentUser: true },
    ],
  },
  {
    id: "study-group-2",
    name: "Study Group 2",
    description: "For students focused on science and mathematics.",
    members: 18,
    subjects: 94,
    studyHours: 876,
    rank: 5,
    topMembers: [
      { name: "Taylor B", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Morgan L", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "You", avatar: "/placeholder.svg?height=32&width=32", isCurrentUser: true },
    ],
  },
  {
    id: "study-group-3",
    name: "Study Group 3",
    description: "Dedicated to humanities and social sciences.",
    members: 12,
    subjects: 78,
    studyHours: 654,
    rank: 2,
    topMembers: [
      { name: "Casey W", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Riley D", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "You", avatar: "/placeholder.svg?height=32&width=32", isCurrentUser: true },
    ],
  },
]

export default function GroupsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Groups</h1>
          <p className="text-muted-foreground">Join a group to study together and track your progress.</p>
        </div>
        <Button asChild>
          <Link href="/groups/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupsData.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{group.name}</CardTitle>
                <Badge variant="outline">#{group.rank}</Badge>
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 bg-muted rounded-lg">
                  <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{group.members}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <BookOpen className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-medium">{group.subjects}</p>
                  <p className="text-xs text-muted-foreground">Subjects</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg">
                  <p className="text-sm font-medium">{group.studyHours}</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Top Students</p>
                <div className="flex -space-x-2">
                  {group.topMembers.map((member, index) => (
                    <Avatar
                      key={index}
                      className={`border-2 border-background ${member.isCurrentUser ? "ring-2 ring-primary" : ""}`}
                    >
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs">
                    +{group.members - group.topMembers.length}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/groups/${group.id}`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Group
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
