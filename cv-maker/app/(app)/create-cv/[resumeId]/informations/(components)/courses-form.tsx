"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { BookOpen } from "lucide-react"
import { UpdatedDatePicker } from "@/components/ui/updated-date-picker"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SortableArraySection } from "./sortable-array-section"

import { addCourses } from "../actions"
import { Course } from "@/types" 

interface CoursesFormProps {
  resumeId: number;
  previousCourses: Course[];
}

export const courseSchema = z.object({
  courses: z.array(
    z.object({
      id: z.number().optional(),
      resumeId: z.number().optional(),
      title: z.string().min(1, "Title is required"),
      institution: z.string().min(1, "Institution is required"),
      startDate: z.date().optional().nullable(),
      finishDate: z.date().optional().nullable(),
    })
  ),
});

export default function CoursesForm({ resumeId, previousCourses }: CoursesFormProps) {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courses: previousCourses as z.infer<typeof courseSchema>["courses"]
    }
  });

  const onSubmit = async (data: z.infer<typeof courseSchema>) => {
    const formData = new FormData();
    formData.append("courses", JSON.stringify(data.courses));

    await addCourses(formData, resumeId);
  }

  return (
    <SortableArraySection
      form={form}
      name="courses"
      title="Courses & Certifications"
      subtitle="Add relevant courses, bootcamps, or certifications."
      icon={BookOpen}
      emptyMessage="No courses added yet. Click the + to start."
      submitLabel="Save Courses"
      newItemTemplate={{ title: "", institution: "" }}
      onSubmit={onSubmit}
      getCardHeader={(index) => ({
        title: form.watch(`courses.${index}.title`) || "Course Title",
        subtitle: form.watch(`courses.${index}.institution`) || "Institution Name",
      })}
      renderFields={(index) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`courses.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Web Development Bootcamp" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`courses.${index}.institution`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="Udemy / Coursera" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`courses.${index}.startDate`}
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
              name={`courses.${index}.finishDate`}
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