"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { GraduationCap } from "lucide-react"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UpdatedDatePicker } from "@/components/ui/updated-date-picker"

import { SortableArraySection } from "../sortable-array-section"
import { Education } from "@/types"
import { addEducation } from "../../actions"

interface EducationFormProps { 
    resumeId: number; 
    previousEducation: Education[]; 
}

export const educationSchema = z.object({ 
    education: z.array(
        z.object({ 
            id: z.number().optional(), 
            resumeId: z.number().optional(), 
            degree: z.string().min(1, "Degree is required!"), 
            school: z.string().min(1, "School is required!"), 
            startDate: z.date().optional().nullable(),
            finishDate: z.date().optional().nullable(), 
        })
    )
}); 

export default function EducationForm({ resumeId, previousEducation }: EducationFormProps) {
  const form = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: { education: previousEducation },
  });

  const onSubmit = async (data: z.infer<typeof educationSchema>) => {
    const formData = new FormData();
    formData.append("education", JSON.stringify(data.education));
    await addEducation(formData, resumeId);
  }

  return (
    <SortableArraySection
      form={form}
      name="education"
      title="Education"
      subtitle="Add and manage your education"
      icon={GraduationCap}
      emptyMessage="No education added yet. Click the + to start."
      submitLabel="Save Education"
      newItemTemplate={{ degree: "", school: "" }}
      onSubmit={onSubmit}
      getCardHeader={(index) => ({
        title: form.watch(`education.${index}.degree`) || "Degree Name",
        subtitle: form.watch(`education.${index}.school`) || "School Name",
      })}
      renderFields={(index) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Degree</FormLabel>
                    <FormControl>
                        <Input placeholder="Student" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={`education.${index}.school`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Job Title</FormLabel>
                    <FormControl>
                        <Input placeholder="UAIC" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name={`education.${index}.startDate`}
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
                name={`education.${index}.finishDate`}
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
        </>
      )}
    />
  )
}