"use client";

import { useState } from "react";
import { 
  Briefcase, GraduationCap, FolderGit2, BookOpen, 
  Globe, Heart, Star, ChevronUp, ChevronDown, Save, Loader2
} from "lucide-react";
import { Resume } from "@/types";
import { updateSectionsOrder } from "../actions";
import { useRouter } from "next/navigation";

interface ResumeSectionProps {
  resume: Resume;
}

const DEFAULT_SECTIONS = [
  { id: "experiences", dbKey: "experiences", icon: Briefcase },
  { id: "education", dbKey: "education", icon: GraduationCap },
  { id: "projects", dbKey: "projects", icon: FolderGit2 },
  { id: "courses", dbKey: "courses", icon: BookOpen },
  { id: "abilities", dbKey: "abilities", icon: Star },
  { id: "languages", dbKey: "languages", icon: Globe },
  { id: "interests", dbKey: "interests", icon: Heart },
];

export default function ResumeSections({ resume }: ResumeSectionProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  const [sections, setSections] = useState(() => {
    const mappedSections = DEFAULT_SECTIONS.map((sec) => {
      // @ts-ignore
      const title = resume[`${sec.dbKey}Title`] || sec.id;
      // @ts-ignore
      const dbIndex = resume[`${sec.dbKey}Index`];
      
      return {
        ...sec,
        label: title,
        index: dbIndex !== undefined && dbIndex !== null ? dbIndex : -1,
      };
    });

    return mappedSections.sort((a, b) => {
      if (a.index === -1 && b.index === -1) return 0;
      if (a.index === -1) return 1;
      if (b.index === -1) return -1;
      return a.index - b.index;
    });
  });

  const moveUp = (currentIndex: number) => {
    if (currentIndex === 0) return; // Deja prima

    const newSections = [...sections];
    const temp = newSections[currentIndex - 1];
    newSections[currentIndex - 1] = newSections[currentIndex];
    newSections[currentIndex] = temp;

    setSections(newSections);
  };

  const moveDown = (currentIndex: number) => {
    if (currentIndex === sections.length - 1) return; 

    const newSections = [...sections];
    const temp = newSections[currentIndex + 1];
    newSections[currentIndex + 1] = newSections[currentIndex];
    newSections[currentIndex] = temp;

    setSections(newSections);
  };

  // Funcția de salvare către baza de date
  const handleSave = async () => {
    setIsSaving(true);
    
    // Generăm noul array cu noii indecși bazați pe poziția vizuală actuală
    const newOrder = sections.map((sec, index) => ({
      sectionId: sec.id,
      index: index,
    }));

    const response = await updateSectionsOrder(resume.id, newOrder);
    
    setIsSaving(false);
    if (response.success) {
      router.refresh();
    } else {
      console.error(response.message);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Ordonează Secțiunile</h1>
        <p className="text-zinc-400 mt-2">
          Folosește săgețile pentru a muta secțiunile mai sus sau mai jos, exact în ordinea în care vrei să apară pe CV.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isFirst = index === 0;
          const isLast = index === sections.length - 1;

          return (
            <div
              key={section.id}
              className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 transition-all hover:border-zinc-700"
            >
              {/* Partea stângă: Iconiță + Titlu */}
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-zinc-800">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-zinc-100 font-medium">{section.label}</span>
              </div>

              {/* Partea dreaptă: Controalele Sus/Jos */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveUp(index)}
                  disabled={isFirst}
                  className="p-2.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:cursor-not-allowed transition-all active:scale-95"
                  aria-label="Mută mai sus"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => moveDown(index)}
                  disabled={isLast}
                  className="p-2.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:cursor-not-allowed transition-all active:scale-95"
                  aria-label="Mută mai jos"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Butonul de Salvare Sticky pentru Mobil */}
      <div className="bottom-0 left-0 right-0 p-4 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800 z-40 flex justify-center">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 w-full max-w-2xl bg-violet-600 text-white py-3.5 px-6 rounded-full font-medium hover:bg-violet-500 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? "Se salvează..." : "Salvează Ordinea"}
        </button>
      </div>
    </div>
  );
}