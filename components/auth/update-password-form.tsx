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
	const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
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

	// Process recovery token
	useEffect(() => {
		const processRecoveryToken = async () => {
			try {
				// Get the token from the URL
				const token = searchParams.get('token')
				const type = searchParams.get('type')

				if (!token || type !== 'recovery') {
					setStatus('error')
					setError('Recovery parameters are missing or invalid. Please use the link from your email.')
					return
				}

				// Use verifyOtp with token and recovery type
				const { error } = await supabase.auth.verifyOtp({
					token_hash: token,
					type: 'recovery',
				})

				if (error) {
					console.error('Error verifying recovery token:', error)
					setStatus('error')

					// Handle specific error messages
					if (error.message.includes('expired')) {
						setError('This recovery link has expired. Please request a new password reset link.')
					} else {
						setError('Invalid recovery link. Please request a new password reset.')
					}
					return
				}

				setStatus('ready')
			} catch (err) {
				console.error('Error processing recovery token:', err)
				setStatus('error')
				setError('An unexpected error occurred. Please try again.')
			}
		}

		processRecoveryToken()
	}, [searchParams, supabase.auth])

	const onSubmit = async (data: UpdatePasswordFormData) => {
		try {
			setIsLoading(true)

			// Update the user's password
			const { error } = await supabase.auth.updateUser({
				password: data.password,
			})

			if (error) {
				console.error('Error updating password:', error)
				throw error
			}

			toast.success("Password updated successfully")

			// Sign out after password reset
			await supabase.auth.signOut()

			// Redirect to sign-in page with success message
			router.push('/auth/signin?reset=success')
		} catch (error: any) {
			console.error("Error updating password:", error)
			toast.error(error.message || "Failed to update password. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	if (status === 'loading') {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Processing...</CardTitle>
					<CardDescription>
						Please wait while we verify your recovery link
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center py-4">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (status === 'error') {
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
				<CardTitle>Reset Your Password</CardTitle>
				<CardDescription>Create a new password for your account</CardDescription>
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
							autoComplete="new-password"
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
							autoComplete="new-password"
						/>
						{errors.confirmPassword && (
							<p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" disabled={isLoading} className="w-full">
						{isLoading ? "Updating..." : "Update Password"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	)
} 
