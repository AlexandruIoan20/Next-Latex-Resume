"use client"; 

import ExperiencesForm from "./experiences-form";

export default function FormsList ({ resumeId}: { resumeId: number }) { 
    console.log("FormsList rendered with resumeId:", resumeId);
    return ( 
        <ExperiencesForm resumeId = { resumeId } />
    )
}