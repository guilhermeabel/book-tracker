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
  isCurrentUser: boolean
}

type Group = {
  id: string
  name: string
}

type StudyLog = {
  id: string
  subject: string
  minutes: number
  created_at: string
  group_id: string | null
  user_id: string
  profiles?: {
    id: string
    name: string | null
    avatar_url: string | null
  }
}

const fetchActivity = async (): Promise<ActivityItem[]> => {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []
  
  // Get user's groups
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
  
  // Get group names for reference
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
  
  // Fetch study logs from user's groups
  const { data: studyLogs, error: studyLogsError } = await supabase
    .from('study_logs')
    .select('id, subject, minutes, created_at, group_id, user_id')
    .in('group_id', groupIds)
    .order('created_at', { ascending: false })
    .limit(20)
  
  if (studyLogsError) {
    console.error('Error fetching study logs:', studyLogsError)
    return []
  }

  // Get unique user IDs from study logs
  const userIds = [...new Set(studyLogs?.map(log => log.user_id) || [])]
  
  // Fetch user profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, avatar_url')
    .in('id', userIds)

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
    return []
  }

  // Create a map of user profiles
  const profileMap = Object.fromEntries(
    (profiles || []).map(profile => [profile.id, {
      id: profile.id,
      name: profile.name || null,
      avatar_url: profile.avatar_url || null
    }])
  )

  // Transform study logs to activity items
  const studyLogActivities: ActivityItem[] = (studyLogs || []).map((log) => {
    const isCurrentUser = log.user_id === user.id;
    const profile = profileMap[log.user_id]
    const userName = isCurrentUser ? 'You' : profile?.name || `User ${log.user_id.substring(0, 6)}...`;
    
    return {
      id: `study-${log.id}`,
      type: 'study_log',
      user: {
        id: log.user_id,
        name: userName,
        avatar_url: profile?.avatar_url || null
      },
      created_at: log.created_at,
      group: log.group_id ? groupMap[log.group_id] : null,
      subject: log.subject,
      minutes: log.minutes,
      isCurrentUser
    }
  })
  
  // Fetch recent group joins
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
  
  // Transform joins to activity items
  const joinActivities: ActivityItem[] = (recentJoins || []).map((join) => {
    // Use simple user ID handling without trying to fetch profiles
    const isCurrentUser = join.user_id === user.id;
    const userName = isCurrentUser ? 'You' : `User ${join.user_id.substring(0, 6)}...`;
    
    return {
      id: `join-${join.id}`,
      type: 'joined_group',
      user: {
        id: join.user_id,
        name: userName,
        avatar_url: null
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
