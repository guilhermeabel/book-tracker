"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function OnboardingPage() {
	const [isLoading, setIsLoading] = useState(false)
	const [username, setUsername] = useState("")
	const router = useRouter()
	const supabase = createClientComponentClient()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const { data: { user } } = await supabase.auth.getUser()

			if (!user) {
				throw new Error("No user found")
			}

			const { error } = await supabase
				.from('profiles')
				.insert({
					id: user.id,
					name: username,
				})

			if (error) {
				throw error
			}

			toast.success("Profile created successfully!")
			router.push('/')
			router.refresh()
		} catch (error) {
			console.error('Error creating profile:', error)
			toast.error("Failed to create profile. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container max-w-lg mx-auto py-10">
			<Card>
				<CardHeader>
					<CardTitle>Welcome to StudyRats!</CardTitle>
					<CardDescription>
						Let's set up your profile to get started.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								placeholder="Enter your username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								disabled={isLoading}
								required
								minLength={3}
								maxLength={20}
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? "Creating profile..." : "Create Profile"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	)
} 
