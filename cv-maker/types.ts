export type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export type Experience = {
  id: number;
  resumeId: number;
  title: string;
  city: string;
  employer: string;
  startDate?: Date |  undefined; 
  finishDate?: Date | undefined;
  description: string | null;
  sortOrder: number;
}

export type BackendExperience = {
  id: number;
  resumeId: number;
  title: string;
  city: string;
  employer: string;
  startDate?: string | undefined; 
  finishDate?: string | undefined;
  description: string | null;
  sortOrder: number;
}

export type BackendEducation = { 
  id: number; 
  resumeId: number; 
  degree: string; 
  school: string; 
  startDate?: string | undefined; 
  finishDate?: string | undefined; 
  sortOrder: number; 
}; 

export type Education = { 
  id: number; 
  resumeId: number; 
  degree: string; 
  school: string; 
  startDate?: Date | undefined; 
  finishDate?: Date | undefined; 
  sortOrder: number; 
}

export type Project = { 
  id: number; 
  resumeId: number; 
  title: string; 
  description?: string; 
  link?: string; 
  techStack?: string; 
  sortOrder: number; 
}

export type BackendCourse = { 
  id: number; 
  resumeId: number; 
  title: string; 
  institution: string; 
  startDate: string | undefined; 
  finishDate: string | undefined; 
}

export type Course = { 
  id: number; 
  resumeId: number; 
  title: string; 
  institution: string; 
  startDate: Date | undefined; 
  finishDate: Date | undefined; 
}

export type Language = {
  id: number;
  resumeId: number;
  language: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  sortOrder?: number;
}

export type Interest = { 
  id: number; 
  resumeId: number; 
  title: string; 
}

export type Ability = {
  id?: number;
  resumeId?: number;
  title: string;
  level: "0" | "1" | "2" | "3" | "4" | "5" | "6";
  sortOrder?: number;
}

export type Resume = { 
  id: number; 
  userId: number; 
  title: string; 
  template: string; 
  description?: string; 
}