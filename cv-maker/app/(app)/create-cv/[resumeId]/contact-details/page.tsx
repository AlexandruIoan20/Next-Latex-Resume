import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContactDetailsForm from "./contact-details-form";
import CVPagination from "../../(components)/cv-pagination";
import { verifyCVWithUser } from "@/app/(app)/actions";

interface PageProps {
  params: Promise<{ resumeId: number }>;
}

export default async function ContactDetailsPage({ params }: PageProps) {
    const currentUser = await getCurrentUser();

    const resolvedParams = await params; 
    const resumeId = Number(resolvedParams.resumeId);
    
    if (!currentUser) redirect("/login");

    const verifyCV = await verifyCVWithUser(resumeId, currentUser.id)
    if(!verifyCV) redirect(""); 

    return (
        <>
            <ContactDetailsForm resumeId={resumeId} />
            <CVPagination linkRight = { `/create-cv/${resumeId}/informations` } />
        </>
    );
}