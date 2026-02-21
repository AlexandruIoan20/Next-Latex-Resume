"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2, GraduationCap, ArrowUp, ArrowDown, ChevronDown } from "lucide-react"
import { UpdatedDatePicker } from "@/components/ui/updated-date-picker"
import { cn } from "@/lib/utils"
import { useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Education } from "@/types"

import { addEducation } from "../actions"

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
    const [ openItems, setOpenItems ] = useState<Record<string, boolean>> ({}); 

    const form = useForm<z.infer<typeof educationSchema>>({ 
        resolver: zodResolver(educationSchema), 
        defaultValues: { 
            education: previousEducation as z.infer<typeof educationSchema>["education"], 
        }
    }); 

    const { fields, append, remove, move } = useFieldArray({ 
        control: form.control, 
        name: "education"
    }); 

    const onSubmit = async (data: z.infer<typeof educationSchema>) => { 
        const formData = new FormData(); 
        formData.append("education", JSON.stringify(data.education)); 

        await addEducation(formData, resumeId); 
    }

    return (
        <div className = "w-full max-w-4xl mx-auto space-y-8 p-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
                <div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-violet-400 to-white bg-clip-text text-transparent">
                    Education
                </h2>
                <p className="text-zinc-500 text-sm">Add and manage your education</p>
                </div>
                <Button 
                    type="button" 
                    onClick={() => append({ degree: "", school: "" })}
                    className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-12 w-12 shadow-lg shadow-violet-900/20"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit = { form.handleSubmit(onSubmit)} className = "space-y-6">
                    {fields.length === 0 && (
                        <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
                            <GraduationCap className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
                            <p className="text-zinc-500">No education added yet. Click the + to start.</p>
                        </div>
                    )}

                    <div className = "space-y-4">
                        { fields.map((field, index) => (
                            <Collapsible
                                key = { field.id }
                                open = { openItems[field.id] } 
                                onOpenChange = { (val) => setOpenItems((prev) => ({ ...prev, [field.id]: val }))} 
                            >
                                <Card className="bg-zinc-900 border-zinc-800 overflow-hidden transition-all hover:border-zinc-700">
                                    <CardHeader className="bg-zinc-900/50 border-b border-zinc-800/50 p-4 flex flex-row items-center justify-between space-y-0">
                                        <div className = "flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-600/20">
                                                <GraduationCap className="h-5 w-5 text-violet-500" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-semibold text-zinc-100">
                                                    {form.watch(`education.${index}.degree`) || "Degree Name"}
                                                </CardTitle>
                                                <p className="text-xs text-zinc-500">
                                                    {form.watch(`education.${index}.school`) || "School Name"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <div className="flex items-center bg-zinc-950/50 rounded-md border border-zinc-800/60 p-0.5">
                                                <Button
                                                    type = "button"
                                                    variant = "ghost"
                                                    size = "icon"
                                                    title = "Move up"
                                                    onClick = { () => move(index, index - 1)} 
                                                    disabled = { index === 0 }
                                                    className = "h-7 w-7 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500"
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Move down"
                                                    onClick={() => move(index, index + 1)}
                                                    disabled={index === fields.length - 1}
                                                    className="h-7 w-7 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500"
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="w-px h-5 bg-zinc-800 mx-1"></div>
                                            <CollapsibleTrigger asChild>
                                                <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                title="Edit experience"
                                                className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                                >
                                                <ChevronDown
                                                    className={cn(
                                                    "h-4 w-4 transition-transform",
                                                    openItems[field.id] && "rotate-180"
                                                    )}
                                                />
                                                </Button>
                                            </CollapsibleTrigger>

                                            <Button
                                                type = "button"
                                                variant = "ghost"
                                                size = "icon"
                                                title = "Delete education"
                                                onClick = {() => remove(index)}
                                                className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CollapsibleContent>
                                        <CardContent className="p-6 space-y-6">
                                            <div className = "grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        ))}
                    </div>

                    {fields.length > 0 && (
                        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-6">
                            Save Education
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    )
}