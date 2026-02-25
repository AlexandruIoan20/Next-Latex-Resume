import { NextResponse, NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { loadData } from "@/lib/loadResumeData";
import { generateLatexCode } from "@/lib/escapeLatex";

export async function GET (request: NextRequest, { params } : { params: Promise<{ resumeId: string }> }) {
    try { 
        const user = await getCurrentUser(); 
        if(!user) return new NextResponse("Unauthorized", { status: 401 }); 

        const resolvedParams = await params;
        const resumeId = Number(resolvedParams.resumeId);

        const resumeData = await loadData(resumeId); 
        if(!resumeData) return new NextResponse("CV was not found", { status: 404 }); 
        
        const latexString = generateLatexCode(resumeData); 

        const pdfResponse = await fetch("http://localhost:8080/generate-pdf", { 
            method: "POST", 
            body: JSON.stringify({ text: latexString }), 
            headers: { 
                "Content-Type": "application/json"
            }
        }); 

        if(!pdfResponse.ok) throw new Error("PDF Service Failed"); 
        const pdfBuffer = await pdfResponse.arrayBuffer(); 

        return new NextResponse(latexString, { 
            status: 200, 
            headers: { 
                "Content-Type": "application/pdf", 
                "Content-Disposition": `attachment; filename="cv-${resumeId}.tex"`
            }
        })
    } catch(error) { 
        console.error(error); 
        return new NextResponse("Internal Server Error", { status: 500 }); 
    }
}