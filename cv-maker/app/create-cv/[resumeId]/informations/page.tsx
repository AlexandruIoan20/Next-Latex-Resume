import FormsList from "./(components)/forms-list";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getExperiences, getEducation } from "./actions";
import { Education, Experience } from "@/types";

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

    console.log("InformationsPage rendered with resumeId:", resumeId);

    return ( 
        <div className = "bg-zinc-950 min-h-screen">
            <FormsList resumeId = { resumeId } previousExperience = { previousExperience } previousEducation = { previousEducation } />
        </div>
    )
}; 