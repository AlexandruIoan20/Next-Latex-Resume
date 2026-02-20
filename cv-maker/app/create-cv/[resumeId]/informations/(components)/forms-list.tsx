"use client"; 

import ExperiencesForm from "./experiences-form";
import { Experience } from "@/types";

interface FormsListProps {
    resumeId: number;
    previousExperience: Experience[];
}

export default function FormsList ({ resumeId, previousExperience }: FormsListProps) { 
    console.log("FormsList rendered with resumeId:", resumeId);
    return ( 
        <ExperiencesForm resumeId = { resumeId } previousExperience = { previousExperience } />
    )
}