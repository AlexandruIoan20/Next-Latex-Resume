"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ArrowUpRight, Pencil, Check, X } from "lucide-react";
import { Resume } from "@/types";

interface ResumeCardProps {
  resume: Resume;
  onRename?: (id: number, newTitle: string) => void;
}

export default function ResumeCard({ resume, onRename }: ResumeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(resume.title);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTitle(resume.title); 
    setIsEditing(false);
  };

  const handleSave = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (title.trim() !== "" && title !== resume.title) {
      onRename?.(resume.id, title);
      setTitle(title); 
    } else {
      setTitle(resume.title); 
    }
    
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave(e);
    if (e.key === "Escape") {
      setTitle(resume.title);
      setIsEditing(false);
    }
  };

  return (
    <Link
      href={`/create-cv/${resume.id}/contact-details`}
      className="group block w-full"
    >
      <div className="
        bg-zinc-900/60 
        backdrop-blur-md 
        border border-zinc-800 
        rounded-2xl 
        p-5 md:p-6 
        transition-all 
        duration-300
        hover:border-violet-500/40 
        hover:shadow-lg 
        hover:shadow-violet-500/10
        active:scale-[0.98]
      ">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-violet-600/20 p-2 rounded-xl border border-violet-500/20 shrink-0">
              <FileText className="h-5 w-5 text-violet-400" />
            </div>

            <div className="flex-1 pr-4">
              {isEditing ? (
                <div 
                  className="flex items-center gap-2"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex h-8 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1 text-sm text-zinc-100 shadow-sm transition-colors focus-visible:outline-none focus-visible:border-violet-500 focus-visible:ring-1 focus-visible:ring-violet-500/50"
                  />
                  <button 
                    onClick={handleSave}
                    className="p-1.5 rounded-md bg-zinc-800 text-green-400 hover:bg-zinc-700 transition"
                    title="Save (Enter)"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="p-1.5 rounded-md bg-zinc-800 text-red-400 hover:bg-zinc-700 transition"
                    title="Cancel (Esc)"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-base md:text-lg font-semibold text-zinc-100 group-hover:text-violet-400 transition">
                    {title}
                  </h3>
                  <button
                    onClick={handleEditClick}
                    className="p-1.5 opacity-0 group-hover:opacity-100 rounded-md text-zinc-400 hover:text-violet-400 hover:bg-zinc-800 transition-all"
                    title="Edit name"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {!isEditing && resume.description && (
                <p className="text-xs md:text-sm text-zinc-400 mt-1 line-clamp-2">
                  {resume.description}
                </p>
              )}
            </div>
          </div>

          {!isEditing && (
            <ArrowUpRight className="h-5 w-5 text-zinc-500 group-hover:text-violet-400 transition shrink-0" />
          )}
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
          <span className="text-violet-400 font-medium group-hover:underline">
            Open
          </span>
        </div>

      </div>
    </Link>
  );
}