import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, ArrowLeft, Trophy } from "lucide-react"
import GroupLeaderboard from "@/components/group-leaderboard"
import RecentActivity from "@/components/recent-activity"

// This would normally come from a database based on the group ID
const groupData = {
  id: "book-enthusiasts",
  name: "Book Enthusiasts",
  description: "A group for people who love reading all kinds of books.",
  members: 24,
  books: 156,
  readingHours: 1240,
  rank: 3,
  topBooks: [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", readers: 12 },
    { title: "To Kill a Mockingbird", author: "Harper Lee", readers: 10 },
    { title: "1984", author: "George Orwell", readers: 8 },
    { title: "Pride and Prejudice", author: "Jane Austen", readers: 7 },
    { title: "The Hobbit", author: "J.R.R. Tolkien", readers: 6 },
  ],
  members: [
    { name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40", books: 12, hours: 98 },
    { name: "Jamie Smith", avatar: "/placeholder.svg?height=40&width=40", books: 8, hours: 76 },
    { name: "You", avatar: "/placeholder.svg?height=40&width=40", books: 6, books: 8, hours: 76 },
    { name: "You", avatar: "/placeholder.svg?height=40&width=40", books: 6, hours: 62, isCurrentUser: true },
    { name: "Taylor Brown", avatar: "/placeholder.svg?height=40&width=40", books: 5, hours: 48 },
    { name: "Morgan Lee", avatar: "/placeholder.svg?height=40&width=40", books: 4, hours: 42 },
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
                <p className="text-2xl font-bold">{groupData.books}</p>
                <p className="text-sm text-muted-foreground">Books</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Trophy className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{groupData.readingHours}</p>
                <p className="text-sm text-muted-foreground">Hours</p>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-4">Popular Books in this Group</h3>
            <div className="space-y-3">
              {groupData.topBooks.map((book, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{book.readers} readers</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>People in this reading group</CardDescription>
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
                      <p className="text-xs text-muted-foreground">{member.books} books</p>
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
