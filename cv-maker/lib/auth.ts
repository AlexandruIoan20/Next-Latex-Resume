'use server'; 

import db from "./db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionUser = { 
    id: number; 
    firstName: string; 
    lastName: string; 
    email: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> { 
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value; 

    if(!sessionId) return null; 

    const statement = db.prepare(`SELECT u.id, u.firstName, u.lastName, u.email, s.expiresAt
        FROM sessions s
        JOIN users u ON s.userId = u.id
        WHERE s.id = ?     
    `); 

    const user = statement.get(sessionId) as (SessionUser & { expiresAt: number }) | undefined;

    if(!user || user.expiresAt < Date.now()) { 
        return null; 
    }

    return { 
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    }
}

export async function logoutUser() {
    const cookieStore = await cookies(); 
    const sessionId = cookieStore.get("session_id")?.value;

    if(sessionId) {
        const statement = db.prepare("DELETE FROM sessions WHERE id = ?");
        statement.run(sessionId);
    }

    cookieStore.delete("session_id"); 
    redirect("/login"); 
}