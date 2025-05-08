"use client"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import Link from "next/link"
import { redirect } from "next/navigation"

const isResetEnabled = false

export default function ResetPasswordPage() {

	if (!isResetEnabled) {
		redirect('/')
	}

	return (
		<div className="container max-w-md mx-auto py-12">
			<div className="mb-4">
				<ResetPasswordForm />
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
