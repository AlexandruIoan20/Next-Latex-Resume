"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Star } from "lucide-react"
import { toast } from "sonner"

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
import { SortableArraySection } from "../sortable-array-section"

import { addAbilities } from "../../actions"
import { Ability } from "@/types"

interface AbilitiesFormProps {
  resumeId: number;
  previousAbilities: Ability[];
}

export const abilitySchema = z.object({
  abilities: z.array(
    z.object({
      id: z.number().optional(),
      resumeId: z.number().optional(),
      title: z.string().min(1, "Ability title is required"),
      level: z.enum(["0", "1", "2", "3", "4", "5", "6"]),
    })
  ),
});

export default function AbilitiesForm({ resumeId, previousAbilities }: AbilitiesFormProps) {
  const form = useForm<z.infer<typeof abilitySchema>>({
    resolver: zodResolver(abilitySchema),
    defaultValues: {
      abilities: previousAbilities as z.infer<typeof abilitySchema>["abilities"]
    }
  });

  const onSubmit = async (data: z.infer<typeof abilitySchema>) => {
    try {
      const formData = new FormData();
      formData.append("abilities", JSON.stringify(data.abilities));
      await addAbilities(formData, resumeId);
      toast.success("Abilities saved", {
        description: "Your skills and abilities have been updated successfully.",
      });
    } catch (error) {
      toast.error("Save failed", {
        description: "Something went wrong while saving. Please try again.",
      });
    }
  }

  const getLevelLabel = (levelValue: string) => {
    const levels: Record<string, string> = {
      "0": "Novice",
      "1": "Beginner",
      "2": "Intermediate",
      "3": "Proficient",
      "4": "Advanced",
      "5": "Expert",
      "6": "Master"
    };
    return levels[levelValue] || "Select level";
  };

  return (
    <SortableArraySection
      form={form}
      name="abilities"
      title="Skills & Abilities"
      subtitle="Highlight your technical or soft skills."
      icon={Star}
      emptyMessage="No abilities added yet. Click the + to start."
      submitLabel="Save Abilities"
      newItemTemplate={{ title: "", level: "" }}
      onSubmit={onSubmit}
      getCardHeader={(index) => {
        const currentLevel = form.watch(`abilities.${index}.level`);
        return {
          title: form.watch(`abilities.${index}.title`) || "New Skill",
          subtitle: currentLevel ? `Level: ${getLevelLabel(currentLevel)}` : "Select a level",
        };
      }}
      renderFields={(index) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`abilities.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Skill Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. React, Negotiation, SEO" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`abilities.${index}.level`}
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
                    <SelectItem value="0">0 - Novice</SelectItem>
                    <SelectItem value="1">1 - Beginner</SelectItem>
                    <SelectItem value="2">2 - Intermediate</SelectItem>
                    <SelectItem value="3">3 - Proficient</SelectItem>
                    <SelectItem value="4">4 - Advanced</SelectItem>
                    <SelectItem value="5">5 - Expert</SelectItem>
                    <SelectItem value="6">6 - Master</SelectItem>
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