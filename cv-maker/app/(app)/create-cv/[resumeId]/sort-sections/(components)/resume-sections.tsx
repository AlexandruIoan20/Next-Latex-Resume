"use client";

import { useState } from "react";
import { toast } from "sonner";
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
    if (currentIndex === 0) return;
    const newSections = [...sections];
    [newSections[currentIndex - 1], newSections[currentIndex]] =
      [newSections[currentIndex], newSections[currentIndex - 1]];
    setSections(newSections);
  };

  const moveDown = (currentIndex: number) => {
    if (currentIndex === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[currentIndex + 1], newSections[currentIndex]] =
      [newSections[currentIndex], newSections[currentIndex + 1]];
    setSections(newSections);
  };

  const handleSave = async () => {
    setIsSaving(true);

    const newOrder = sections.map((sec, index) => ({
      sectionId: sec.id,
      index: index,
    }));

    try {
      const response = await updateSectionsOrder(resume.id, newOrder);
      if (response.success) {
        toast.success("Order saved", {
          description: "Your section order has been updated successfully.",
        });
        router.refresh();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error("Save failed", {
        description: "Something went wrong while saving. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">Order Sections</h1>
          <p className="text-zinc-400 mt-2">
            Use the arrows to move sections up or down — they will appear in this order on your CV.
          </p>
        </div>

        {/* Sections list */}
        <div className="flex flex-col gap-3">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isFirst = index === 0;
            const isLast = index === sections.length - 1;

            return (
              <div
                key={section.id}
                className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
              >
                {/* Left: index badge + icon + label */}
                <div className="flex items-center gap-4">
                  <span className="w-6 text-center text-sm font-mono text-zinc-600 select-none">
                    {index + 1}
                  </span>
                  <div className="p-2 rounded-lg bg-zinc-800">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <span className="text-zinc-100 font-medium">{section.label}</span>
                </div>

                {/* Right: up/down controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={isFirst}
                    className="p-2.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={isLast}
                    className="p-2.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 w-full bg-violet-600 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSaving
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
              : <><Save className="w-5 h-5" /> Save Order</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}