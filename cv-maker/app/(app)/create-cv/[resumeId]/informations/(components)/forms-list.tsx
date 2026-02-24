"use client";

import { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  FolderGit2,
  BookOpen,
  Globe,
  Heart,
  Star,
  Pencil,
  Check,
  X
} from "lucide-react";

import { Tabs, TabsContent } from "@/components/ui/tabs";

import ExperiencesForm from "./(forms)/experiences-form";
import EducationForm from "./(forms)/education-form";
import ProjectForm from "./(forms)/projects-form";
import CoursesForm from "./(forms)/courses-form";
import LanguagesForm from "./(forms)/languages-form";
import InterestsForm from "./(forms)/interests-form";
import AbilitiesForm from "./(forms)/abilities-form";

// Componenta pe care am creat-o anterior pentru butoanele din stânga (desktop)
import EditableTab from "./editable-tab";

import {
  Education,
  Experience,
  Project,
  Course,
  Language,
  Interest,
  Ability,
  Resume,
} from "@/types";

import { renameSection } from "../actions"; 

interface FormsListProps {
  resumeId: number;
  resume: Resume | undefined, 
  previousExperience: Experience[];
  previousEducation: Education[];
  previousProjects: Project[];
  previousCourses: Course[];
  previousLanguages: Language[];
  previousInterests: Interest[];
  previousAbilities: Ability[];
} 

