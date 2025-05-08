"use client"

import { SignUpForm } from "@/components/auth/sign-up-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Suspense } from "react"

export default function SignUpPage() {
	return (
		<div className="container max-w-md mx-auto py-12">
			<div className="mb-4">
				<Suspense
					fallback={
						<Card>
							<CardHeader>
								<CardTitle>Sign Up</CardTitle>
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
					<SignUpForm />
				</Suspense>
			</div>

			<p className="text-center text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link href="/auth/signin" className="text-primary hover:underline">
					Sign in
				</Link>
			</p>
		</div>
	)
} 
