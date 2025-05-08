"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useUserProfile } from "@/lib/hooks/use-profile"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const profileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileSetupForm() {
	const { updateProfile } = useUserProfile()

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: "",
		},
	})

	async function onSubmit(data: ProfileFormData) {
		try {
			await updateProfile.mutateAsync({
				name: data.name,
			})
			toast.success("Profile updated successfully!")
		} catch (error) {
			console.error("Error updating profile:", error)
			toast.error("Failed to update profile. Please try again.")
		}
	}

	return (
		<Card className="border-primary/10 max-w-md w-full mx-auto">
			<CardHeader>
				<CardTitle>Set up your profile</CardTitle>
				<CardDescription>
					Please enter your name before you start joining or creating groups
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Your Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your name"
											{...field}
											autoComplete="name"
										/>
									</FormControl>
									<FormDescription>
										This will be displayed to other members in your groups
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={updateProfile.isPending}
						>
							{updateProfile.isPending ? "Saving..." : "Continue"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
} 
