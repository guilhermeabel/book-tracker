"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const updatePasswordSchema = z.object({
	password: z.string().min(6, "Password must be at least 6 characters"),
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
})

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>

export function UpdatePasswordForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [isRecovery, setIsRecovery] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const supabase = createClientComponentClient()
	const searchParams = useSearchParams()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UpdatePasswordFormData>({
		resolver: zodResolver(updatePasswordSchema),
	})

	// Process recovery parameters and set up auth session
	useEffect(() => {
		const processRecoveryParams = async () => {
			try {
				// Check for recovery parameters
				const code = searchParams.get('code')
				const type = searchParams.get('type')

				if (type === 'recovery' || code) {
					setIsRecovery(true)

					// For the case when we're using PKCE flow
					if (code) {
						// This will exchange the code for a session
						const { error } = await supabase.auth.exchangeCodeForSession(code)

						if (error) {
							console.error('Error processing recovery:', error)
							setError('The recovery link is invalid or expired. Please request a new one.')
						}
					}
				}
			} catch (err) {
				console.error('Error processing recovery parameters:', err)
				setError('An error occurred while processing your recovery link.')
			}
		}

		processRecoveryParams()
	}, [searchParams, supabase.auth])

	const onSubmit = async (data: UpdatePasswordFormData) => {
		try {
			setIsLoading(true)

			const { error } = await supabase.auth.updateUser({
				password: data.password,
			})

			if (error) throw error

			toast.success("Password updated successfully")

			// Redirect to sign-in after successful password reset
			router.push("/auth/signin")
		} catch (error) {
			console.error("Update password error:", error)
			toast.error("Failed to update password. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	if (error) {
		return (
			<Card className="border-red-100 bg-red-50/20 dark:border-red-900/40 dark:bg-red-950/10">
				<CardHeader>
					<CardTitle>Recovery Link Error</CardTitle>
					<CardDescription>
						There was a problem with your recovery link
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-red-500">{error}</p>
					<p className="mt-2 text-sm text-muted-foreground">
						Please try requesting a new password reset link.
					</p>
				</CardContent>
				<CardFooter>
					<Button
						onClick={() => router.push('/auth/reset-password')}
						className="w-full"
					>
						Request New Link
					</Button>
				</CardFooter>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{isRecovery ? "Reset Your Password" : "Update Password"}</CardTitle>
				<CardDescription>{isRecovery
					? "Create a new password for your account"
					: "Enter your new password"}
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit(onSubmit)}>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="password">New Password</Label>
						<Input
							id="password"
							type="password"
							placeholder="Enter your new password"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-sm text-red-500">{errors.password.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Confirm Password</Label>
						<Input
							id="confirmPassword"
							type="password"
							placeholder="Confirm your new password"
							{...register("confirmPassword")}
						/>
						{errors.confirmPassword && (
							<p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" disabled={isLoading} className="w-full">
						{isLoading
							? (isRecovery ? "Resetting..." : "Updating...")
							: (isRecovery ? "Reset Password" : "Update Password")}
					</Button>
				</CardFooter>
			</form>
		</Card>
	)
} 
