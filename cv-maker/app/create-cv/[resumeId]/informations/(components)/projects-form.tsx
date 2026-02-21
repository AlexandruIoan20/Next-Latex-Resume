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
import { Project } from "@/types"

interface ProjectsFormProps { 
    resumeId: number; 
    previousProjects: Project[], 
}

export const projectSchema = z.object({ 
    projects: z.array(
        z.object({ 
            id: z.number().optional(), 
            resumeId: z.number().optional(), 
            
        })
    )
})