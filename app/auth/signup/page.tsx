"use client"

import { SignUpForm } from "@/components/auth/sign-up-form"

export default function SignUpPage() {
	return (
		<div className="container max-w-md mx-auto py-12">
			<div className="mb-4">
				<SignUpForm />
			</div>

			<p className="text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<a href="/auth/signin" className="text-primary hover:underline">
					Sign in
				</a>
			</p>

		</div>
	)
} 
