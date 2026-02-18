"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { addContactDetails } from "./actions"

const formSchema = z.object({ 
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData(); 
    Object.entries(values).forEach(([key, value]) => {
        if (value instanceof Date) {
            formData.append(key, value.toISOString().split("T")[0]); 
        } else {
            formData.append(key, value);
        }
    }); 

    await addContactDetails(formData, resumeId);
    alert("Contact details saved successfully!");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 p-4 text-zinc-100">
      <Card className="w-full max-w-2xl text-zinc-300 bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Personal Details
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Complete your personal information
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="county"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>County</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800" />
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Date Picker */}
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birth Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="bg-zinc-950 border-zinc-800 justify-start text-left font-normal"
                          >
                            {field.value
                              ? format(field.value, "PPP")
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-white" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Place</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-zinc-950 border-zinc-800" />
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
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="civilStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Civil Status</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-zinc-950 border-zinc-800" />
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
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://linkedin.com/in/..." className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personalWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Website</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://yourwebsite.com" className="bg-zinc-950 border-zinc-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                Save Details
              </Button>

            </form>
          </Form>
        </CardContent>

        <CardFooter />
      </Card>
    </div>
  )
}
