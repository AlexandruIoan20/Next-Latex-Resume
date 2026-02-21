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
} from "lucide-react";

import { Tabs, TabsContent } from "@/components/ui/tabs";

import ExperiencesForm from "./experiences-form";
import EducationForm from "./education-form";
import ProjectForm from "./projects-form";
import CoursesForm from "./courses-form";
import LanguagesForm from "./languages-form";
import InterestsForm from "./interests-form";
import AbilitiesForm from "./abilities-form";

import {
  Education,
  Experience,
  Project,
  Course,
  Language,
  Interest,
  Ability,
} from "@/types";

interface FormsListProps {
  resumeId: number;
  previousExperience: Experience[];
  previousEducation: Education[];
  previousProjects: Project[];
  previousCourses: Course[];
  previousLanguages: Language[];
  previousInterests: Interest[];
  previousAbilities: Ability[];
}

const SECTIONS = [
  { id: "experiences", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "abilities", label: "Abilities", icon: Star },
  { id: "languages", label: "Languages", icon: Globe },
  { id: "interests", label: "Interests", icon: Heart },
];

export default function FormsList({
  resumeId,
  previousExperience,
  previousEducation,
  previousProjects,
  previousCourses,
  previousAbilities,
  previousLanguages,
  previousInterests,
}: FormsListProps) {
  const [activeTab, setActiveTab] = useState("experiences");

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 pb-28 md:pb-8">
      {/* HEADER */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-3xl font-bold text-zinc-100">CV Information</h1>
        <p className="text-zinc-400 mt-1">
          Complete the sections below to build your profile.
        </p>
      </div>

      <Tabs
        value={activeTab}
        className="flex flex-col md:grid md:grid-cols-[240px_1fr] gap-6 lg:gap-10 w-full"
      >
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:flex flex-col gap-2 w-full h-fit sticky top-8">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`
                  flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all text-sm
                  ${
                    isActive
                      ? "bg-zinc-800 text-violet-400 border border-zinc-700 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        <div className="w-full min-h-[500px]">
          <TabsContent value="experiences" className="m-0">
            <ExperiencesForm
              resumeId={resumeId}
              previousExperience={previousExperience}
            />
          </TabsContent>

          <TabsContent value="education" className="m-0">
            <EducationForm
              resumeId={resumeId}
              previousEducation={previousEducation}
            />
          </TabsContent>

          <TabsContent value="projects" className="m-0">
            <ProjectForm
              resumeId={resumeId}
              previousProjects={previousProjects}
            />
          </TabsContent>

          <TabsContent value="courses" className="m-0">
            <CoursesForm
              resumeId={resumeId}
              previousCourses={previousCourses}
            />
          </TabsContent>

          <TabsContent value="abilities" className="m-0">
            <AbilitiesForm
              resumeId={resumeId}
              previousAbilities={previousAbilities}
            />
          </TabsContent>

          <TabsContent value="languages" className="m-0">
            <LanguagesForm
              resumeId={resumeId}
              previousLanguages={previousLanguages}
            />
          </TabsContent>

          <TabsContent value="interests" className="m-0">
            <InterestsForm
              resumeId={resumeId}
              previousInterests={previousInterests}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800">
        <div className="flex overflow-x-auto no-scrollbar">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex flex-col items-center justify-center min-w-[90px] py-3 text-xs transition-all ${
                  isActive
                    ? "text-violet-400"
                    : "text-zinc-500"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}