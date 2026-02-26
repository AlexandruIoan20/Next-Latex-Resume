'use server'

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { toSqlDate, fromSqlDate } from "@/lib/dateTransformer";
import { BackendEducation, BackendExperience, Education, Resume, Experience, Project, BackendCourse, Course, Language, Interest, Ability } from "@/types";
import { ResumeSections } from "@/lib/constants";

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

const projectSchema = z.array( 
    z.object({ 
        id: z.number().optional(), 
        resumeId: z.number().optional(), 
        title: z.string().min(1, "Title is required"), 
        description: z.string(), 
        link: z.string(), 
        techStack: z.string(), 
    })
); 

const courseSchema = z.array(
    z.object({ 
        id: z.number().optional(),
        resumeId: z.number().optional(),
        title: z.string().min(1, "Title is required"),
        institution: z.string().min(1, "Institution is required"),
        startDate: z.coerce.date().refine(date => date <= new Date(), "Start date cannot be in the future").optional().nullable(), 
        finishDate: z.coerce.date().refine(date => date <= new Date(), "Finish date cannot be in the future").optional().nullable(),
    })
); 

const languageSchema = z.array(
    z.object({ 
        id: z.number().optional(),
        resumeId: z.number().optional(),
        language: z.string().min(1, "Language is required"),
        level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
    })
); 

const interestSchema = z.array(
    z.object({
        id: z.number().optional(),
        resumeId: z.number().optional(),
        title: z.string().min(1, "Interest title is required"),
    })
)

const abilitySchema = z.array(
    z.object({ 
        id: z.number().optional(),
        resumeId: z.number().optional(),
        title: z.string().min(1, "Ability title is required"),
        level: z.enum(["0", "1", "2", "3", "4", "5", "6"]),
    })
)

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
        console.error(error); 
        return { 
            success: false, 
            message: "An error occured while adding education."
        }
    }
}

export async function getProjects(resumeId: number): Promise<Project[]> { 
    const statement = db.prepare(`SELECT * FROM projects WHERE resumeId = ?`); 
    const projects = statement.all(resumeId) as Project[]; 

    return projects; 
}

export async function addProject(formData: FormData, resumeId: number) { 
    console.log("Start adding projects for resumeId: ", resumeId); 
    const projectString = formData.get("projects") as string; 
    if(!projectString) return { success: false, message: "No projects data provided" }; 

    try { 
        const rawJson = JSON.parse(projectString); 
        const validation = projectSchema.safeParse(rawJson); 
        console.log("Validation result: ", validation.success); 

        if(!validation.success) { 
            console.error("Validation error: ", validation.error.format()); 
            return { success: false, message: "Invalid project data." }; 
        }

        const projectsArray = validation.data; 
        console.log({ projectsArray }); 
        const deleteOld = db.prepare(`DELETE FROM projects WHERE resumeId = ?`); 
        const insertNew = db.prepare(`INSERT INTO projects (resumeId, title, description, link, techStack) VALUES (?, ?, ?, ?, ?)`); 

        const runTransaction = db.transaction((data) => { 
            deleteOld.run(resumeId); 
            for (const p of data) { 
                insertNew.run(
                    resumeId, 
                    p.title, 
                    p.description, 
                    p.link, 
                    p.techStack, 
                )   
            }
        }); 

        runTransaction(projectsArray); 

        console.log("Projects added successfully for resumeId: ", resumeId); 
        revalidatePath(`/create-cv/${resumeId}/informations`);
        return {
            success: true,
            message: "Project added successfully!"
        }
    } catch(error) { 
        console.error(error); 
        return { 
            success: false, 
            message: "An error occured while adding projects."
        }
    }
}

export async function getCourses(resumeId: number): Promise<Course[]> {
    const statement = db.prepare("SELECT * FROM courses WHERE resumeId = ?");
    let courses: BackendCourse[] = statement.all(resumeId) as BackendCourse[]; 

    let parsedCourses: Course[] = [];
    for(const course of courses) {
        try {
            let startDate, finishDate; 
            if(course.finishDate === "Present") finishDate = null;
            else if(course.finishDate) finishDate = fromSqlDate(course.finishDate);

            if(course.startDate) startDate = fromSqlDate(course.startDate);
            else startDate = undefined;
            
            const parsed = courseSchema.parse([{
                title: course.title,
                institution: course.institution,
                startDate, 
                finishDate
            }])[0] as Course;
            
            parsedCourses.push(parsed);
        } catch(error) {
            console.error(`Error parsing course with id ${course.id}:`, error);
        }
    }

    return parsedCourses;
}

