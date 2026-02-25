'use server'

import db from "@/lib/db";
import { Resume } from "@/types";

export async function getResumes(userId: number) {
    try {
        const statement = db.prepare(`SELECT * FROM resumes WHERE userId = ?`);
        const resumes = statement.all(userId) as Resume[];

        return resumes;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function renameCV(resumeId: number, title: string) { 
    try { 
        const statement = db.prepare(`UPDATE resumes SET title = ? WHERE id = ?`); 
        const info = statement.run(title, resumeId); 

        if(info.changes === 0) return { success: false, message: "The CV was not found" }; 

        return { success: true, message: "CV's name was changed successfully!" }; 
    } catch(error) { 
        console.log(error); 
        return { success: false, message: "An error occured while changing the cv title." }; 
    }
}

export async function verifyCVWithUser(resumeId: number,  userId: number) { 
    try { 
        const findCVStatement = db.prepare('SELECT * FROM resumes WHERE id = ? and userId = ?'); 
        const CV: Resume= findCVStatement.get(resumeId, userId) as Resume; 
        
        if(!CV) return { success: false, message: "This CV is not available for you." } 
        return { success: true, message: "CV found." } 
    } catch(error) { 
        console.error(error); 
        return { success: false, message: "An error occured while checking the CV." }; 
    }
}