"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { addUser } from "./actions"

// Componentele Shadcn
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
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
})

export default function RegisterPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value)
    })

    await addUser(formData)
    form.reset()
    alert("User registered successfully!")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 p-4 font-sans text-zinc-100">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Enter your details below to start building your CV
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
                        <Input 
                          placeholder="John" 
                          {...field} 
                          className="bg-zinc-950 border-zinc-800 text-zinc-300 focus-visible:ring-violet-600 focus-visible:border-violet-600 placeholder:text-zinc-600 transition-all duration-200" 
                        />
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
                        <Input 
                          placeholder="Doe" 
                          {...field} 
                          className="bg-zinc-950 border-zinc-800 text-zinc-300 focus-visible:ring-violet-600 focus-visible:border-violet-600 placeholder:text-zinc-600 transition-all duration-200" 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="john.doe@example.com" 
                        {...field} 
                        className="bg-zinc-950 border-zinc-800 text-zinc-300 focus-visible:ring-violet-600 focus-visible:border-violet-600 placeholder:text-zinc-600 transition-all duration-200" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="bg-zinc-950 border-zinc-800 text-zinc-300 focus-visible:ring-violet-600 focus-visible:border-violet-600 placeholder:text-zinc-600 transition-all duration-200" 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-colors duration-200 shadow-lg shadow-violet-900/20"
              >
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-zinc-500">
              Do you have an account?{" "}
              <Link href="/login" className="text-violet-400 hover:text-violet-300 hover:underline">
                  Log In
              </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}