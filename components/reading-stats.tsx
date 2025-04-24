"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for the charts
const weeklyData = [
  { name: "Mon", hours: 1.5 },
  { name: "Tue", hours: 2.0 },
  { name: "Wed", hours: 0.5 },
  { name: "Thu", hours: 1.0 },
  { name: "Fri", hours: 2.5 },
  { name: "Sat", hours: 3.0 },
  { name: "Sun", hours: 2.0 },
]

const monthlyData = [
  { name: "Week 1", hours: 10 },
  { name: "Week 2", hours: 12 },
  { name: "Week 3", hours: 8 },
  { name: "Week 4", hours: 14 },
]

const bookData = [
  { name: "The Great Gatsby", hours: 8 },
  { name: "To Kill a Mockingbird", hours: 12 },
  { name: "1984", hours: 10 },
  { name: "Pride and Prejudice", hours: 14 },
  { name: "The Hobbit", hours: 18 },
]

export default function ReadingStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Statistics</CardTitle>
        <CardDescription>Track your reading habits over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="books">By Book</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => [`${value} hours`, "Reading Time"]} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">You read the most on Saturday (3 hours)</p>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value) => [`${value} hours`, "Reading Time"]} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              You read 44 hours this month, averaging 11 hours per week
            </p>
          </TabsContent>

          <TabsContent value="books">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: "Hours", position: "insideBottom", offset: -5 }} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`${value} hours`, "Reading Time"]} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              You spent the most time reading "The Hobbit" (18 hours)
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
