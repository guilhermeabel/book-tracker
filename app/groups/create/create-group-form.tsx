'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateInviteCode } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface CreateGroupFormProps {
  userId: string
}

export function CreateGroupForm({ userId }: CreateGroupFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [createdGroup, setCreatedGroup] = useState<{ name: string, inviteCode: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const supabase = createClientComponentClient()

  const copyToClipboard = async () => {
    if (createdGroup) {
      await navigator.clipboard.writeText(createdGroup.inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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

      setCreatedGroup({ name, inviteCode })
      toast.success("Group created successfully!")
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error("Failed to create group. Please try again.")
      setIsLoading(false)
    }
  }

  if (createdGroup) {
    return (
      <Card className="border-green-100 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
        <CardHeader>
          <CardTitle>Group Created Successfully!</CardTitle>
          <CardDescription>Share this invite code with others to join your group</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Group Name</Label>
            <p className="font-medium">{createdGroup.name}</p>
          </div>

          <div>
            <Label>Invite Code</Label>
            <div className="flex items-center mt-1 space-x-2">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border font-mono text-lg font-bold tracking-wider">{createdGroup.inviteCode}</div>
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
                {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ClipboardIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/groups")} className="w-full">
            Go to My Groups
          </Button>
        </CardFooter>
      </Card>
    )
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
