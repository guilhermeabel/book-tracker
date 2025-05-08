"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'

export type ActivityItem = {
  id: string
  type: 'study_log' | 'joined_group'
  user: {
    id: string
    name: string | null
    avatar_url: string | null
  }
  created_at: string
  group: {
    id: string
    name: string
  } | null
  subject?: string
  minutes?: number
  description?: string | null
  isCurrentUser: boolean
}

type Group = {
  id: string
  name: string
}

const fetchActivity = async (): Promise<ActivityItem[]> => {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  const { data: memberships, error: membershipError } = await supabase
    .from('group_members')
    .select('group_id')
    .eq('user_id', user.id)
  
  if (membershipError) {
    console.error('Error fetching memberships:', membershipError)
    return []
  }
  
  if (!memberships?.length) return []
  
  const groupIds = memberships.map(m => m.group_id)
  
  const { data: groups, error: groupsError } = await supabase
    .from('groups')
    .select('id, name')
    .in('id', groupIds)
  
  if (groupsError) {
    console.error('Error fetching groups:', groupsError)
    return []
  }
  
  const groupMap = Object.fromEntries(
    (groups || []).map((group: Group) => [group.id, { id: group.id, name: group.name }])
  )
  
  const { data: allGroupMembers, error: groupMembersError } = await supabase
    .from('group_members')
    .select('user_id, group_id')
    .in('group_id', groupIds)
  
  if (groupMembersError) {
    console.error('Error fetching group members:', groupMembersError)
    return []
  }
  
  const { data: recentJoins, error: joinsError } = await supabase
    .from('group_members')
    .select('id, joined_at, group_id, user_id')
    .in('group_id', groupIds)
    .order('joined_at', { ascending: false })
    .limit(10)
  
  if (joinsError) {
    console.error('Error fetching group joins:', joinsError)
    return []
  }
  
  const { data: studyLogs, error: studyLogsError } = await supabase
    .from('study_logs')
    .select('id, subject, minutes, description, created_at, group_id, user_id')
    .in('group_id', groupIds)
    .order('created_at', { ascending: false })
    .limit(20)
  
  if (studyLogsError) {
    console.error('Error fetching study logs:', studyLogsError)
    return []
  }

  const userIds = [...new Set([
    ...(allGroupMembers || []).map(member => member.user_id),
    ...(studyLogs || []).map(log => log.user_id),
    ...(recentJoins || []).map(join => join.user_id)
  ])]
  
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .in('id', userIds)
  
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
  }
  
  const profileMap: Record<string, any> = {}
  
  profiles?.forEach(profile => {
    const name = profile.name
    if (name) {
      profileMap[profile.id] = {
        id: profile.id,
        name,
        avatar_url: profile.avatar_url
      }
    }
  })
  
  if (user && !profileMap[user.id]) {
    profileMap[user.id] = {
      id: user.id,
      name: 'You',
      avatar_url: null
    }
  }
  
  const getUserName = (userId: string, isCurrentUser: boolean): string => {
    if (isCurrentUser) return 'You'
    return profileMap[userId]?.name || `User ${userId.substring(0, 4)}...`
  }

  const studyLogActivities: ActivityItem[] = (studyLogs || []).map(log => {
    const isCurrentUser = log.user_id === user.id
    const profile = profileMap[log.user_id]
    
    return {
      id: `study-${log.id}`,
      type: 'study_log',
      user: {
        id: log.user_id,
        name: getUserName(log.user_id, isCurrentUser),
        avatar_url: profile?.avatar_url || null
      },
      created_at: log.created_at,
      group: log.group_id ? groupMap[log.group_id] : null,
      subject: log.subject,
      minutes: log.minutes,
      description: log.description,
      isCurrentUser
    }
  })
  
  // Process join activities
  const joinActivities: ActivityItem[] = (recentJoins || []).map(join => {
    const isCurrentUser = join.user_id === user.id
    const profile = profileMap[join.user_id]
    
    return {
      id: `join-${join.id}`,
      type: 'joined_group',
      user: {
        id: join.user_id,
        name: getUserName(join.user_id, isCurrentUser),
        avatar_url: profile?.avatar_url || null
      },
      created_at: join.joined_at,
      group: join.group_id ? groupMap[join.group_id] : null,
      isCurrentUser
    }
  })
  
  // Combine and sort by date
  const allActivities = [...studyLogActivities, ...joinActivities]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20)
  
  return allActivities
}

export function useActivity() {
  return useQuery({
    queryKey: ['activity'],
    queryFn: fetchActivity,
  })
} 
