"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"
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
	const supabase = createClientComponentClient()

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

			// Get the site URL
			let siteUrl = process.env.NEXT_PUBLIC_SITE_URL
			if (!siteUrl) {
				siteUrl = window.location.origin
			}

			// Directly to update-password page with clean URL
			const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
				redirectTo: `${siteUrl}/auth/update-password`,
			})

			if (error) throw error

			setIsEmailSent(true)
			toast.success("Password reset link sent to your email")
		} catch (error) {
			console.error("Reset password error:", error)
			toast.error("Failed to send reset link. Please try again.")
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
