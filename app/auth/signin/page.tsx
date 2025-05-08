"use client"

import { SignInForm } from "@/components/auth/sign-in-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Suspense } from "react"

export default function SignInPage() {
	return (
		<div className="container max-w-md mx-auto py-12">
			<div className="mb-4">
				<Suspense
					fallback={
						<Card>
							<CardHeader>
								<CardTitle>Sign In</CardTitle>
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
					<SignInForm />
				</Suspense>
			</div>
			<div className="space-y-2 text-center text-sm">
				<p className="text-muted-foreground">
					Don't have an account?{" "}
					<Link href="/auth/signup" className="text-primary hover:underline">
						Sign up
					</Link>
				</p>
				{/* <p className="text-muted-foreground">
					<Link href="/auth/reset-password" className="text-primary hover:underline">
						Forgot your password?
					</Link>
				</p> */}
			</div>
		</div>
	)
} 
