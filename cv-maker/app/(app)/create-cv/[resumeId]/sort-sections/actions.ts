"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export const updateSectionsOrder = async (
  resumeId: number, 
  newOrder: { sectionId: string; index: number }[]
) => {
  try {
    const getIndex = (id: string) => {
      const item = newOrder.find((sec) => sec.sectionId === id);
      return item !== undefined ? item.index : -1;
    };
    const experiencesIdx = getIndex("experiences");
    const educationIdx = getIndex("education");
    const projectsIdx = getIndex("projects");
    const coursesIdx = getIndex("courses");
    const languagesIdx = getIndex("languages");
    const interestsIdx = getIndex("interests");
    const abilitiesIdx = getIndex("abilities");

    const statement = db.prepare(`
      UPDATE resumes 
      SET 
        experiencesIndex = ?, 
        educationIndex = ?, 
        projectsIndex = ?, 
        coursesIndex = ?, 
        languagesIndex = ?, 
        interestsIndex = ?, 
        abilitiesIndex = ?
      WHERE id = ?
    `);

    const info = statement.run(
      experiencesIdx,
      educationIdx,
      projectsIdx,
      coursesIdx,
      languagesIdx,
      interestsIdx,
      abilitiesIdx,
      resumeId
    );

    if (info.changes === 0) {
      return { 
        success: false, 
        message: "Eroare: CV-ul nu a putut fi găsit în baza de date." 
      };
    }
    
    revalidatePath(`/create-cv/${resumeId}`); 

    return { 
      success: true, 
      message: "Ordinea secțiunilor a fost actualizată cu succes!" 
    };

  } catch (error) {
    console.error("[updateSectionsOrder] Eroare la nivel de DB:", error);
    return { 
      success: false, 
      message: "A apărut o eroare pe server la salvarea ordinii." 
    };
  }
};