"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { studyLogSchema, type StudyLogFormData } from "@/lib/validations/study-log"
import { zodResolver } from "@hookform/resolvers/zod"
import { BookOpen, Clock } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

export default function StudyLogForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<StudyLogFormData>({
    resolver: zodResolver(studyLogSchema),
    defaultValues: {
      subject: "",
      description: "",
      minutes: 0,
      group: "",
    }
  })

  const onSubmit = async (data: StudyLogFormData) => {
    try {
      console.log('Submitting form data:', data)
      
      const response = await fetch("/api/study-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()
      console.log('API Response:', responseData)

      if (!response.ok) {
        const errorMessage = responseData.error || "Failed to log study session"
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage
        })
        throw new Error(errorMessage)
      }

      reset()
      toast.success("Study session logged successfully!")
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to log study session. Please try again.")
    }
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
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="study-group-1">Study Group 1</SelectItem>
                    <SelectItem value="study-group-2">Study Group 2</SelectItem>
                    <SelectItem value="study-group-3">Study Group 3</SelectItem>
                    <SelectItem value="personal">Personal (No Group)</SelectItem>
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
