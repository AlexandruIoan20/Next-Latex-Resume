"use client"; 

import ExperiencesForm from "./experiences-form";
import EducationForm from "./education-form";
import ProjectForm from "./projects-form";
import { Education, Experience, Project, Course, Language, Interest, Ability } from "@/types";
import CoursesForm from "./courses-form";
import LanguagesForm from "./languages-form";
import InterestsForm from "./interests-form";
import AbilitiesForm from "./abilities-form";

interface FormsListProps {
    resumeId: number;
    previousExperience: Experience[];
    previousEducation: Education[], 
    previousProjects: Project[], 
    previousCourses: Course[], 
    previousLanguages: Language[], 
    previousInterests: Interest[], 
    previousAbilities: Ability[], 
}

export default function FormsList ({ resumeId, previousExperience, previousEducation, previousProjects, previousCourses, previousAbilities, previousLanguages, previousInterests }: FormsListProps) { 
    console.log("FormsList rendered with resumeId:", resumeId);
    return ( 
        <>
            <ExperiencesForm resumeId = { resumeId } previousExperience = { previousExperience } />
            <EducationForm resumeId = { resumeId } previousEducation = { previousEducation } />
            <ProjectForm resumeId = { resumeId } previousProjects = { previousProjects } />
            <CoursesForm resumeId = { resumeId } previousCourses = { previousCourses }/>
            <LanguagesForm resumeId = { resumeId } previousLanguages = { previousLanguages } />
            <InterestsForm resumeId = { resumeId } previousInterests = { previousInterests } />
            <AbilitiesForm resumeId = { resumeId } previousAbilities = { previousAbilities } />
        </>
    )
}