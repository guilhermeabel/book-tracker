"use client"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

const isResetEnabled = false

export default function ResetPasswordPage() {
	if (!isResetEnabled) {
		redirect('/')
	}

	return (
		<div className="container max-w-md mx-auto py-12">
			<div className="mb-4">
				<Suspense
					fallback={
						<Card>
							<CardHeader>
								<CardTitle>Reset your password</CardTitle>
								<CardDescription>Loading...</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-center p-4">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
								</div>
							</CardContent>
						</Card>
					}
				>
					<ResetPasswordForm />
				</Suspense>
			</div>
			<p className="text-center text-sm text-muted-foreground">
				Remember your password?{" "}
				<Link href="/auth/signin" className="text-primary hover:underline">
					Sign in
				</Link>
			</p>
		</div>
	)
} 
