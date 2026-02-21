import FormsList from "./(components)/forms-list";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getExperiences, getEducation, getProjects, getCourses, getLanguages, getInterests } from "./actions";
import { Course, Education, Experience, Interest, Language, Project } from "@/types";

interface PageProps { 
    params: Promise<{ resumeId: number }>;
}

export default async function InformationsPage ({ params }: PageProps) {
    const currentUser = await getCurrentUser(); 
    if(!currentUser) redirect("/login"); 

    const resolvedParams = await params; 
    const resumeId = Number(resolvedParams.resumeId);
    
    const previousExperience: Experience[] = await getExperiences(resumeId);
    const previousEducation: Education[] = await getEducation(resumeId); 
    const previousProjects: Project[] = await getProjects(resumeId); 
    const previousCourses: Course[] = await getCourses(resumeId); 
    const previousLanguages: Language[] = await getLanguages(resumeId); 
    const previousInterests: Interest[] = await getInterests(resumeId); 

    console.log("InformationsPage rendered with resumeId:", resumeId);

    return ( 
        <div className = "bg-zinc-950 min-h-screen">
            <FormsList 
                resumeId = { resumeId }
                previousCourses = { previousCourses } 
                previousLanguages = { previousLanguages }
                previousExperience = { previousExperience } 
                previousEducation = { previousEducation } 
                previousProjects = { previousProjects } 
                previousInterests = { previousInterests }
            />
        </div>
    )
}; 