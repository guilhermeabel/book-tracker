"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useJoinGroup } from "@/lib/hooks/use-join-group"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function JoinGroupPage() {
	const router = useRouter()
	const [groupCode, setGroupCode] = useState("")
	const { mutate: joinGroup, isPending } = useJoinGroup()

	const handleJoinGroup = () => {
		if (!groupCode.trim()) return

		joinGroup({
			groupCode: groupCode.trim(),
			onSuccess: () => router.push('/')
		})
	}

	return (
		<div className="container max-w-md mx-auto py-12">
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
								disabled={isPending}
							/>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" onClick={() => router.back()} disabled={isPending}>
						Back
					</Button>
					<Button onClick={handleJoinGroup} disabled={isPending || !groupCode.trim()}>
						{isPending ? "Joining..." : "Join Group"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
} 
