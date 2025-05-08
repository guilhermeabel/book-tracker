"use client"

import { SignInForm } from "@/components/auth/sign-in-form"
import Link from "next/link"

export default function SignInPage() {
	return (
		<div className="container max-w-md mx-auto py-12">
			<div className="mb-4">
				<SignInForm />
			</div>
			<div className="space-y-2 text-center text-sm">
				<p className="text-muted-foreground">
					Don't have an account?{" "}
					<Link href="/auth/signup" className="text-primary hover:underline">
						Sign up
					</Link>
				</p>
				<p className="text-muted-foreground">
					<Link href="/auth/reset-password" className="text-primary hover:underline">
						Forgot your password?
					</Link>
				</p>
			</div>
		</div>
	)
} 
