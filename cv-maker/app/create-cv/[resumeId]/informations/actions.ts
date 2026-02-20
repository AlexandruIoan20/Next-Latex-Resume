'use server'

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { toSqlDate } from "@/lib/dateTransformer";

const experienceSchema = z.array(z.object({
    title: z.string().min(1, "Title is required"),
    city: z.string().min(1, "City is required"),
    employer: z.string().min(1, "Employer is required"),
    startDate: z.coerce.date().refine(date => date <= new Date(), "Start date cannot be in the future").optional(), 
    finishDate: z.coerce.date().refine(date => date <= new Date(), "Finish date cannot be in the future").optional(),
    description: z.string()
}));

export async function addExperiences(formData: FormData, resumeId: number) {
    console.log("Adding experiences for resumeId:", resumeId);
    const experiencesString = formData.get("experiences") as string;
    console.log("Received experiences string:", experiencesString);
    if(!experiencesString) return { success: false, message: "No experiences data provided." };

    try { 
        const rawJson = JSON.parse(experiencesString);
        const validation = experienceSchema.safeParse(rawJson);
        console.log("Raw experiences data:", rawJson);
        console.log("Validation result:", validation.success);
        if(!validation.success) {
            console.error("Validation errors:", validation.error.format());
            return { success: false, message: "Invalid experiences data." };
        }

        const experiencesArray = validation.data;
        console.log("Validated experiences data:", experiencesArray);
        const deleteOld = db.prepare(`DELETE FROM experiences WHERE resumeId = ?`);
        const insertNew = db.prepare(`INSERT INTO experiences (resumeId, title, city, employer, startDate, finishDate, description) VALUES (?, ?, ?, ?, ?, ?, ?)`);

        const runTransaction = db.transaction((data) => { 
            deleteOld.run(resumeId);
            for(const exp of data) {
                insertNew.run(
                    resumeId,
                    exp.title,
                    exp.city,
                    exp.employer,
                    exp.startDate ? toSqlDate(exp.startDate) : null,
                    exp.finishDate ? toSqlDate(exp.finishDate) : null,
                    exp.description
                );
            }
        }); 

        runTransaction(experiencesArray);

        console.log(`Experiences added successfully for resumeId ${resumeId}!`);
        revalidatePath(`/create-cv/${resumeId}/informations`);
        return {
            success: true,
            message: "Experiences added successfully!"
        }
    } catch(error) { 
        console.error("Error adding experiences:", error);
        return {
            success: false,
            message: "An error occurred while adding experiences."
        }
    }
}
