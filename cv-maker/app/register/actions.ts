'use server'

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addUser(formData: FormData) { 
    const firstName = formData.get('firstName') as string; 
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try { 
        const statement = db.prepare(`INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`); 
        statement.run(firstName, lastName, email, password);
        console.log(`User ${firstName} ${lastName} added successfully!`);
        revalidatePath('/register');
    } catch (error) { 
        console.error('Error adding user:', error);
    }
}