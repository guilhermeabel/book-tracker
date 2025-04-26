import { z } from "zod"

export const readingLogSchema = z.object({
  bookTitle: z.string().min(1, "Book title is required"),
  description: z.string().optional(),
  minutes: z.number().min(1, "Reading time must be at least 1 minute"),
  group: z.string().min(1, "Please select a group"),
})

export type ReadingLogFormData = z.infer<typeof readingLogSchema>
