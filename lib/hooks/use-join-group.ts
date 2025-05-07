"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type JoinGroupParams = {
  groupCode: string
  onSuccess?: () => void
}

const joinGroupWithCode = async ({ groupCode }: JoinGroupParams) => {
  const supabase = createClientComponentClient()
  const { data: user } = await supabase.auth.getUser()
  
  if (!user?.user) {
    throw new Error('You must be logged in to join a group')
  }
  
  // Get the group ID from the invite code - using proper filter syntax
  const { data: groups, error: groupError } = await supabase
    .from('groups')
    .select('id, name')
    .eq('invite_code', groupCode)
  
  if (groupError) throw groupError
  
  // Check if any group was found with that code
  if (!groups || groups.length === 0) {
    throw new Error('Invalid group code')
  }
  
  const group = groups[0]
  
  // Check if user is already a member of this group
  const { data: existingMembership, error: membershipCheckError } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', group.id)
    .eq('user_id', user.user.id)
  
  if (membershipCheckError) {
    throw membershipCheckError
  }
  
  if (existingMembership && existingMembership.length > 0) {
    throw new Error('You are already a member of this group')
  }
  
  // Add the user to the group
  const { error: joinError } = await supabase
    .from('group_members')
    .insert({
      group_id: group.id,
      user_id: user.user.id,
      role: 'member'
    })
    
  if (joinError) throw joinError
  
  return group
}

export function useJoinGroup() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: joinGroupWithCode,
    onSuccess: (data, variables) => {
      // Show success message with group name if available
      const groupName = data.name || 'the group';
      toast.success(`Successfully joined ${groupName}!`);
      
      // Invalidate all queries to force a refresh of application data
      queryClient.invalidateQueries();
      
      // Add a slight delay before navigation to allow for cache invalidation
      setTimeout(() => {
        variables.onSuccess?.()
      }, 100);
    },
    onError: (error) => {
      console.error('Error joining group:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to join group. Please try again.')
    }
  })
}