export async function addCourses(formData: FormData, resumeId: number) {
    console.log("Adding courses for resumeId:", resumeId);
    const coursesString = formData.get("courses") as string;
    console.log("Received courses string:", coursesString);
    
    if(!coursesString) return { success: false, message: "No courses data provided." };

    try { 
        let rawJson = JSON.parse(coursesString);
        const validation = courseSchema.safeParse(rawJson);
        
        console.log("Raw courses data:", rawJson);
        console.log("Validation result:", validation.success);
        
        if(!validation.success) {
            console.error("Validation errors:", validation.error.format());
            return { success: false, message: "Invalid courses data." };
        }

        const coursesArray = validation.data; 
        console.log("Validated courses data:", coursesArray);
        
        const deleteOld = db.prepare(`DELETE FROM courses WHERE resumeId = ?`);
        const insertNew = db.prepare(`INSERT INTO courses (resumeId, title, institution, startDate, finishDate) VALUES (?, ?, ?, ?, ?)`);

        const runTransaction = db.transaction((data) => { 
            deleteOld.run(resumeId);
            for(const course of data) {
                let startDate, finishDate; 
                if(course.finishDate === null) finishDate = "Present"; 
                else if(course.finishDate) finishDate = toSqlDate(course.finishDate);

                if(course.startDate) startDate = toSqlDate(course.startDate);
                else startDate = null;

                insertNew.run(
                    resumeId,
                    course.title,
                    course.institution,
                    startDate, 
                    finishDate
                );
            }
        }); 

        runTransaction(coursesArray);

        console.log(`Courses added successfully for resumeId ${resumeId}!`);
        revalidatePath(`/create-cv/${resumeId}/informations`);
        return {
            success: true,
            message: "Courses added successfully!"
        }
    } catch(error) { 
        console.error("Error adding courses:", error);
        return {
            success: false,
            message: "An error occurred while adding courses."
        }
    }
}

export async function getLanguages(resumeId: number): Promise<Language[]> { 
    const statement = db.prepare(`SELECT * FROM languages WHERE resumeId = ? ORDER BY sortOrder ASC`); 
    const languages = statement.all(resumeId) as Language[]; 

    return languages; 
}

export async function addLanguages(formData: FormData, resumeId: number) {
    console.log("Adding languages for resumeId:", resumeId);
    const languagesString = formData.get("languages") as string;
    
    if(!languagesString) return { success: false, message: "No languages data provided." };

    try { 
        let rawJson = JSON.parse(languagesString);
        const validation = languageSchema.safeParse(rawJson);
        
        if(!validation.success) {
            console.error("Validation errors:", validation.error.format());
            return { success: false, message: "Invalid languages data." };
        }

        const languagesArray = validation.data; 
        
        const deleteOld = db.prepare(`DELETE FROM languages WHERE resumeId = ?`);
        const insertNew = db.prepare(`INSERT INTO languages (resumeId, language, level, sortOrder) VALUES (?, ?, ?, ?)`);

        const runTransaction = db.transaction((data) => { 
            deleteOld.run(resumeId);
            
            for(const lang of data) {
                insertNew.run(
                    resumeId,
                    lang.language,
                    lang.level,
                    lang.sortOrder // Inserăm indexul pe care l-am setat din client
                );
            }
        }); 

        runTransaction(languagesArray);

        console.log(`Languages added successfully for resumeId ${resumeId}!`);
        revalidatePath(`/create-cv/${resumeId}/informations`);
        return {
            success: true,
            message: "Languages added successfully!"
        }
    } catch(error) { 
        console.error("Error adding languages:", error);
        return {
            success: false,
            message: "An error occurred while adding languages."
        }
    }
}

export async function getInterests(resumeId: number): Promise<Interest[]> {
    // Interogare simplă, ordonată după sortOrder
    const statement = db.prepare("SELECT * FROM interests WHERE resumeId = ? ORDER BY sortOrder ASC");
    const interests = statement.all(resumeId) as Interest[]; 

    return interests;
}

