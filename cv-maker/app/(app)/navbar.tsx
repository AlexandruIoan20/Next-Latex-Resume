"use client";

import Link from "next/link";
import { FileText, LogOut } from "lucide-react";
import { logoutUser } from "@/lib/auth";

export function Navbar() {
  return (
    <nav className="w-full bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-violet-600/20 p-2 rounded-xl border border-violet-500/20 group-hover:bg-violet-600/30 transition">
            <FileText className="h-5 w-5 text-violet-400" />
          </div>
          <span className="text-lg font-semibold text-zinc-100 tracking-tight">
            CV <span className="text-violet-400">Builder</span>
          </span>
        </Link>

        <form action={logoutUser}>
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 transition-colors px-4 py-2 rounded-xl text-sm font-medium shadow-md">
                <LogOut className="w-5 h-5" />
            </button>
        </form>
      </div>
    </nav>
  );
}