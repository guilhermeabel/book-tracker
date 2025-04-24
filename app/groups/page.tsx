import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Plus } from "lucide-react"

// Mock data for groups
const groupsData = [
  {
    id: "book-enthusiasts",
    name: "Book Enthusiasts",
    description: "A group for people who love reading all kinds of books.",
    members: 24,
    books: 156,
    readingHours: 1240,
    rank: 3,
    topMembers: [
      { name: "Alex J", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Jamie S", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "You", avatar: "/placeholder.svg?height=32&width=32", isCurrentUser: true },
    ],
  },
  {
    id: "sci-fi-lovers",
    name: "Sci-Fi Lovers",
    description: "For fans of science fiction literature and exploring new worlds.",
    members: 18,
    books: 94,
    readingHours: 876,
    rank: 5,
    topMembers: [
      { name: "Taylor B", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Morgan L", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "You", avatar: "/placeholder.svg?height=32&width=32", isCurrentUser: true },
    ],
  },
  {
    id: "mystery-readers",
    name: "Mystery Readers",
    description: "Dedicated to solving literary mysteries one page at a time.",
    members: 12,
    books: 78,
    readingHours: 654,
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
          <h1 className="text-3xl font-bold tracking-tight">My Reading Groups</h1>
          <p className="text-muted-foreground">Join groups to compete and stay motivated.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/groups/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/groups/join">
              <Users className="mr-2 h-4 w-4" />
              Join Group
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupsData.map((group) => (
          <Card key={group.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{group.name}</CardTitle>
                <Badge variant="outline" className="ml-2">
                  Rank #{group.rank}
                </Badge>
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between mb-4">
                <div className="text-center">
                  <p className="text-sm font-medium">{group.members}</p>
                  <p className="text-xs text-muted-foreground">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{group.books}</p>
                  <p className="text-xs text-muted-foreground">Books</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{group.readingHours}</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Top Readers</p>
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
