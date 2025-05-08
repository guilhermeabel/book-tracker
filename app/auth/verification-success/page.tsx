"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function VerificationSuccessPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [countdown, setCountdown] = useState(5)
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
	const [error, setError] = useState<string | null>(null)
	const [redirectPath, setRedirectPath] = useState('/')
	const supabase = createClientComponentClient()

	// Handle email verification
	useEffect(() => {
		const verifyEmail = async () => {
			try {
				// Get token from the URL (required for Supabase verification)
				const token = searchParams.get('token')

				if (!token) {
					setStatus('error')
					setError('Verification token is missing. Please try the verification link again.')
					return
				}

				// For Supabase email verification
				const { data, error } = await supabase.auth.verifyOtp({
					token_hash: token,
					type: 'signup',
				})

				if (error) {
					console.error('Error verifying email:', error)
					setStatus('error')
					setError(error.message || 'Failed to verify email. The link may have expired.')
					return
				}

				setStatus('success')
			} catch (err) {
				console.error('Error during verification:', err)
				setStatus('error')
				setError('An unexpected error occurred during verification.')
			}
		}

		verifyEmail()
	}, [searchParams, supabase])

	// Handle redirect countdown
	useEffect(() => {
		if (status !== 'success') return

		// Auto-redirect after 5 seconds
		const timer = setTimeout(() => {
			router.push(redirectPath)
		}, 5000)

		// Countdown timer
		const interval = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(interval)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => {
			clearTimeout(timer)
			clearInterval(interval)
		}
	}, [status, redirectPath, router])

	if (status === 'loading') {
		return (
			<div className="container max-w-md mx-auto py-12">
				<Card>
					<CardHeader>
						<CardTitle>Verifying your email...</CardTitle>
						<CardDescription>
							Please wait while we verify your email address
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-center p-4">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (status === 'error') {
		return (
			<div className="container max-w-md mx-auto py-12">
				<Card className="border-red-100 bg-red-50/20 dark:border-red-900/40 dark:bg-red-950/10">
					<CardHeader>
						<CardTitle>Verification Failed</CardTitle>
						<CardDescription>
							There was a problem verifying your email
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-red-500">{error}</p>
						<p className="mt-2 text-sm text-muted-foreground">
							Please try clicking the verification link again or contact support.
						</p>
					</CardContent>
					<CardFooter className="flex gap-2">
						<Button
							onClick={() => router.push('/auth/signin')}
							variant="outline"
							className="flex-1"
						>
							Go to Sign In
						</Button>
						<Button
							onClick={() => router.push('/')}
							className="flex-1"
						>
							Go to Home
						</Button>
					</CardFooter>
				</Card>
			</div>
		)
	}

	return (
		<div className="container max-w-md mx-auto py-12">
			<Card className="border-green-100 bg-green-50/20 dark:border-green-900/40 dark:bg-green-950/10">
				<CardHeader>
					<CardTitle>Email Verified Successfully!</CardTitle>
					<CardDescription>
						Your email has been verified and your account is now active
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center p-4">
						<div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-12 w-12 text-green-600 dark:text-green-300"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
					</div>
					<div className="text-center mt-4">
						<p className="text-sm text-muted-foreground">
							You will be redirected in {countdown} seconds...
						</p>
					</div>
				</CardContent>
				<CardFooter>
					<Button
						onClick={() => router.push(redirectPath)}
						className="w-full"
					>
						{'Continue'}
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
} 
