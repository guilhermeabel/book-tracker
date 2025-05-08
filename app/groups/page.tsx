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
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not Authorized</CardTitle>
          <CardDescription>Please sign in to view your groups.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Get the user's group memberships first
  const { data: memberships, error: membershipError } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', user.id)

  if (membershipError) {
    console.error("Error fetching memberships:", membershipError)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load your groups. Please try again.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // If user has no memberships, show the empty state
  if (!memberships || memberships.length === 0) {
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
        <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Button asChild className="w-full">
            <Link href="/groups/join">
              Join a Group
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/groups/create">
              Create Group
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Extract the group IDs the user is a member of
  const groupIds = memberships.map(m => m.group_id)

  // Fetch details for those groups
  const { data: groups, error: groupsError } = await supabase
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
    .in('id', groupIds)
    .order('name')

  if (groupsError) {
    console.error("Error fetching groups:", groupsError)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load your groups. Please try again.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

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
        <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Button asChild className="w-full">
            <Link href="/groups/join">
              Join a Group
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/groups/create">
              Create Group
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {[1, 2].map((i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-full max-w-[160px]" />
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

export default async function GroupsPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Study Groups</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button asChild variant="outline" className="flex-1 sm:flex-none">
            <Link href="/">
              Back
            </Link>
          </Button>
          <Button asChild className="flex-1 sm:flex-none">
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
