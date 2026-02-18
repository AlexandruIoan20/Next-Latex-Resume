import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutUser } from "@/lib/auth";
import { Dashboard } from "./dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-10">
      <Dashboard /> 
      <h1 className="text-3xl font-bold">Salut, {user.firstName}!</h1>
      <p>Ești logat cu adresa: {user.email}</p>
      
    
      <form action={logoutUser}>
        <button className="bg-red-500 text-white p-2 rounded mt-4">
          Deconectare
        </button>
      </form>
    </div>
  );
}