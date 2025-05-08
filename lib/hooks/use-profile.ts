"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './use-auth'

export interface UserProfile {
  id: string
  name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export function useUserProfile() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const supabase = createClientComponentClient()
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading,
    isFetched,
    error,
    refetch
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        // Check if this is just a "no data" error, which is expected for new users
        if (error.code === 'PGRST116') {
          // This is the "no rows returned" error code - expected for new users
          return null
        }
        
        // Log other unexpected errors
        console.error('Error fetching profile:', error)
        return null
      }
      
      return data
    },
    enabled: !!user && isAuthenticated && !isAuthLoading,
  })

  const updateProfile = useMutation({
    mutationFn: async (newProfileData: { name: string; avatar_url?: string | null }) => {
      if (!user) throw new Error('User not authenticated')
      
      // Try updating first
      let { data, error } = await supabase
        .from('profiles')
        .update(newProfileData)
        .eq('id', user.id)
        .select()
        .single()
      
      // If no rows updated (profile doesn't exist yet), insert instead
      if (error && error.code === 'PGRST116') {
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            ...newProfileData
          })
          .select()
          .single()
        
        if (insertError) throw insertError
        data = insertData
      } else if (error) {
        throw error
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] })
    }
  })

  // Check if the profile exists and has a name
  const hasProfile = !!profile
  
  // Only set hasName to false when we've fetched the profile and confirmed
  // it doesn't have a name. During loading, keep it undefined.
  const hasName = isFetched ? !!profile?.name : undefined

  // Helper for precisely checking if we need to show the profile setup
  const needsProfileSetup = isFetched && !hasName

  return {
    profile,
    isLoading,
    isFetched,
    error,
    updateProfile,
    refetch,
    hasProfile,
    hasName,
    needsProfileSetup
  }
} 
