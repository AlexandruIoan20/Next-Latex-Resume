"use client"

import { useState } from "react"
import { useFieldArray, UseFormReturn, FieldValues, ArrayPath } from "react-hook-form"
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SortableArraySectionProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: ArrayPath<T>; 
  title: string;
  subtitle: string;
  icon: React.ElementType;
  emptyMessage: string;
  submitLabel: string;
  newItemTemplate: any; 
  onSubmit: (data: T) => Promise<void>;
  getCardHeader: (index: number) => { title: string; subtitle: string };
  renderFields: (index: number) => React.ReactNode;
}

export function SortableArraySection<T extends FieldValues>({
  form,
  name,
  title,
  subtitle,
  icon: Icon,
  emptyMessage,
  submitLabel,
  newItemTemplate,
  onSubmit,
  getCardHeader,
  renderFields,
}: SortableArraySectionProps<T>) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name,
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-violet-400 to-white bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-zinc-500 text-sm">{subtitle}</p>
        </div>
        <Button
          type="button"
          onClick={() => append(newItemTemplate)}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-12 w-12 shadow-lg shadow-violet-900/20"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {fields.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/50">
              <Icon className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500">{emptyMessage}</p>
            </div>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => {
              const cardHeader = getCardHeader(index);

              return (
                <Collapsible
                  key={field.id}
                  open={openItems[field.id]}
                  onOpenChange={(val) => setOpenItems((prev) => ({ ...prev, [field.id]: val }))}
                >
                  <Card className="bg-zinc-900 border-zinc-800 overflow-hidden transition-all hover:border-zinc-700">
                    <CardHeader className="bg-zinc-900/50 border-b border-zinc-800/50 p-4 flex flex-row items-center justify-between space-y-0">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-violet-600/10 flex items-center justify-center border border-violet-600/20">
                          <Icon className="h-5 w-5 text-violet-500" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold text-zinc-100">
                            {cardHeader.title}
                          </CardTitle>
                          <p className="text-xs text-zinc-500">
                            {cardHeader.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="flex items-center bg-zinc-950/50 rounded-md border border-zinc-800/60 p-0.5">
                          <Button
                            type="button" variant="ghost" size="icon"
                            onClick={() => move(index, index - 1)} disabled={index === 0}
                            className="h-7 w-7 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button" variant="ghost" size="icon"
                            onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}
                            className="h-7 w-7 text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="w-px h-5 bg-zinc-800 mx-1"></div>
                        <CollapsibleTrigger asChild>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <ChevronDown className={cn("h-4 w-4 transition-transform", openItems[field.id] && "rotate-180")} />
                          </Button>
                        </CollapsibleTrigger>
                        <Button
                          type="button" variant="ghost" size="icon" onClick={() => remove(index)}
                          className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CollapsibleContent>
                      <CardContent className="p-6 space-y-6">
                        {renderFields(index)}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>

          {fields.length > 0 && (
            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-6">
              {submitLabel}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}