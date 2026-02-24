"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createCV } from "../create-cv/actions";
import { Resume } from "@/types";
import ResumeCard from "./resume-card";

import { renameCV } from "../actions";

interface DashboardProps { 
    resumes: Resume[], 
    userId: number; 
}

export const Dashboard = ({ resumes, userId }: DashboardProps) => {
    const router = useRouter();

    const handleCreateCV = async () => { 
        const resumeId = await createCV(userId);
        router.push(`/create-cv/${resumeId}/contact-details`);
    }

    const handleRename = async(resumeId: number, title: string) => { 
        console.log("Handle rename called for parameters: ", resumeId, " ", title); 
        const response = await renameCV(resumeId, title); 
    }

    return (
        <div className="mt-10 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold mb-4">Dashboard</h2>
            <p className="text-gray-600 mb-6">
                Here you can view and manage your resumes.
            </p>

            {resumes.length === 0 ? (
                <p className="text-gray-500 mb-6">
                    You haven't created any resumes yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {resumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume} onRename = { handleRename } />
                    ))}
                </div>
            )}

            <Button className="w-full sm:w-auto" onClick={handleCreateCV}>
                Create New Resume
            </Button>
        </div>
    );
};