'use server'

import db from "@/lib/db";
import { cookies } from "next/headers";
import { nanoid } from "nanoid"; 
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "@/types";

export async function loginUser(formData: FormData) { 
    const currentUser = await getCurrentUser(); 
    if(currentUser) { 
        redirect("/"); 
    }
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined; 

    if(!user) { 
        return { 
            success: false, 
            message: "User with this email does not exist."
        }
    }; 

    if(user.password != password) { 
        return { 
            success: false, 
            message: "Incorrect password."
        }
    }

    const sessionId = nanoid(); 
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days session 

    db.prepare(`INSERT INTO sessions (id, userId, expiresAt) VALUES (?, ?, ?)`).run(sessionId, user.id, expiresAt);

    (await cookies()).set("session_id", sessionId, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(expiresAt), 
        path: "/"
    }); 

    return { 
        success: true,
        message: `Welcome back, ${user.firstName}!`
    }   
}