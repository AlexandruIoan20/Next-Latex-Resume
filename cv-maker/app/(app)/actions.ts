import db from "@/lib/db";
import { Resume } from "@/types";

export async function getResumes (userId: number) { 
    try { 
        const statement = db.prepare(`SELECT * FROM resumes WHERE userId = ?`); 
        const resumes = statement.all(userId) as Resume[]; 

        return resumes; 
    } catch(error) { 
        console.log(error); 
        return []; 
    }
}