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
    console.log('No user found, returning empty groups');
    return []
  }
  
  console.log('Fetching memberships for user:', user.id);
  
  // First query - get memberships
  const { data: memberships, error: membershipError } = await supabase
    .from('group_members')
    .select('*') // Select all columns for debugging
    .eq('user_id', user.id)
  
  console.log('Memberships query result:', { memberships, membershipError });
  
  if (membershipError) {
    console.error('Error fetching memberships:', membershipError);
    throw membershipError
  }
  
  if (!memberships?.length) {
    console.log('No memberships found, returning empty groups');
    return []
  }
  
  const groupIds = memberships.map(m => m.group_id)
  console.log('Group IDs to fetch:', groupIds);
  
  // Second query - get groups
  const { data: groups, error: groupsError } = await supabase
    .from('groups')
    .select('*')
    .in('id', groupIds)
  
  console.log('Groups query result:', { groups, groupsError });
  
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
