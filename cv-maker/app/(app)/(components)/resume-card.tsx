"use client";

import Link from "next/link";
import { FileText, Calendar, ArrowUpRight } from "lucide-react";
import { Resume } from "@/types";

interface ResumeCardProps {
  resume: Resume;
}

export default function ResumeCard({ resume }: ResumeCardProps) {
  return (
    <Link
      href={`/resumes/${resume.id}`}
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
        
        {/* Top Section */}
        <div className="flex items-start justify-between">
          
          <div className="flex items-center gap-3">
            <div className="bg-violet-600/20 p-2 rounded-xl border border-violet-500/20">
              <FileText className="h-5 w-5 text-violet-400" />
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold text-zinc-100 group-hover:text-violet-400 transition">
                {resume.title}
              </h3>
              
              {resume.description && (
                <p className="text-xs md:text-sm text-zinc-400 mt-1 line-clamp-2">
                  {resume.description}
                </p>
              )}
            </div>
          </div>

          <ArrowUpRight className="h-5 w-5 text-zinc-500 group-hover:text-violet-400 transition" />
        </div>

        {/* Bottom Section */}
        <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
          <span className="text-violet-400 font-medium group-hover:underline">
            Open
          </span>
        </div>

      </div>
    </Link>
  );
}