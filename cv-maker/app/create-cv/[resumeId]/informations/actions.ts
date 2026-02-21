'use server'

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { toSqlDate, fromSqlDate } from "@/lib/dateTransformer";
import { BackendEducation, BackendExperience, Education, Experience } from "@/types";

const experienceSchema = z.array(z.object({
    title: z.string().min(1, "Title is required"),
    city: z.string().min(1, "City is required"),
    employer: z.string().min(1, "Employer is required"),
    startDate: z.coerce.date().refine(date => date <= new Date(), "Start date cannot be in the future").optional().nullable(), 
    finishDate: z.coerce.date().refine(date => date <= new Date(), "Finish date cannot be in the future").optional().nullable(),
    description: z.string()
}));

const educationSchema = z.array(
    z.object({ 
        id: z.number().optional(), 
        resumeId: z.number().optional(), 
        degree: z.string().min(1, "Degree is required!"), 
        school: z.string().min(1, "School is required!"), 
        startDate: z.coerce.date().refine(date => date <= new Date(), "Start date cannot be in the future").optional().nullable(), 
        finishDate: z.coerce.date().refine(date => date <= new Date(), "Finish date cannot be in the future").optional().nullable(),
    })
); 

export async function getExperiences(resumeId: number): Promise<Experience[]> {
    const statement = db.prepare("SELECT * FROM experiences WHERE resumeId = ?");
    let experiences: BackendExperience[] = statement.all(resumeId) as BackendExperience[]; 

    let parsedExperiences: Experience[] = [];
    for(const exp of experiences) {
        try {
            let startDate, finishDate; 
            if(exp.finishDate === "Present") finishDate = null;
            else if(exp.finishDate) finishDate = fromSqlDate(exp.finishDate);

            if(exp.startDate) startDate = fromSqlDate(exp.startDate);
            else startDate = undefined;
            const parsed = experienceSchema.parse([{
                title: exp.title,
                city: exp.city,
                employer: exp.employer,
                startDate, 
                finishDate,
                description: exp.description || ""
            }])[0] as Experience;
            parsedExperiences.push(parsed);
        } catch(error) {
            console.error(`Error parsing experience with id ${exp.id}:`, error);
        }
    }

    return parsedExperiences;
}

export async function addExperiences(formData: FormData, resumeId: number) {
    console.log("Adding experiences for resumeId:", resumeId);
    const experiencesString = formData.get("experiences") as string;
    console.log("Received experiences string:", experiencesString);
    if(!experiencesString) return { success: false, message: "No experiences data provided." };

    try { 
        let rawJson = JSON.parse(experiencesString);
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
                let startDate, finishDate; 
                if(exp.finishDate === null) finishDate = "Present"; 
                else if(exp.finishDate) finishDate = toSqlDate(exp.finishDate);

                if(exp.startDate) startDate = toSqlDate(exp.startDate);
                else startDate = null;

                insertNew.run(
                    resumeId,
                    exp.title,
                    exp.city,
                    exp.employer,
                    startDate, 
                    finishDate,
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

export async function getEducation(resumeId: number): Promise<Education[]> { 
    const statement = db.prepare(`SELECT * FROM education WHERE resumeId = ?`); 
    let education: BackendEducation[] = statement.all(resumeId) as BackendEducation[]; 

    let parsedEducation: Education[] = []; 
    for (const ed of education) { 
        try { 
            let startDate, finishDate; 
            if(ed.finishDate === "Present") finishDate = null;
            else if(ed.finishDate) finishDate = fromSqlDate(ed.finishDate);

            if(ed.startDate) startDate = fromSqlDate(ed.startDate);
            else startDate = undefined;

            const parsed = educationSchema.parse([{
                degree: ed.degree, 
                school: ed.school, 
                startDate, 
                finishDate, 
            }])[0] as Education; 

            parsedEducation.push(parsed); 
        } catch(error) { 
            console.error(`Error parsing education with id ${ed.id}:`, error)
        }
    }

    return parsedEducation; 
}


export async function addEducation(formData: FormData, resumeId: number)  {
    console.log("Start adding education for resumeId: ", resumeId); 
    const educationString = formData.get("education") as string; 
    if(!educationString) return { success: false, message: "No education data provided" }; 

    try { 
        const rawJson = JSON.parse(educationString);  
        console.log( rawJson ); 
        const validation = educationSchema.safeParse(rawJson); 
        console.log("Validation result: ", validation.success); 

        if(!validation.success) { 
            console.error("Validation errors: ", validation.error.format());  
            return { success: false, message: "Invalid education data." }; 
        }

        const educationArray = validation.data; 
        const deleteOld = db.prepare(`DELETE FROM education WHERE resumeId = ?`); 
        const insertNew = db.prepare(`INSERT into education (resumeId, degree, school, startDate, finishDate) VALUES (?, ?, ?, ?, ?)`); 

        const runTransaction = db.transaction((data) => { 
            deleteOld.run(resumeId); 
            for (const exp of data) { 
                let startDate, finishDate; 
                if(exp.finishDate === null) finishDate = "Present"; 
                else if(exp.finishDate) finishDate = toSqlDate(exp.finishDate); 

                if(exp.startDate) startDate = toSqlDate(exp.startDate); 
                else startDate = null; 

                insertNew.run(
                    resumeId, 
                    exp.degree, 
                    exp.school, 
                    startDate, 
                    finishDate
                )
            }
        }); 

        runTransaction(educationArray); 

        console.log("Education added successfully for resumeId: ", resumeId); 
        revalidatePath(`/create-cv/${resumeId}/informations`);

        return {
            success: true,
            message: "Education added successfully!"
        }
    } catch(error) { 
        console.log(error); 
        return { 
            success: false, 
            message: "An error occured while adding education"
        }
    }
}