import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Users } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"
import GroupInviteCode from "./invite-code"

interface Group {
  id: string
  name: string
  description: string | null
  created_at: string
  invite_code: string
  group_members: Array<{
    role: string
    user: {
      id: string
      full_name: string
      avatar_url: string | null
    }
  }>
}

// Add types for the member profiles
interface MemberProfile {
  id: string;
  user_id: string;
  role: string;
  name: string;
  avatar_url: string | null;
}

// Add type for study logs
interface StudyLog {
  id: string;
  subject: string;
  minutes: number;
  created_at: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
}

// Custom error component
function GroupErrorDisplay() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Something went wrong</CardTitle>
        <CardDescription>We couldn't load the group details</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Try refreshing the page or going back to your groups.</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/groups">Back to Groups</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

async function GroupDetails({ groupId }: { groupId: string }) {
  // Await the cookies to fix the error
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Not Authorized</CardTitle>
            <CardDescription>Please sign in to view group details.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      )
    }

    // Check if the user is a member of this group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single()

    if (membershipError && membershipError.code !== 'PGRST116') {
      console.error("Error checking membership:", membershipError)
      return <GroupErrorDisplay />
    }

    // If no membership was found, the user is not a member of this group
    if (!membership) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You are not a member of this group.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need to be a member of this group to view its details.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/groups">Back to My Groups</Link>
            </Button>
          </CardFooter>
        </Card>
      )
    }

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select(`
        id,
        name,
        description,
        created_at,
        invite_code
      `)
      .eq('id', groupId)
      .single();

    if (groupError) {
      console.error("Error fetching group:", groupError);
      return <GroupErrorDisplay />;
    }

    if (!group) {
      return <GroupErrorDisplay />;
    }

    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select(`
        id,
        role,
        user_id
      `)
      .eq('group_id', groupId);

    if (membersError) {
      console.error("Error fetching members:", membersError);
      return <GroupErrorDisplay />;
    }

    let memberProfiles: MemberProfile[] = [];
    if (members && members.length > 0) {
      const memberIds = members.map(member => member.user_id);

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', memberIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }

      memberProfiles = members.map(member => {
        const profile = profiles?.find(p => p.id === member.user_id) || {
          name: 'Unknown User',
          avatar_url: null
        };

        return {
          id: member.id,
          user_id: member.user_id,
          role: member.role,
          name: profile.name,
          avatar_url: profile.avatar_url
        };
      });
    }

    const { data: studyLogs, error: logsError } = await supabase
      .from('study_logs')
      .select(`
        id,
        subject,
        minutes,
        created_at,
        user_id
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (logsError) {
      console.error("Error fetching study logs:", logsError);
      // Continue with empty logs
    }

    // Map study logs to include user info
    const logsWithUserInfo: StudyLog[] = (studyLogs || []).map(log => {
      const member = memberProfiles.find(m => m.user_id === log.user_id);
      return {
        id: log.id,
        subject: log.subject,
        minutes: log.minutes,
        created_at: log.created_at,
        user_id: log.user_id,
        user_name: member?.name || 'Unknown User',
        user_avatar: member?.avatar_url || null
      };
    });

    const fullGroup = {
      ...group,
      group_members: memberProfiles
    };

    return (
      <>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{fullGroup.name}</h1>
          <Button variant="outline" size="icon" asChild>
            <Link href="/groups">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Group Invite</CardTitle>
              <CardDescription>Share this code to invite others</CardDescription>
            </CardHeader>
            <CardContent>
              <GroupInviteCode inviteCode={fullGroup.invite_code} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Group Members</CardTitle>
              <CardDescription>People in this study group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fullGroup.group_members && fullGroup.group_members.length > 0 ? (
                  fullGroup.group_members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No members found</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest study sessions in this group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logsWithUserInfo.length > 0 ? (
                  logsWithUserInfo.map((log) => (
                    <div key={log.id} className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {log.user_avatar ? (
                          <img
                            src={log.user_avatar}
                            alt={log.user_name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <Users className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{log.user_name}</p>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Studied <span className="font-medium">{log.subject}</span> for {log.minutes} minutes
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  } catch (error) {
    console.error("Unexpected error in GroupDetails:", error);
    return <GroupErrorDisplay />;
  }
}

function GroupDetailsSkeleton() {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-10" />
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default async function GroupDetailsPage({ params }: { params: { id: string } }) {
  // Await the params to fix the error
  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12">
      <Suspense fallback={<GroupDetailsSkeleton />}>
        <GroupDetails groupId={id} />
      </Suspense>
    </div>
  )
}
