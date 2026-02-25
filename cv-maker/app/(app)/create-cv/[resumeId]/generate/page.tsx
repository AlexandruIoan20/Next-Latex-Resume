import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GenerateClientPanel } from "./(components)/generate-client";
import CVPagination from "../../(components)/cv-pagination";

interface PageProps {
    params: Promise<{ resumeId: number }>;
}

export default async function GeneratePage({ params }: PageProps) {
    const user = await getCurrentUser();
    if(!user) redirect("/login");

    const resolvedParams = await params;
    const resumeId = Number(resolvedParams.resumeId);

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-zinc-950 p-4 text-zinc-100">
                <GenerateClientPanel resumeId={resumeId} />
            </div>
            <CVPagination linkLeft = { `/create-cv/${resumeId}/sort-sections` }/>
        </>
    )
}