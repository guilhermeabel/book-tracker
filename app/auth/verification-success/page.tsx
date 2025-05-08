"use client"


import { VerificationSuccessContent } from "@/components/auth/verification-success-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"

export default function VerificationSuccessPage() {
	return (
		<div className="container max-w-md mx-auto py-12">
			<Suspense
				fallback={
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
				}
			>
				<VerificationSuccessContent />
			</Suspense>
		</div>
	)
} 
