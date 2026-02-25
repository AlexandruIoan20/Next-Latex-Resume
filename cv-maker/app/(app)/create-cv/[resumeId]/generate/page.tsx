import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GenerateClientPanel } from "./(components)/generate-client";

interface PageProps {
    params: Promise<{ resumeId: number }>;
}

export default async function GeneratePage({ params }: PageProps) {
    const user = await getCurrentUser();
    if(!user) redirect("/login");

    const resolvedParams = await params;
    const resumeId = Number(resolvedParams.resumeId);

    return (
        <main className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 overflow-hidden relative">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-700/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-700/10 blur-[120px] rounded-full pointer-events-none"></div>
            
            <GenerateClientPanel resumeId={resumeId} />
        </main>
    )
}