import { z } from "zod"

export const studyLogSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  minutes: z.number().min(1, "Study time must be at least 1 minute"),
  group: z.string().min(1, "Please select a group"),
})

export type StudyLogFormData = z.infer<typeof studyLogSchema>
