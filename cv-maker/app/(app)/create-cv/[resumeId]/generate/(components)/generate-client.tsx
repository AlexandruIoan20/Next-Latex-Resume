"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2 } from "lucide-react";

interface GenerateClientPanelProps {
    resumeId: number;
}

export function GenerateClientPanel({ resumeId }: GenerateClientPanelProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateAction = async () => { 
        setIsLoading(true); 

        try { 
            const response = await fetch(`/api/generate/${resumeId}`, { 
                method: "GET"
            }); 

            if (!response.ok) {
                throw new Error("A apărut o problemă la generarea CV-ului.");
            }

            const blob = await response.blob(); 
            const url = window.URL.createObjectURL(blob); 

            const a = document.createElement('a'); 
            a.style.display = 'none'; 
            a.href = url; 

            a.download = `CV_${resumeId}.tex`; 
            document.body.appendChild(a); 
            
            a.click(); 

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a); 
            
            console.log("DONE"); 
        } catch(error) { 
            console.log(error); 
        } finally { 
            setIsLoading(false); 
        }
    }

    return (
        <Card className="w-full max-w-2xl text-zinc-300 bg-zinc-900 border-zinc-800 shadow-xl shadow-black/40">
            <CardHeader className="space-y-4 pt-8">
                <div className="flex justify-center">
                    <div className="bg-zinc-950 p-4 rounded-full border border-zinc-800 shadow-inner">
                        <FileText className="w-8 h-8 text-violet-400" />
                    </div>
                </div>
                <div>
                    <CardTitle className="text-3xl font-bold text-center text-white">
                        Finalizare CV
                    </CardTitle>
                    <CardDescription className="text-center text-zinc-400 text-base mt-2">
                        Datele tale sunt pregătite. Apasă butonul pentru a compila și descărca documentul profesional.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex justify-center pt-6 pb-10">
                <Button 
                    onClick={handleGenerateAction}
                    disabled={isLoading}
                    className="w-full max-w-md bg-violet-600 hover:bg-violet-700 text-white font-semibold py-6 text-lg transition-colors duration-200 shadow-lg shadow-violet-900/20"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Se procesează...
                        </>
                    ) : (
                        <>
                            <Download className="mr-2 h-5 w-5" />
                            Generează PDF
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}