import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function JoinGroupPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [groupCode, setGroupCode] = useState("")
	const supabase = createClientComponentClient()

	const handleJoinGroup = async () => {
		if (!groupCode.trim()) {
			toast.error("Please enter a group code")
			return
		}

		try {
			setIsLoading(true)

			// First, get the group ID from the code
			const { data: group, error: groupError } = await supabase
				.from('groups')
				.select('id')
				.eq('invite_code', groupCode)
				.single()

			if (groupError) throw groupError
			if (!group) {
				toast.error("Invalid group code")
				return
			}

			// Then, add the user to the group
			const { error: joinError } = await supabase
				.from('group_members')
				.insert({
					group_id: group.id,
					user_id: (await supabase.auth.getUser()).data.user?.id,
					role: 'member'
				})

			if (joinError) throw joinError

			toast.success("Successfully joined the group!")
			router.push('/groups')
		} catch (error) {
			console.error('Error joining group:', error)
			toast.error("Failed to join group. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container px-4 max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Join a Group</CardTitle>
					<CardDescription>Enter the group code to join a study group.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="groupCode">Group Code</Label>
							<Input
								id="groupCode"
								placeholder="Enter the group code"
								value={groupCode}
								onChange={(e) => setGroupCode(e.target.value)}
								disabled={isLoading}
							/>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" onClick={() => router.back()}>
						Back
					</Button>
					<Button onClick={handleJoinGroup} disabled={isLoading}>
						{isLoading ? "Joining..." : "Join Group"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
} 
