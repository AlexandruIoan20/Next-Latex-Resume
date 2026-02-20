import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface UpdatedDatePickerProps {
  mode: "start" | "finish";
  value: Date | null | undefined;
  onChange: (date: Date | null | undefined) => void;
  placeholder?: string;
}

export function UpdatedDatePicker({ 
  mode, 
  value, 
  onChange, 
  placeholder = "Pick date" 
}: UpdatedDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const isPresent = value === null; 
  const isUnspecified = value === undefined;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left font-normal text-zinc-300 bg-zinc-950 border-zinc-800",
            isUnspecified && "text-zinc-500"
          )}
        >
          {isPresent ? (
            <span>Present</span>
          ) : value ? (
            format(value, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={(date) => {
            if (date) {
              onChange(date);
              setIsOpen(false);
            }
          }}
          disabled={(date) => date > new Date()}
          initialFocus
          className="text-zinc-300"
        />
    
        { mode === "finish" && (
            <div className="p-3 border-t border-zinc-800">
                <Button
                    type="button" 
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
                      isPresent && "bg-zinc-800 text-zinc-100 font-medium"
                    )}
                    onClick={() => {
                      onChange(null);
                      setIsOpen(false); 
                    }}
                >
                    I currently work here
                </Button>
            </div>   
        )}

        <div className="p-3 border-t border-zinc-800">
            <Button
                type="button" // PREVINE SUBMIT-UL ACCIDENTAL
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
                  isUnspecified && "bg-zinc-800 text-zinc-100 font-medium"
                )}
                onClick={() => {
                  onChange(undefined);
                  setIsOpen(false); // Închidem popover-ul
                }}
            >
                Don't want to specify
            </Button>
        </div>   
      </PopoverContent>
    </Popover>
  )
}