"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const resetPasswordSchema = z.object({
	email: z.string().email("Invalid email address"),
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [isEmailSent, setIsEmailSent] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const supabase = createClientComponentClient()
	const searchParams = useSearchParams()
	const router = useRouter()

	// Check for error parameters that might have been passed from middleware
	useEffect(() => {
		const error = searchParams.get('error')
		const message = searchParams.get('message')

		if (error === 'expired') {
			setErrorMessage(message || 'Your password reset link has expired. Please request a new one.')
		}
	}, [searchParams])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
	})

	const onSubmit = async (data: ResetPasswordFormData) => {
		try {
			setIsLoading(true)
			setErrorMessage(null)

			// Get the site URL from environment or fallback to origin
			let siteUrl = process.env.NEXT_PUBLIC_SITE_URL
			if (!siteUrl && typeof window !== 'undefined') {
				siteUrl = window.location.origin
			}

			// The redirectTo should point to the root URL - middleware will handle redirection
			const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
				redirectTo: `${siteUrl}/`,
			})

			if (error) {
				console.error('Reset password error:', error)
				throw error
			}

			setIsEmailSent(true)
			toast.success("Password reset link sent to your email")
		} catch (error: any) {
			console.error("Reset password error:", error)

			// For security, we don't want to expose if an email exists or not
			// So we show a success message regardless of the outcome
			setIsEmailSent(true)
			toast.success("If your email is registered, you'll receive a password reset link")
		} finally {
			setIsLoading(false)
		}
	}

	if (isEmailSent) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Check Your Email</CardTitle>
					<CardDescription>
						We've sent a password reset link to your email
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Please check your email inbox and follow the instructions to reset your password.
						If you don't see the email, please check your spam folder.
					</p>
					<p className="mt-4 text-sm text-muted-foreground">
						The password reset link will expire after 1 hour.
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Reset Password</CardTitle>
				<CardDescription>Enter your email to receive a password reset link</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit(onSubmit)}>
				<CardContent className="space-y-4">
					{errorMessage && (
						<Alert variant="destructive" className="mb-4">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>
								{errorMessage}
							</AlertDescription>
						</Alert>
					)}
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email.message}</p>
						)}
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" disabled={isLoading} className="w-full">
						{isLoading ? "Sending..." : "Send Reset Link"}
					</Button>
				</CardFooter>
			</form>
		</Card>
	)
} 
