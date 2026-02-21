"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Heart } from "lucide-react"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SortableArraySection } from "./sortable-array-section"

import { addInterests } from "../actions" 
import { Interest } from "@/types"

interface InterestsFormProps {
  resumeId: number;
  previousInterests: Interest[];
}

export const interestSchema = z.object({
  interests: z.array(
    z.object({
      id: z.number().optional(),
      resumeId: z.number().optional(),
      title: z.string().min(1, "Interest title is required"),
    })
  ),
});

export default function InterestsForm({ resumeId, previousInterests }: InterestsFormProps) {
  const form = useForm<z.infer<typeof interestSchema>>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      interests: previousInterests as z.infer<typeof interestSchema>["interests"]
    }
  });

  const onSubmit = async (data: z.infer<typeof interestSchema>) => {
    const formData = new FormData();

    formData.append("interests", JSON.stringify(data.interests));
    await addInterests(formData, resumeId);
  }

  return (
    <SortableArraySection
      form={form}
      name="interests"
      title="Interests"
      subtitle="Add hobbies or interests that reflect your personality."
      icon={Heart}
      emptyMessage="No interests added yet. Click the + to start."
      submitLabel="Save Interests"
      newItemTemplate={{ title: "" }}
      onSubmit={onSubmit}
      getCardHeader={(index) => ({
        title: form.watch(`interests.${index}.title`) || "New Interest",
        subtitle: "Hobby / Activity",
      })}
      renderFields={(index) => (
        <FormField
          control={form.control}
          name={`interests.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Interest / Hobby</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Reading, Traveling, Open Source" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    />
  )
}