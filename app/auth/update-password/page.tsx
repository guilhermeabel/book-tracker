"use client"

import { UpdatePasswordForm } from "@/components/auth/update-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"

export default function UpdatePasswordPage() {
	return (
		<div className="container max-w-md mx-auto py-12">
			<Suspense
				fallback={
					<Card>
						<CardHeader>
							<CardTitle>Update your password</CardTitle>
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
				<UpdatePasswordForm />
			</Suspense>
		</div>
	)
} 
