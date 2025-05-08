"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useJoinGroup } from "@/lib/hooks/use-join-group"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
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
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Join Group</h1>
				<Button variant="outline" size="icon" asChild>
					<Link href="#" onClick={() => router.back()}>
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
			</div>

			<div className="space-y-6">
				<p className="text-muted-foreground">Enter the group code to join a study group.</p>

				<form onSubmit={(e) => { e.preventDefault(); handleJoinGroup(); }} className="space-y-6">
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

					<div className="flex justify-end">
						<Button type="submit" disabled={isPending || !groupCode.trim()}>
							{isPending ? "Joining..." : "Join Group"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
} 