export async function addInterests(formData: FormData, resumeId: number) {
    console.log("Adding interests for resumeId:", resumeId);
    const interestsString = formData.get("interests") as string;
    
    if(!interestsString) return { success: false, message: "No interests data provided." };

    try { 
        let rawJson = JSON.parse(interestsString);
        const validation = interestSchema.safeParse(rawJson);
        
        if(!validation.success) {
            console.error("Validation errors:", validation.error.format());
            return { success: false, message: "Invalid interests data." };
        }

        const interestsArray = validation.data; 
        
        const deleteOld = db.prepare(`DELETE FROM interests WHERE resumeId = ?`);
        const insertNew = db.prepare(`INSERT INTO interests (resumeId, title) VALUES (?, ?)`);

        const runTransaction = db.transaction((data) => { 
            deleteOld.run(resumeId);
            
            for(const interest of data) {
                insertNew.run(
                    resumeId,
                    interest.title,
                );
            }
        }); 

        runTransaction(interestsArray);

        console.log(`Interests added successfully for resumeId ${resumeId}!`);
        revalidatePath(`/create-cv/${resumeId}/informations`);
        return {
            success: true,
            message: "Interests added successfully!"
        };
    } catch(error) { 
        console.error("Error adding interests:", error);
        return {
            success: false,
            message: "An error occurred while adding interests."
        };
    }
}

export async function getAbilities(resumeId: number): Promise<Ability[]> {
    const statement = db.prepare(`SELECT * FROM abilities WHERE resumeId = ?`);
    const abilities = statement.all(resumeId) as Ability[]; 

    return abilities;
}

export async function addAbilities(formData: FormData, resumeId: number) {
    console.log("Adding abilities for resumeId:", resumeId);
    const abilitiesString = formData.get("abilities") as string;
    
    if(!abilitiesString) return { success: false, message: "No abilities data provided." };

    try { 
        let rawJson = JSON.parse(abilitiesString);
        
        const validation = abilitySchema.safeParse(rawJson);
        
        if(!validation.success) {
            console.error("Validation errors:", validation.error.format());
            return { success: false, message: "Invalid abilities data." };
        }

        const abilitiesArray = validation.data; 
        
        const deleteOld = db.prepare(`DELETE FROM abilities WHERE resumeId = ?`);
        const insertNew = db.prepare(`INSERT INTO abilities (resumeId, title, level) VALUES (?, ?, ?)`);

        const runTransaction = db.transaction((data) => { 
            deleteOld.run(resumeId);
            
            for(const ability of data) {
                insertNew.run(
                    resumeId,
                    ability.title,
                    ability.level
                );
            }
        }); 

        runTransaction(abilitiesArray);

        console.log(`Abilities added successfully for resumeId ${resumeId}!`);
        revalidatePath(`/create-cv/${resumeId}/informations`);
        return {
            success: true,
            message: "Abilities added successfully!"
        };
    } catch(error) { 
        console.error("Error adding abilities:", error);
        return {
            success: false,
            message: "An error occurred while adding abilities."
        };
    }
}

export const renameSection = async (resumeId: number, sectionTitle: string, newTitle: string) => { 
    console.log(`[renameSection] START - resumeId: ${resumeId}, sectionTitle: "${sectionTitle}", newTitle: "${newTitle}"`);

    const columnMap: Record<string, string> = {
        [ResumeSections.experiences]: "experiencesTitle",
        [ResumeSections.education]: "educationTitle",
        [ResumeSections.projects]: "projectsTitle",
        [ResumeSections.courses]: "coursesTitle",
        [ResumeSections.languages]: "languagesTitle",
        [ResumeSections.interests]: "interestsTitle",
        [ResumeSections.abilities]: "abilitiesTitle",
    };

    const targetColumn = columnMap[sectionTitle];
    
    console.log(`[renameSection] Mapped column: ${targetColumn}`);

    if (!targetColumn) {
        console.warn(`[renameSection] WARNING - Invalid section title provided: "${sectionTitle}"`);
        return { success: false, message: "Invalid section title provided." };
    }

    try {
        const query = `UPDATE resumes SET ${targetColumn} = ? WHERE id = ?`;
        
        console.log(`[renameSection] Executing query: ${query}`);
        
        const statement = db.prepare(query); 
        const info = statement.run(newTitle, resumeId); 
        
        console.log(`[renameSection] Query result (info):`, info);

        if (info.changes === 0) {
            console.log(`[renameSection] FAIL - No rows updated (changes = 0). Resume ID ${resumeId} might not exist.`);
            return { success: false, message: "Resume not found or no changes made." }; 
        }

        console.log(`[renameSection] SUCCESS - Section renamed to "${newTitle}"`);
        return { success: true, message: "Section name changed successfully!" };
        
    } catch (error) {
        console.error(`[renameSection] ERROR - Database exception:`, error);
        return { success: false, message: "A database error occurred." };
    }
}