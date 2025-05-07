import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export type Group = {
  id: string
  name: string
  description: string | null
  created_by: string
  created_at: string
  updated_at: string
}

const fetchGroups = async (): Promise<Group[]> => {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  // First query - get memberships
  const { data: memberships, error: membershipError } = await supabase
    .from('group_members')
    .select('*') // Select all columns for debugging
    .eq('user_id', user.id)
  
  if (membershipError) {
    console.error('Error fetching memberships:', membershipError);
    throw membershipError
  }
  
  if (!memberships?.length) {
    return []
  }
  
  const groupIds = memberships.map(m => m.group_id)
  
  // Second query - get groups
  const { data: groups, error: groupsError } = await supabase
    .from('groups')
    .select('*')
    .in('id', groupIds)
  
  if (groupsError) {
    console.error('Error fetching groups:', groupsError);
    throw groupsError
  }
  
  return groups || []
}

export function useGroups() {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
  })
  
  const invalidateGroups = () => {
    queryClient.invalidateQueries({ queryKey: ['groups'] })
  }
  
  return {
    ...query,
    invalidateGroups,
  }
} 
