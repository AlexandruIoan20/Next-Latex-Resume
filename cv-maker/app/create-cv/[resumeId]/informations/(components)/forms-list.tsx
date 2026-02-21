"use client"; 

import ExperiencesForm from "./experiences-form";
import EducationForm from "./education-form";
import { Education, Experience } from "@/types";

interface FormsListProps {
    resumeId: number;
    previousExperience: Experience[];
    previousEducation: Education[], 
}

export default function FormsList ({ resumeId, previousExperience, previousEducation }: FormsListProps) { 
    console.log("FormsList rendered with resumeId:", resumeId);
    return ( 
        <>
            <ExperiencesForm resumeId = { resumeId } previousExperience = { previousExperience } />
            <EducationForm resumeId = { resumeId } previousEducation = { previousEducation } />
        </>
    )
}