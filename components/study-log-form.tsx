"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useGroupsStore } from "@/lib/stores/groups-store"
import { studyLogSchema, type StudyLogFormData } from "@/lib/validations/study-log"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { BookOpen, Clock, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

export default function StudyLogForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { groups, isLoading: isLoadingGroups, fetchGroups } = useGroupsStore()
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StudyLogFormData>({
    resolver: zodResolver(studyLogSchema),
    defaultValues: {
      subject: "",
      description: "",
      minutes: 0,
      group: "",
    }
  })

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const onSubmit = async (data: StudyLogFormData) => {
    try {
      setIsSubmitting(true)
      
      const response = await fetch("/api/study-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          group: data.group || null, // Convert empty string to null
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to log study session")
      }

      // Reset form and show success message
      reset()
      toast.success("Study session logged successfully!")
      
      // Refresh the page to show new data
      router.refresh()
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to log study session. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingGroups) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Groups...</CardTitle>
          <CardDescription>Please wait while we fetch your groups.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Let's join a group!</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <p>Join a group to start tracking your study progress with others!</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/groups/join">
              Join a Group
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Study Session</CardTitle>
        <CardDescription>Record your study progress to compete with your groups.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <Input
                id="subject"
                placeholder="Enter the subject you studied"
                {...register("subject")}
                disabled={isSubmitting}
              />
            </div>
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="minutes">Study Time (minutes)</Label>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Input
                id="minutes"
                type="number"
                placeholder="How long did you study?"
                {...register("minutes", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
            </div>
            {errors.minutes && (
              <p className="text-sm text-red-500">{errors.minutes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Group</Label>
            <Controller
              name="group"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.group && (
              <p className="text-sm text-red-500">{errors.group.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Share what you learned or key takeaways..."
              {...register("description")}
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging..." : "Log Study Session"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
