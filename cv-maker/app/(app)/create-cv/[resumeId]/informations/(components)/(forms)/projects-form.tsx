"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FolderGit } from "lucide-react"

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

import { Project } from "@/types"
import { addProject } from "../../actions"

export const projectSchema = z.object({ 
    projects: z.array(
        z.object({ 
            id: z.number().optional(), 
            resumeId: z.number().optional(), 
            title: z.string().min(1, "Title is required"), 
            description: z.string(), 
            link: z.string(), 
            techStack: z.string(), 
        })
    )
}); 

interface ProjectFormProps { 
    resumeId: number; 
    previousProjects: Project[]
}

export default function ProjectForm({ resumeId, previousProjects }: ProjectFormProps) { 
    const form = useForm<z.infer<typeof projectSchema>>({ 
        resolver: zodResolver(projectSchema), 
        defaultValues: { 
            projects: previousProjects as z.infer<typeof projectSchema>["projects" ]
        }
    }); 

    const onSubmit = async (data: z.infer<typeof projectSchema>) => { 
        const formData = new FormData(); 
        formData.append("projects", JSON.stringify(data.projects)); 

        await addProject(formData, resumeId);
    } 

    return ( 
        <SortableArraySection
            form = { form }
            name = "projects"
            title = "Projects"
            subtitle = "Add and manage your projects."
            icon = { FolderGit }
            emptyMessage = "No projects added yet. Click the + to start."
            submitLabel = "Save Projects"
            newItemTemplate = {{ title: "", description: "", link: "", techStack: "" }} 
            onSubmit = { onSubmit }
            getCardHeader = { (index) => ({ 
                title: form.watch(`projects.${index}.title`) || "New Project",
                subtitle: form.watch(`projects.${index}.title`) || "New Project",
            })}
            renderFields = { (index) => (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`projects.${index}.title`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Title</FormLabel>
                                <FormControl>
                                <Input placeholder="TO DO List" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`projects.${index}.link`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Link</FormLabel>
                                <FormControl>
                                <Input placeholder="https://example.com/to-do-list" {...field} className="bg-zinc-950 border-zinc-800 text-zinc-100" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name={`projects.${index}.description`}
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

                    <FormField
                        control={form.control}
                        name={`projects.${index}.techStack`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Tech Stack</FormLabel>
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