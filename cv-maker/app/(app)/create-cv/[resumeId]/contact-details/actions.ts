'use server'

import db from "@/lib/db";
import { BackendContactDetails, ContactDetails } from "@/types";

export async function getContactDetails(resumeId: number): Promise<ContactDetails | null> {
    try {
        const statement = db.prepare('SELECT * FROM contact_details WHERE resumeId = ?');
        const data: BackendContactDetails | null = statement.get(resumeId) as BackendContactDetails;

        if(!data) return null; 
        
        const frontEndData: ContactDetails = { ...data, birthDate: data.birthDate ? new Date(data?.birthDate) : undefined }
        return frontEndData; 
    } catch (error) {
        console.error("Error fetching contact details:", error);
        return null;
    }
}

export async function saveContactDetails(formData: FormData, resumeId: number) { 
    console.log("Saving contact details for resumeId:", resumeId);
    
    const firstName = formData.get("firstName") as string; 
    const lastName = formData.get("lastName") as string; 
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const county = formData.get("county") as string;
    const rawBirthDate = formData.get("birthDate"); 
    const birthPlace = formData.get("birthPlace") as string;
    const nationality = formData.get("nationality") as string;
    const civilStatus = formData.get("civilStatus") as string;
    const linkedIn = formData.get("linkedIn") as string;
    const personalWebsite = formData.get("personalWebsite") as string;

    const birthDate = rawBirthDate
        ? new Date(rawBirthDate as string).toISOString().split("T")[0]
        : null;

    try {
        const existing = db.prepare('SELECT id FROM contact_details WHERE resumeId = ?').get(resumeId);

        if (existing) {
            const statement = db.prepare(`
                UPDATE contact_details 
                SET firstName = ?, lastName = ?, phoneNumber = ?, address = ?, city = ?, county = ?, birthDate = ?, birthPlace = ?, nationality = ?, civilStatus = ?, linkedIn = ?, personalWebsite = ?
                WHERE resumeId = ?
            `);
            statement.run(firstName, lastName, phoneNumber, address, city, county, birthDate, birthPlace, nationality, civilStatus, linkedIn, personalWebsite, resumeId);
        } else {
            const statement = db.prepare(`
                INSERT INTO contact_details (
                    resumeId, firstName, lastName, phoneNumber, address, city, county, birthDate, birthPlace, nationality, civilStatus, linkedIn, personalWebsite
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            statement.run(resumeId, firstName, lastName, phoneNumber, address, city, county, birthDate, birthPlace, nationality, civilStatus, linkedIn, personalWebsite); 
        }

        return { 
            success: true,
            message: "Contact details saved successfully!"
        };
    } catch (error) {
        console.error("Database error:", error);
        return {
            success: false,
            message: "Failed to save contact details."
        };
    }
}