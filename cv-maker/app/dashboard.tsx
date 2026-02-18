"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createCV } from "./create-cv/actions";

export const Dashboard = () => {
    const router = useRouter();

    const handleCreateCV = async () => { 
        const userId = 1; 

        const resumeId = await createCV(userId);
        router.push(`/create-cv/${resumeId}/contact-details`);
    }
    return (
        <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <p>Aici poți adăuga conținut specific pentru utilizatorul logat.</p>

            <Button onClick={handleCreateCV}>Create CV</Button>
        </div>
    );
};