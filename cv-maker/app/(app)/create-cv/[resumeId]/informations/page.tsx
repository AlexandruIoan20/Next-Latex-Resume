import FormsList from "./(components)/forms-list";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getExperiences, getEducation, getProjects, getCourses, getLanguages, getInterests, getAbilities } from "./actions";
import { Ability, Course, Education, Experience, Interest, Language, Project, Resume } from "@/types";

import { verifyCVWithUser } from "@/app/(app)/actions";

import { getResume } from "../../actions";

import CVPagination from "../../(components)/cv-pagination";

interface PageProps { 
    params: Promise<{ resumeId: number }>;
}

export default async function InformationsPage ({ params }: PageProps) {
    const currentUser = await getCurrentUser(); 
    if(!currentUser) redirect("/login"); 

    const resolvedParams = await params; 
    const resumeId = Number(resolvedParams.resumeId);

    const verifyCV = await verifyCVWithUser(resumeId, currentUser.id)
    if(!verifyCV) redirect(""); 

    const resume: Resume | undefined = await getResume(resumeId); 
    
    const previousExperience: Experience[] = await getExperiences(resumeId);
    const previousEducation: Education[] = await getEducation(resumeId); 
    const previousProjects: Project[] = await getProjects(resumeId); 
    const previousCourses: Course[] = await getCourses(resumeId); 
    const previousLanguages: Language[] = await getLanguages(resumeId); 
    const previousInterests: Interest[] = await getInterests(resumeId); 
    const previousAbilities: Ability[] = await getAbilities(resumeId); 

    console.log("InformationsPage rendered with resumeId:", resumeId);

    return ( 
        <div className = "bg-zinc-950 min-h-screen">
            <FormsList 
                resumeId = { resumeId }
                resume = { resume }
                previousCourses = { previousCourses } 
                previousLanguages = { previousLanguages }
                previousExperience = { previousExperience } 
                previousEducation = { previousEducation } 
                previousProjects = { previousProjects } 
                previousInterests = { previousInterests }
                previousAbilities = { previousAbilities }
            />

            <CVPagination 
                linkLeft = { `/create-cv/${resumeId}/contact-details` }
                linkRight = { `/create-cv/${resumeId}/sort-sections` }
            />
        </div>
    )
}; 