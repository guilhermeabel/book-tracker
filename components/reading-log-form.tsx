"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Clock } from "lucide-react"
import { useState } from "react"

export default function ReadingLogForm() {
  const [bookTitle, setBookTitle] = useState("")
  const [description, setDescription] = useState("")
  const [minutes, setMinutes] = useState("")
  const [group, setGroup] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle the form submission, e.g., send to an API
    console.log({ bookTitle, description, minutes, group })

    // Reset form
    setBookTitle("")
    setDescription("")
    setMinutes("")
    setGroup("")

    // Show success message
    alert("Reading session logged successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Reading Session</CardTitle>
        <CardDescription>Record your reading progress to compete with your groups.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="book-title">Book Title</Label>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <Input
                id="book-title"
                placeholder="Enter the title of the book"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reading-time">Reading Time (minutes)</Label>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Input
                id="reading-time"
                type="number"
                placeholder="How long did you read?"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Group</Label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book-enthusiasts">Book Enthusiasts</SelectItem>
                <SelectItem value="sci-fi-lovers">Sci-Fi Lovers</SelectItem>
                <SelectItem value="mystery-readers">Mystery Readers</SelectItem>
                <SelectItem value="personal">Personal (No Group)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Notes (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Share your thoughts or what you learned..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Log Reading Session</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
