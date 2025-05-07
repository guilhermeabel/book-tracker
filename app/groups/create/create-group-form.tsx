'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateInviteCode } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface CreateGroupFormProps {
  userId: string
}

export function CreateGroupForm({ userId }: CreateGroupFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const inviteCode = generateInviteCode()

    try {
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name,
          description,
          created_by: userId,
          invite_code: inviteCode
        })
        .select()
        .single()

      if (groupError) throw groupError

      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: userId,
          role: 'admin'
        })

      if (memberError) throw memberError

      toast.success("Group created successfully!")
      router.push('/groups')
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error("Failed to create group. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Group Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter a name for your group"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe what your group is about"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Group"}
        </Button>
      </div>
    </form>
  )
} 
