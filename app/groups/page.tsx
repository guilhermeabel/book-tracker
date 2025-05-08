import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { Users } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"

interface Group {
  id: string
  name: string
  description: string | null
  created_at: string
  group_members: Array<{
    role: string
  }>
}

async function GroupsList() {
  const supabase = createServerComponentClient({ cookies })
  const { data: groups } = await supabase
    .from('groups')
    .select(`
      id,
      name,
      description,
      created_at,
      group_members!inner (
        role
      )
    `)
    .order('name')

  if (groups?.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Groups Yet</CardTitle>
          <CardDescription>You haven't joined any study groups yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <p>Join or create a group to start studying with others!</p>
          </div>
        </CardContent>
        <CardFooter className="flex space-x-4">
          <Button asChild>
            <Link href="/groups/join">
              Join a Group
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/groups/create">
              Create Group
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups?.map((group: Group) => (
        <Card key={group.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{group.name}</CardTitle>
            <CardDescription>{group.description || "No description provided"}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Member since {new Date(group.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/groups/${group.id}`}>
                View Group
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function GroupsListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2].map((i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default function GroupsPage() {
  return (
    <div className="container max-w-2xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Study Groups</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/">
              Back
            </Link>
          </Button>
          <Button asChild>
            <Link href="/groups/create">
              Create Group
            </Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<GroupsListSkeleton />}>
        <GroupsList />
      </Suspense>
    </div>
  )
}
