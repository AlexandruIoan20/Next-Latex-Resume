"use client"; 

import ExperiencesForm from "./experiences-form";
import EducationForm from "./education-form";
import ProjectForm from "./projects-form";
import { Education, Experience, Project, Course, Language } from "@/types";
import CoursesForm from "./courses-form";
import LanguagesForm from "./languages-form";

interface FormsListProps {
    resumeId: number;
    previousExperience: Experience[];
    previousEducation: Education[], 
    previousProjects: Project[], 
    previousCourses: Course[], 
    previousLanguages: Language[], 
}

export default function FormsList ({ resumeId, previousExperience, previousEducation, previousProjects, previousCourses, previousLanguages }: FormsListProps) { 
    console.log("FormsList rendered with resumeId:", resumeId);
    return ( 
        <>
            <ExperiencesForm resumeId = { resumeId } previousExperience = { previousExperience } />
            <EducationForm resumeId = { resumeId } previousEducation = { previousEducation } />
            <ProjectForm resumeId = { resumeId } previousProjects = { previousProjects } />
            <CoursesForm resumeId = { resumeId } previousCourses = { previousCourses }/>
            <LanguagesForm resumeId = { resumeId } previousLanguages = { previousLanguages } />
        </>
    )
}