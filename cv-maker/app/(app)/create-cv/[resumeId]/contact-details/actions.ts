'use server'

import db from "@/lib/db";

export async function addContactDetails(formData: FormData, resumeId: number) { 
    console.log("Adding contact details for resumeId:", resumeId);
    const firstName = formData.get("firstName") as string; 
    const lastName = formData.get("lastName") as string; 
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const county = formData.get("county") as string;
    const rawBirthDate = formData.get("birthDate"); 
    const birthPlace = formData.get("birthPlace") as string
    const nationality = formData.get("nationality") as string;
    const civilStatus = formData.get("civilStatus") as string;
    const linkedIn = formData.get("linkedIn") as string;
    const personalWebsite = formData.get("personalWebsite") as string;

    const birthDate = rawBirthDate
        ? new Date(rawBirthDate as string).toISOString().split("T")[0]
        : null;

    const statement = db.prepare(`
        INSERT INTO contact_details (
            resumeId, firstName, lastName,  phoneNumber, address, city, county, birthDate, birthPlace, nationality, civilStatus, linkedIn, personalWebsite
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = statement.run(resumeId, firstName, lastName, phoneNumber, address, city, county, birthDate, birthPlace, nationality, civilStatus, linkedIn, personalWebsite); 

    console.log(result); 

    return { 
        success: true,
        message: "Contact details added successfully"
    }
}