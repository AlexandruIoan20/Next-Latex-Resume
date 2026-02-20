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
// Importăm componentele pentru Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [explicitlyUnspecified, setExplicitlyUnspecified] = React.useState(false);
  
  // Starea internă care controlează ce lună/an arată calendarul (pornim de la valoarea setată sau de la data curentă)
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(
    value instanceof Date ? value : new Date()
  );

  const isPresent = value === null; 
  const isUnspecified = value === undefined;

  // Generăm anii (de anul curent până în 1970, perfect pentru CV-uri)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
            <span className="text-zinc-100 font-medium">Present</span>
          ) : value ? (
            format(value, "PPP")
          ) : explicitlyUnspecified ? (
            <span>Unspecified</span> 
          ) : (
            <span>{placeholder}</span> 
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800" align="start">
        
        {/* --- CUSTOM HEADER PENTRU AN SI LUNA --- */}
        <div className="flex gap-2 p-3 border-b border-zinc-800 bg-zinc-950/50">
          <Select
            value={calendarMonth.getMonth().toString()}
            onValueChange={(monthStr) => {
              const newDate = new Date(calendarMonth);
              newDate.setMonth(parseInt(monthStr));
              setCalendarMonth(newDate);
            }}
          >
            <SelectTrigger className="w-30 bg-zinc-950 border-zinc-800 text-zinc-300">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
              {months.map((m, i) => (
                <SelectItem key={m} value={i.toString()}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={calendarMonth.getFullYear().toString()}
            onValueChange={(yearStr) => {
              const newDate = new Date(calendarMonth);
              newDate.setFullYear(parseInt(yearStr));
              setCalendarMonth(newDate);
            }}
          >
            <SelectTrigger className="w-25 bg-zinc-950 border-zinc-800 text-zinc-300">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300 max-h-50">
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* ----------------------------------------- */}

        <Calendar
          mode="single"
          month={calendarMonth} // Pasăm state-ul nostru ca să afișeze luna selectată sus
          onMonthChange={setCalendarMonth} // Rămâne sincronizat dacă dă pe săgețile calendarului
          selected={value || undefined}
          onSelect={(date) => {
            if (date) {
              onChange(date);
              setExplicitlyUnspecified(false);
              setIsOpen(false); 
            }
          }}
          disabled={(date) => date > new Date()}
          className="text-zinc-300 pt-3" // am pus un pt-3 ca sa aiba spatiu fata de select-uri
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
                      setExplicitlyUnspecified(false); 
                      setIsOpen(false); 
                    }}
                >
                    I currently work here
                </Button>
            </div>   
        )}

        <div className="p-3 border-t border-zinc-800">
            <Button
                type="button" 
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800",
                  (isUnspecified && explicitlyUnspecified) && "bg-zinc-800 text-zinc-100 font-medium"
                )}
                onClick={() => {
                  onChange(undefined);
                  setExplicitlyUnspecified(true); 
                  setIsOpen(false); 
                }}
            >
                Don't want to specify
            </Button>
        </div>   
      </PopoverContent>
    </Popover>
  )
}