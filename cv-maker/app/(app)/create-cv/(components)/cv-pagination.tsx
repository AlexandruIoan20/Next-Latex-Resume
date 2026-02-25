"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react";

interface CVPaginationProps { 
    linkLeft?: string, 
    linkRight?: string, 
}

export default function CVPagination({ linkLeft, linkRight }: CVPaginationProps) { 
    const router = useRouter(); 

    return ( 
        <div className="flex w-full items-center justify-center gap-5 py-4 px-4 
                bottom-0 left-0 right-0 
                border-t border-zinc-800/50 bg-zinc-950">
            <Button
                variant="outline"
                type = "button"
                className="flex items-center gap-2 border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                onClick={() => { 
                    if(linkLeft) router.push(linkLeft)
                }}
                disabled={!linkLeft}
            >
                <ArrowLeft className="w-4 h-4" /> 
                Back
            </Button>

            <Button
                type = "button"
                className="flex items-center gap-2 bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => { 
                    if(linkRight) router.push(linkRight)
                }}
                disabled={!linkRight}
            >
                Next
                <ArrowRight className="w-4 h-4" /> 
            </Button>
            
        </div>
    )
}