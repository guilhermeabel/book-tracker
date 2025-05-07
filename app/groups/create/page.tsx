import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CreateGroupForm } from "./create-group-form"

export default async function CreateGroupPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create a Study Group</CardTitle>
          <CardDescription>Start a new group to study with others.</CardDescription>
        </CardHeader>
        <CreateGroupForm userId={user.id} />
      </Card>
    </div>
  )
} 
