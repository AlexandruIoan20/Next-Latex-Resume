import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Dashboard } from "./(components)/dashboard";
import { getResumes } from "./actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const resumes = await getResumes(user.id); 

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 md:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-xl">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Salut, <span className="text-violet-400">{user.firstName}</span>
              </h1>
              <p className="text-zinc-400 mt-2">
                Ești logat cu adresa:
              </p>
              <p className="text-zinc-300 font-medium">
                {user.email}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-lg">
          <Dashboard userId = { user.id } resumes = { resumes } />
        </div>

      </div>
    </div>
  );
}