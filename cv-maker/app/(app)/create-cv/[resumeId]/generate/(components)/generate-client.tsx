"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2, Sparkles } from "lucide-react";

interface GenerateClientPanelProps {
    resumeId: number;
}

export function GenerateClientPanel({ resumeId }: GenerateClientPanelProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateAction = async () => { 

    }

    return (
        <Card className="w-full max-w-md border-violet-500/30 bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-violet-900/20 relative z-10">
            <CardHeader className="text-center pb-2 space-y-4">
                <div className="mx-auto bg-black p-4 rounded-2xl w-fit mb-2 shadow-inner shadow-violet-500/10 ring-1 ring-violet-500/30">
                    <FileText className="w-10 h-10 text-violet-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]" />
                </div>
                <div>
                    <CardTitle className="text-2xl font-bold text-zinc-100 flex items-center justify-center gap-2">
                        Finalizare CV <Sparkles className="w-5 h-5 text-violet-400" />
                    </CardTitle>
                    <CardDescription className="text-zinc-400 text-base mt-2">
                        Datele tale sunt pregătite. Apasă butonul pentru a compila și descărca documentul PDF profesional.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
                <Button 
                    onClick={handleGenerateAction}
                    disabled={isLoading}
                    className="w-full relative group overflow-hidden bg-violet-500 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-6 text-lg transition-all duration-300 shadow-[0_0_30px_-5px_rgba(124,58,237,0.5)] hover:shadow-[0_0_40px_-5px_rgba(124,58,237,0.7)] border-0"
                >
                    <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
                    
                    <div className="relative flex items-center justify-center gap-3">
                        {isLoading ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin text-violet-200" />
                                Se procesează...
                            </>
                        ) : (
                            <>
                                <Download className="h-6 w-6 text-violet-100 group-hover:scale-110 transition-transform" />
                                GENEREAZĂ PDF
                            </>
                        )}
                    </div>
                </Button>
            </CardContent>
        </Card>
    );
}