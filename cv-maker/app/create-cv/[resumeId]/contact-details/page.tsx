import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContactDetailsForm from "./contact-details-form";

interface PageProps {
  params: Promise<{ resumeId: number }>;
}

export default async function ContactDetailsPage({ params }: PageProps) {
    const currentUser = await getCurrentUser();

    const resolvedParams = await params; 
    const resumeId = Number(resolvedParams.resumeId);
    
    if (!currentUser) {
        redirect("/login");
    }

    return (
        <ContactDetailsForm resumeId={resumeId} />
    );
}