export default function FormsList({
  resumeId,
  resume, 
  previousExperience,
  previousEducation,
  previousProjects,
  previousCourses,
  previousAbilities,
  previousLanguages,
  previousInterests,
}: FormsListProps) {
  const INITIAL_SECTIONS = [
    { id: "experiences", label: "Experiences", viewLabel: resume?.experiencesTitle || "Experiences", icon: Briefcase },
    { id: "education", label: "Education", viewLabel: resume?.educationTitle || "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", viewLabel: resume?.projectsTitle || "Projects", icon: FolderGit2 },
    { id: "courses", label: "Courses", viewLabel: resume?.coursesTitle || "Courses", icon: BookOpen },
    { id: "abilities", label: "Abilities", viewLabel: resume?.abilitiesTitle || "Abilities", icon: Star },
    { id: "languages", label: "Languages", viewLabel: resume?.languagesTitle || "Languages", icon: Globe },
    { id: "interests", label: "Interests", viewLabel: resume?.interestsTitle || "Interests", icon: Heart },
  ];

  // State-uri globale pentru navigare și secțiuni
  const [activeTab, setActiveTab] = useState("experiences");
  const [sections, setSections] = useState(INITIAL_SECTIONS);

  // State-uri exclusive pentru editarea header-ului de pe mobil
  const [isMobileEditing, setIsMobileEditing] = useState(false);
  const [mobileEditTitle, setMobileEditTitle] = useState("");

  // Am actualizat parametrii ca să primească exact ce trimite EditableTab (3 argumente)
  const handleRenameSection = async (id: string, oldLabel: string, newLabel: string) => {
    const targetSection = sections.find((s) => s.id === id);
    
    if (!targetSection) return;

    // Folosim targetSection.label (valoarea constantă "Experiences") pentru baza de date
    const response = await renameSection(resumeId, targetSection.label, newLabel); 
    
    if (response.success) { 
      setSections((prevSections) =>
        prevSections.map((section) =>
          // AICI e secretul: Modificăm DOAR viewLabel, păstrăm label-ul original!
          section.id === id ? { ...section, viewLabel: newLabel } : section
        )
      );
    } else {
      console.error("Failed to rename section:", response.message);
    }
  };

  const activeSection = sections.find((s) => s.id === activeTab);

  const startMobileEdit = () => {
    // Mobilul trebuie să preia viewLabel-ul (titlul custom), nu label-ul standard
    setMobileEditTitle(activeSection?.viewLabel || "");
    setIsMobileEditing(true);
  };

  const saveMobileEdit = () => { 
    if (mobileEditTitle.trim() !== "" && mobileEditTitle !== activeSection?.viewLabel) {
      // Pasăm 3 argumente pentru a respecta structura din funcția handleRenameSection
      handleRenameSection(activeTab, activeSection?.viewLabel || "", mobileEditTitle.trim());
    }
    setIsMobileEditing(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 pb-28 md:pb-8">
      {/* HEADER PRINCIPAL */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-3xl font-bold text-zinc-100">CV Information</h1>
        <p className="text-zinc-400 mt-1">
          Complete the sections below to build your profile.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setIsMobileEditing(false); 
        }}
        className="flex flex-col md:grid md:grid-cols-[240px_1fr] gap-6 lg:gap-10 w-full"
      >
        {/* ================= DESKTOP SIDEBAR ================= */}
        <div className="hidden md:flex flex-col gap-2 w-full h-fit sticky top-8">
          {sections.map((section) => (
            <EditableTab
              key={section.id}
              id={section.id}
              label={section.viewLabel} // Aici trimitem corect viewLabel-ul!
              icon={section.icon}
              isActive={activeTab === section.id}
              onClick={() => setActiveTab(section.id)}
              onRename={handleRenameSection}
            />
          ))}
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className="w-full min-h-125">
          
          {/* --- MOBILE SECTION HEADER (Vizibil doar pe ecrane mici) --- */}
          <div className="md:hidden mb-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 shadow-sm">
            {isMobileEditing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={mobileEditTitle}
                  onChange={(e) => setMobileEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveMobileEdit();
                    if (e.key === "Escape") setIsMobileEditing(false);
                  }}
                  className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1 text-sm text-zinc-100 focus-visible:outline-none focus-visible:border-violet-500"
                />
                <button 
                  onClick={saveMobileEdit} 
                  className="p-2.5 rounded-md bg-zinc-800 text-green-400 hover:bg-zinc-700 transition"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setIsMobileEditing(false)} 
                  className="p-2.5 rounded-md bg-zinc-800 text-red-400 hover:bg-zinc-700 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeSection && <activeSection.icon className="h-5 w-5 text-violet-400" />}
                  <h2 className="text-lg font-semibold text-zinc-100">
                    {activeSection?.viewLabel}
                  </h2>
                </div>
                <button 
                  onClick={startMobileEdit} 
                  className="p-2 rounded-md text-zinc-400 hover:text-violet-400 bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {/* --- END MOBILE SECTION HEADER --- */}

          {/* TAB CONTENTS (Formularele tale) */}
          <TabsContent value="experiences" className="m-0">
            <ExperiencesForm resumeId={resumeId} previousExperience={previousExperience} />
          </TabsContent>

          <TabsContent value="education" className="m-0">
            <EducationForm resumeId={resumeId} previousEducation={previousEducation} />
          </TabsContent>

          <TabsContent value="projects" className="m-0">
            <ProjectForm resumeId={resumeId} previousProjects={previousProjects} />
          </TabsContent>

          <TabsContent value="courses" className="m-0">
            <CoursesForm resumeId={resumeId} previousCourses={previousCourses} />
          </TabsContent>

          <TabsContent value="abilities" className="m-0">
            <AbilitiesForm resumeId={resumeId} previousAbilities={previousAbilities} />
          </TabsContent>

          <TabsContent value="languages" className="m-0">
            <LanguagesForm resumeId={resumeId} previousLanguages={previousLanguages} />
          </TabsContent>

          <TabsContent value="interests" className="m-0">
            <InterestsForm resumeId={resumeId} previousInterests={previousInterests} />
          </TabsContent>
        </div>
      </Tabs>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800">
        <div className="flex overflow-x-auto no-scrollbar">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;

            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveTab(section.id);
                  setIsMobileEditing(false);
                }}
                className={`flex flex-col items-center justify-center min-w-22.5 py-3 text-xs transition-all ${
                  isActive ? "text-violet-400" : "text-zinc-500"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="truncate max-w-17.5">{section.viewLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}