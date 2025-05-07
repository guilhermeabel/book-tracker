import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"

export type GroupMember = {
  id: string
  name: string
  avatar_url: string | null
  hours: number
  isCurrentUser: boolean
}

export type GroupDetails = {
  id: string
  name: string
  description: string
  memberCount: number
  studyHours: number
  members: GroupMember[]
}

export function useGroup(groupId: string) {
  const supabase = createClientComponentClient()

  return useQuery({
    queryKey: ['group', groupId],
    queryFn: async () => {
      // Get group details
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()

      if (groupError) throw groupError

      // Get group members
      const { data: members, error: membersError } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId)

      if (membersError) throw membersError

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      // Get profiles for all members
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', members.map(m => m.user_id))

      if (profilesError) throw profilesError

      // Get study logs for all members in this group
      const { data: studyLogs, error: studyLogsError } = await supabase
        .from('study_logs')
        .select('user_id, minutes')
        .eq('group_id', groupId)

      if (studyLogsError) throw studyLogsError

      // Calculate total hours
      const totalHours = studyLogs.reduce((acc, log) => acc + (log.minutes / 60), 0)

      // Process members data
      const processedMembers = profiles.map(profile => {
        const memberLogs = studyLogs.filter(log => log.user_id === profile.id)
        const memberHours = memberLogs.reduce((acc, log) => acc + (log.minutes / 60), 0)

        return {
          id: profile.id,
          name: profile.name,
          avatar_url: profile.avatar_url,
          hours: Math.round(memberHours),
          isCurrentUser: profile.id === user?.id
        }
      })

      return {
        id: group.id,
        name: group.name,
        description: group.description,
        memberCount: processedMembers.length,
        studyHours: Math.round(totalHours),
        members: processedMembers
      } as GroupDetails
    }
  })
} 
