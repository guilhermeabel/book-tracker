"use client"

import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"

export default function AuthPage() {
  return (
    <div className="container max-w-md mx-auto py-12">
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Suspense fallback={<div className="animate-pulse h-[350px] bg-muted rounded-lg"></div>}>
            <SignInForm />
          </Suspense>
          {/* <p className="text-center text-sm text-muted-foreground mt-4">
            <Link href="/auth/reset-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </p> */}
        </TabsContent>
        <TabsContent value="signup">
          <Suspense fallback={<div className="animate-pulse h-[350px] bg-muted rounded-lg"></div>}>
            <SignUpForm />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
