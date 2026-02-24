"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Briefcase } from "lucide-react"
import { UpdatedDatePicker } from "@/components/ui/updated-date-picker"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { SortableArraySection } from "../sortable-array-section"

import { addExperiences } from "../../actions"
import { Experience } from "@/types"

interface ExperiencesFormProps {
  resumeId: number;
  previousExperience: Experience[];
}

export const experienceSchema = z.object({
  experiences: z.array(
    z.object({
      id: z.number().optional(),
      resumeId: z.number().optional(),
      title: z.string().min(1, "Title is required"),
      city: z.string().min(1, "City is required"),
      employer: z.string().min(1, "Employer is required"),
      startDate: z.date().optional().nullable(), 
      finishDate: z.date().optional().nullable(), 
      description: z.string().optional(), 
    })
  ),
});

export default function ExperiencesForm({ resumeId, previousExperience }: ExperiencesFormProps) { 
    const form = useForm<z.infer<typeof experienceSchema>>({
      resolver: zodResolver(experienceSchema),
      defaultValues: {
          experiences: previousExperience as z.infer<typeof experienceSchema>["experiences"]
      }
    }); 

    const onSubmit = async (data: z.infer<typeof experienceSchema>) => {
        console.log({ resumeId })
        const formData = new FormData();
        formData.append("experiences", JSON.stringify(data.experiences));

        await addExperiences(formData, resumeId);
    }

    return ( 
      <SortableArraySection 
        form = { form }
        name = "experiences"
        title = "Experiences"
        subtitle = "Add and manage your work experience."
        icon = { Briefcase }
        emptyMessage="No experiences added yet. Click the + to start."
        submitLabel="Save Experiences" 
        newItemTemplate = {{ title: "", city: "", employer: "", description: "" }}
        onSubmit = { onSubmit }
        getCardHeader={(index) => ({
          title: form.watch(`experiences.${index}.title`) || "New Job Position",
          subtitle: form.watch(`experiences.${index}.employer`) || "Employer Name",
        })}
        renderFields = {(index) => ( 
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={`experiences.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Engineer" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experiences.${index}.employer`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Employer</FormLabel>
                    <FormControl>
                      <Input placeholder="Tech Company" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experiences.${index}.city`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">City</FormLabel>
                    <FormControl>
                      <Input placeholder="Iași" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`experiences.${index}.startDate`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                        <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                          Start Date
                        </FormLabel>
                        <FormControl>
                          <UpdatedDatePicker
                            mode="start"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experiences.${index}.finishDate`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                        <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">
                          Finish Date
                        </FormLabel>
                        <FormControl>
                          <UpdatedDatePicker
                            mode="finish"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Present / Pick date"
                          />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`experiences.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Description / Key Achievements</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      />
    )
}