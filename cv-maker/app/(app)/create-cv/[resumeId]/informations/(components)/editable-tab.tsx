"use client";

import { useState } from "react";
import { LucideIcon, Pencil, Check, X } from "lucide-react";

interface EditableTabProps {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  onRename: (id: string, label: string, newLabel: string) => void;
}

export default function EditableTab({
  id,
  label,
  icon: Icon,
  isActive,
  onClick,
  onRename,
}: EditableTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(label);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenim schimbarea tab-ului când dăm click pe Edit
    setIsEditing(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentLabel(label); // Resetăm la numele original
    setIsEditing(false);
  };

  const handleSave = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    
    if (currentLabel.trim() !== "" && currentLabel !== label) {
      // AICI E MODIFICAREA: Trimitem id-ul, vechiul nume (label) și noul nume (currentLabel)
      onRename(id, label, currentLabel.trim());
    } else {
      setCurrentLabel(label);
    }
    
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave(e);
    if (e.key === "Escape") {
      setCurrentLabel(label);
      setIsEditing(false);
    }
  };

  // ---------------- MODUL DE EDITARE ----------------
  if (isEditing) {
    return (
      <div className={`
        flex items-center gap-2 py-2 px-3 rounded-xl border shadow-sm transition-all
        ${isActive ? "bg-zinc-800 border-violet-500/50" : "bg-zinc-900 border-zinc-700"}
      `}>
        <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-violet-400" : "text-zinc-400"}`} />
        <input
          autoFocus
          value={currentLabel}
          onChange={(e) => setCurrentLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="flex h-7 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-100 focus-visible:outline-none focus-visible:border-violet-500"
        />
        <button 
          onClick={handleSave}
          className="p-1 rounded-md bg-zinc-800 text-green-400 hover:bg-zinc-700 transition shrink-0"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button 
          onClick={handleCancel}
          className="p-1 rounded-md bg-zinc-800 text-red-400 hover:bg-zinc-700 transition shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // ---------------- MODUL DE VIZUALIZARE (NORMAL) ----------------
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center justify-between py-3 px-4 rounded-xl font-medium transition-all text-sm w-full
        ${
          isActive
            ? "bg-zinc-800 text-violet-400 border border-zinc-700 shadow-sm"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
        }
      `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{currentLabel}</span>
      </div>
      
      {/* Butonul de editare ascuns care apare pe hover */}
      <div
        onClick={handleEditClick}
        className="p-1.5 opacity-0 group-hover:opacity-100 rounded-md text-zinc-500 hover:text-violet-400 hover:bg-zinc-700/50 transition-all ml-2"
        title="Redenumește secțiunea"
      >
        <Pencil className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}