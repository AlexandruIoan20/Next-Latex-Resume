"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Plus, Trash2, Briefcase, Calendar as CalendarIcon, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { experienceSchema } from "../schemas"
import { addExperiences } from "../actions"

export default function ExperiencesForm({ resumeId }: { resumeId: number }) { 
    console.log("ExperiencesForm rendered with resumeId:", resumeId);
    const form = useForm<z.infer<typeof experienceSchema>>({
        resolver: zodResolver(experienceSchema),
        defaultValues: {
            experiences: []
        }
    });

    const { fields, append, remove } = useFieldArray({ 
        control: form.control, 
        name: "experiences"
    }); 

    const onSubmit = async (data: z.infer<typeof experienceSchema>) => {
        console.log({ resumeId })
        const formData = new FormData();
        formData.append("experiences", JSON.stringify(data.experiences));

        await addExperiences(formData, resumeId);
    }

return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-violet-400 to-white bg-clip-text text-transparent">
            Work Experience
          </h2>
          <p className="text-zinc-500 text-sm">Add and manage your professional history</p>
        </div>
        <Button 
          type="button" 
          onClick={() => append({ title: "", city: "", employer: "", description: "" })}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-12 w-12 shadow-lg shadow-violet-900/20"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.length === 0 && (
             <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
                <Briefcase className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500">No experiences added yet. Click the + to start.</p>
             </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="bg-zinc-900 border-zinc-800 overflow-hidden transition-all hover:border-zinc-700">
                <CardHeader className="bg-zinc-900/50 border-b border-zinc-800/50 p-4 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-600/20">
                      <Briefcase className="h-5 w-5 text-violet-500" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-zinc-100">
                        {form.watch(`experiences.${index}.title`) || "New Job Position"}
                      </CardTitle>
                      <p className="text-xs text-zinc-500">
                        {form.watch(`experiences.${index}.employer`) || "Employer Name"}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => remove(index)}
                    className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Engineer" {...field} className="bg-zinc-950 border-zinc-800" />
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
                            <Input placeholder="Tech Company" {...field} className="bg-zinc-950 border-zinc-800" />
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
                            <Input placeholder="Iași" {...field} className="bg-zinc-950 border-zinc-800" />
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
                          <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal bg-zinc-950 border-zinc-800", !field.value && "text-zinc-500")}>
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`experiences.${index}.finishDate`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Finish Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal bg-zinc-950 border-zinc-800", !field.value && "text-zinc-500")}>
                                  {field.value ? format(field.value, "PPP") : <span>Present / Pick date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus />
                            </PopoverContent>
                          </Popover>
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
                          <Textarea 
                            placeholder="Developed microservices using Node.js..." 
                            className="bg-zinc-950 border-zinc-800 min-h-25 resize-none focus-visible:ring-violet-600" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {fields.length > 0 && (
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-6">
              Save All Experiences
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
    
}