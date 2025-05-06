"use client"

import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
	return (
		<div className="container max-w-md mx-auto py-12">
			<div className="mb-4">
				<SignInForm />
			</div>
			<p className="text-center text-sm text-muted-foreground">
				Don't have an account?{" "}
				<a href="/auth/signup" className="text-primary hover:underline">
					Sign up
				</a>
			</p>
		</div>
	)
} 
