import FormsList from "./(components)/forms-list";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getExperiences, getEducation, getProjects, getCourses} from "./actions";
import { Course, Education, Experience, Project } from "@/types";

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

    console.log("InformationsPage rendered with resumeId:", resumeId);

    return ( 
        <div className = "bg-zinc-950 min-h-screen">
            <FormsList resumeId = { resumeId } previousCourses = { previousCourses } previousExperience = { previousExperience } previousEducation = { previousEducation } previousProjects = { previousProjects } />
        </div>
    )
}; 