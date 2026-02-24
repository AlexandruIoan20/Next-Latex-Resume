'use server'

import db from "@/lib/db";

export async function createCV(userId: number) { 
    const statement = db.prepare(`
        INSERT INTO resumes (userId) VALUES (?)
    `);
    const result = statement.run(userId);

    return result.lastInsertRowid;
}   