import { getCurrentUser } from "@/lib/auth";
import { getResume } from "../../actions";

import { redirect } from "next/navigation";

import { Resume } from "@/types";
import ResumeSections from "./(components)/resume-sections";

import CVPagination from "../../(components)/cv-pagination";

interface PageProps { 
    params: Promise<{ resumeId: number }>;
}

export default async function SortSectionsPage ({ params }: PageProps) { 
    const currentUser = await getCurrentUser(); 
    if(!currentUser) redirect("/login"); 

    const resolvedParams = await params; 
    const resumeId = Number(resolvedParams.resumeId);

    const resume: Resume | undefined = await getResume(resumeId); 

    if(!resume) return null; 

    return ( 
        <>
            <ResumeSections resume = { resume } />
            <CVPagination
                linkLeft = { `/create-cv/${resumeId}/informations` } 
                linkRight = { `/create-cv/${resumeId}/generate` } 
            />
        </>
    )
}