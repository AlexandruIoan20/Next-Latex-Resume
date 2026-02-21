import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./register-form";

export default async function RegisterPage() {
    const currentUser = await getCurrentUser();
    if(currentUser) {
        redirect("/");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950 p-4 font-sans text-zinc-100">
            <RegisterForm />
        </div>
    )
}
