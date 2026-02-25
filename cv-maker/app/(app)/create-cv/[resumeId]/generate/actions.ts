'use server'

import db from "@/lib/db"; 

import { BackendExperience, BackendEducation, Project, BackendCourse, Ability, Interest, Language, Resume } from "@/types";

export const loadResume = async (resumeId: number): Promise<Resume | null> => {
    try {
        const statement = db.prepare('SELECT * from resumes WHERE id = ?');
        const resume = statement.get(resumeId) as Resume | undefined;
        return resume || null;
    } catch(error) {
        console.error(error);
        return null;
    }
}

const loadExperiences = async (resumeId: number): Promise<BackendExperience[]>  => { 
    try { 
        const statement = db.prepare('SELECT * from experiences WHERE resumeId = ?'); 
        const experiences = statement.all(resumeId) as BackendExperience[]; 

        return experiences
    } catch(error) { 
        console.error(error); 
        return[]; 
    }
}

export const loadEducation = async (resumeId: number): Promise<BackendEducation[]> => {
    try {
        const statement = db.prepare('SELECT * from education WHERE resumeId = ? ORDER BY sortOrder ASC');
        const education = statement.all(resumeId) as BackendEducation[];
        return education;
    } catch(error) {
        console.error(error);
        return [];
    }
}

export const loadProjects = async (resumeId: number): Promise<Project[]> => {
    try {
        const statement = db.prepare('SELECT * from projects WHERE resumeId = ? ORDER BY sortOrder ASC');
        const projects = statement.all(resumeId) as Project[];
        return projects;
    } catch(error) {
        console.error(error);
        return [];
    }
}

export const loadCourses = async (resumeId: number): Promise<BackendCourse[]> => {
    try {
        const statement = db.prepare('SELECT * from courses WHERE resumeId = ? ORDER BY sortOrder ASC');
        const courses = statement.all(resumeId) as BackendCourse[];
        return courses;
    } catch(error) {
        console.error(error);
        return [];
    }
}

export const loadLanguages = async (resumeId: number): Promise<Language[]> => {
    try {
        const statement = db.prepare('SELECT * from languages WHERE resumeId = ? ORDER BY sortOrder ASC');
        const languages = statement.all(resumeId) as Language[];
        return languages;
    } catch(error) {
        console.error(error);
        return [];
    }
}

export const loadInterests = async (resumeId: number): Promise<Interest[]> => {
    try {
        const statement = db.prepare('SELECT * from interests WHERE resumeId = ? ORDER BY sortOrder ASC');
        const interests = statement.all(resumeId) as Interest[];
        return interests;
    } catch(error) {
        console.error(error);
        return [];
    }
}

export const loadAbilities = async (resumeId: number): Promise<Ability[]> => {
    try {
        const statement = db.prepare('SELECT * from abilities WHERE resumeId = ? ORDER BY sortOrder ASC');
        const abilities = statement.all(resumeId) as Ability[];
        return abilities;
    } catch(error) {
        console.error(error);
        return [];
    }
}

export const loadContactData = async (resumeId: number) => { 
    try {
        const statement = db.prepare('SELECT * from contact_details WHERE resumeId = ?');
        const contactDetails = statement.get(resumeId);
        return contactDetails || null;
    } catch(error) { 
        console.error(error); 
        return null; 
    }
}


export const loadData = async (resumeId: number) => { 
    try {
        const [
            resume,
            contactDetails,
            experiences,
            education,
            projects,
            courses,
            languages,
            interests,
            abilities
        ] = await Promise.all([
            loadResume(resumeId), 
            loadContactData(resumeId),
            loadExperiences(resumeId),
            loadEducation(resumeId),
            loadProjects(resumeId),
            loadCourses(resumeId),
            loadLanguages(resumeId),
            loadInterests(resumeId),
            loadAbilities(resumeId)
        ]);

        return {
            resume,
            contactDetails,
            experiences,
            education,
            projects,
            courses,
            languages,
            interests,
            abilities
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}