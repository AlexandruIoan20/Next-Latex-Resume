"use client"; 

import ExperiencesForm from "./experiences-form";
import EducationForm from "./education-form";
import ProjectForm from "./projects-form";
import { Education, Experience, Project } from "@/types";

interface FormsListProps {
    resumeId: number;
    previousExperience: Experience[];
    previousEducation: Education[], 
    previousProjects: Project[], 
}

export default function FormsList ({ resumeId, previousExperience, previousEducation, previousProjects }: FormsListProps) { 
    console.log("FormsList rendered with resumeId:", resumeId);
    return ( 
        <>
            <ExperiencesForm resumeId = { resumeId } previousExperience = { previousExperience } />
            <EducationForm resumeId = { resumeId } previousEducation = { previousEducation } />
            <ProjectForm resumeId = { resumeId } previousProjects = { previousProjects } />
        </>
    )
}