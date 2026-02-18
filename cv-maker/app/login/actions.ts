'use server'

import db from "@/lib/db";

export async function loginUser(formData: FormData) { 
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

    return { 
        success: true,
        message: `Welcome back, ${user.firstName}!`
    }   
}