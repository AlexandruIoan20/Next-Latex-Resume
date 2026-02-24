'use server'

import db from "@/lib/db";
import { Resume } from "@/types";

export async function createCV(userId: number) { 
    const statement = db.prepare(`
        INSERT INTO resumes (userId) VALUES (?)
    `);
    const result = statement.run(userId);

    return result.lastInsertRowid;
}   

export const getResume = async (resumeId: number): Promise<Resume | undefined> => {
    const statement = db.prepare('SELECT * from resumes where ID = ?');
    
    const resume = statement.get(resumeId) as Resume; 
    
    return resume;
}