import { getCurrentUser } from "@/lib/auth";
import { getResume } from "../../actions";
import { redirect } from "next/navigation";
import { Resume } from "@/types";
import ResumeSections from "./(components)/resume-sections";
import CVPagination from "../../(components)/cv-pagination";
import { verifyCVWithUser } from "@/app/(app)/actions";

interface PageProps {
  params: Promise<{ resumeId: number }>;
}

export default async function SortSectionsPage({ params }: PageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const resolvedParams = await params;
  const resumeId = Number(resolvedParams.resumeId);

  const verifyCV = await verifyCVWithUser(resumeId, currentUser.id);
  if (!verifyCV.success) redirect("/");

  const resume: Resume | undefined = await getResume(resumeId);
  if (!resume) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <ResumeSections resume={resume} />
      <CVPagination
        linkLeft={`/create-cv/${resumeId}/informations`}
        linkRight={`/create-cv/${resumeId}/generate`}
      />
    </div>
  );
}