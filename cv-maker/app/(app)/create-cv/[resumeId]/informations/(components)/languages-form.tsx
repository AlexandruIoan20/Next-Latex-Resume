"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Globe } from "lucide-react"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SortableArraySection } from "./sortable-array-section"

import { addLanguages } from "../actions"
import { Language } from "@/types" 

interface LanguagesFormProps {
  resumeId: number;
  previousLanguages: Language[];
}

export const languageSchema = z.object({
  languages: z.array(
    z.object({
      id: z.number().optional(),
      resumeId: z.number().optional(),
      language: z.string().min(1, "Language is required"),
      level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
    })
  ),
});

export default function LanguagesForm({ resumeId, previousLanguages }: LanguagesFormProps) {
  const form = useForm<z.infer<typeof languageSchema>>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      languages: previousLanguages as z.infer<typeof languageSchema>["languages"]
    }
  });

  const onSubmit = async (data: z.infer<typeof languageSchema>) => {
    const formData = new FormData();
    const languagesWithOrder = data.languages.map((lang, index) => ({
      ...lang,
      sortOrder: index
    }));
    
    formData.append("languages", JSON.stringify(languagesWithOrder));
    await addLanguages(formData, resumeId);
  }

  return (
    <SortableArraySection
      form={form}
      name="languages"
      title="Languages"
      subtitle="Add languages you speak and your proficiency level."
      icon={Globe}
      emptyMessage="No languages added yet. Click the + to start."
      submitLabel="Save Languages"
      newItemTemplate={{ language: "", level: "" }}
      onSubmit={onSubmit}
      getCardHeader={(index) => ({
        title: form.watch(`languages.${index}.language`) || "New Language",
        subtitle: form.watch(`languages.${index}.level`) ? `Level: ${form.watch(`languages.${index}.level`)}` : "Select a level",
      })}
      renderFields={(index) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`languages.${index}.language`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Language</FormLabel>
                <FormControl>
                  <Input placeholder="English, French, etc." {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name={`languages.${index}.level`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Proficiency Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <SelectItem value="A1">A1 - Beginner</SelectItem>
                    <SelectItem value="A2">A2 - Elementary</SelectItem>
                    <SelectItem value="B1">B1 - Intermediate</SelectItem>
                    <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                    <SelectItem value="C1">C1 - Advanced</SelectItem>
                    <SelectItem value="C2">C2 - Proficient / Native</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    />
  )
}