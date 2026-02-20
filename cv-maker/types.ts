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


