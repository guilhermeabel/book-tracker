import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { create } from 'zustand'

type Group = {
  id: string
  name: string
  description: string | null
  created_by: string
  created_at: string
  updated_at: string
}

type GroupsState = {
  groups: Group[]
  isLoading: boolean
  error: string | null
  fetchGroups: () => Promise<void>
}

export const useGroupsStore = create<GroupsState>((set) => ({
  groups: [],
  isLoading: false,
  error: null,
  fetchGroups: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('name')

      if (error) throw error

      set({ groups: data || [], isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch groups',
        isLoading: false 
      })
    }
  }
})) 
