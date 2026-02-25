"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { UpdatedDatePicker } from "@/components/ui/updated-date-picker"
import { saveContactDetails, getContactDetails } from "./actions"
import { Loader2 } from "lucide-react" 

import { ContactDetails } from "@/types"

const formSchema = z.object({ 
    firstName: z.string().min(1, "First name is required."), 
    lastName: z.string().min(1, "Last name is required"), 
    phoneNumber: z.string().min(1, "Phone number is required."),
    address: z.string(),
    city: z.string(),
    county: z.string(),
    birthDate: z.date(),
    birthPlace: z.string(),
    nationality: z.string(),
    civilStatus: z.string(),
    linkedIn: z
        .string()
        .url("Invalid LinkedIn URL")
        .or(z.literal("")),
    personalWebsite: z
        .string()
        .url("Invalid personal website URL")
        .or(z.literal("")),
})

export default function ContactDetailsForm({ resumeId }: { resumeId: number }) {
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      city: "",
      county: "",
      birthDate: undefined,
      birthPlace: "",
      nationality: "",
      civilStatus: "",
      linkedIn: "",
      personalWebsite: "",
    },
  })

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const data: ContactDetails | null = await getContactDetails(resumeId);
        
        if (data) {
          form.reset({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phoneNumber: data.phoneNumber || "",
            address: data.address || "",
            city: data.city || "",
            county: data.county || "",
            birthDate: data.birthDate ? new Date(data.birthDate) : undefined, 
            birthPlace: data.birthPlace || "",
            nationality: data.nationality || "",
            civilStatus: data.civilStatus || "",
            linkedIn: data.linkedIn || "",
            personalWebsite: data.personalWebsite || "",
          });
        }
      } catch (error) {
        alert("Nu s-au putut încărca datele existente.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, [resumeId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData(); 
    Object.entries(values).forEach(([key, value]) => {
        if (value instanceof Date) {
            formData.append(key, value.toISOString().split("T")[0]); 
        } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
        }
    }); 

    await saveContactDetails(formData, resumeId);
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 p-4 text-zinc-100">
      <Card className="w-full max-w-2xl text-zinc-300 bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-zinc-100">
            Personal Details
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Complete your personal information
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">First Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">City</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">County</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Address</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-zinc-300">Birth Date</FormLabel>
                      <UpdatedDatePicker
                        mode="start"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Birth Place</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Nationality</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="civilStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Civil Status</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">LinkedIn</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://linkedin.com/in/..." className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Personal Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://yourwebsite.com" className="bg-zinc-950 border-zinc-800 focus-visible:ring-violet-500" />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white transition-colors"
              >
                {form.formState.isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    "Save Details"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}