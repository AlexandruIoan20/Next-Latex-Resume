import * as z from "zod"

export const experienceSchema = z.object({ 
    experiences: z.array(z.object({
        title: z.string().min(1, "Title is required"),
        city: z.string().min(1, "City is required"),
        employer: z.string().min(1, "Employer is required"),
        startDate: z.date().refine(date => date <= new Date(), "Start date cannot be in the future").optional(), 
        finishDate: z.date().refine(date => date <= new Date(), "Finish date cannot be in the future").optional(),
        description: z.string()
    }))
}); 