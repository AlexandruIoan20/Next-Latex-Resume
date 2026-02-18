"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { loginUser } from "./actions" 
import Link from "next/link"
import { useRouter } from "next/navigation"

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

const formSchema = z.object({
  email: z.string().email("Adresa de email nu este validă."),
  password: z.string().min(1, "Te rugăm să introduci parola."),
})

export default function LoginPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)

    const result = await loginUser(formData)

    if (result.success) {
      alert("Welcome back! 🚀")
      // router.push('/dashboard') // Aici l-ai trimite către dashboard
    } else {
      alert("Eroare: " + result.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 p-4 font-sans text-zinc-100">
      
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center tracking-tight bg-linear-to-r from-violet-400 to-white bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-zinc-400">
            Sign in to continue editing your CV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="flex justify-between items-center">
                        <FormLabel className="text-zinc-300">Password</FormLabel>
                        <Link href="#" className="text-xs text-violet-400 hover:text-violet-300">Forgot password?</Link>
                    </div>
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
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>   
        <CardFooter className="justify-center">
            <p className="text-sm text-zinc-500">
                Don't have an account?{" "}
                <Link href="/register" className="text-violet-400 hover:text-violet-300 hover:underline">
                    Sign up
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  )
}