"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Italic, List, ListOrdered } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({
            bulletList: {
                keepMarks: true,
                keepAttributes: false,
            },
            orderedList: {
                keepMarks: true,
                keepAttributes: false,
            },
        }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[140px] w-full rounded-md bg-zinc-950 px-3 py-2 text-sm text-zinc-200 focus:outline-none",
      },
    },
  })

  if (!editor) return null

  const Btn = ({
    active,
    onClick,
    children,
    disabled, 
  }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
    disabled?: boolean
  }) => (
    <Button
      type="button"
      size="icon"
      disabled = { disabled }
      variant="ghost"
      onClick={onClick}
      className={cn(
        "h-8 w-8 border border-zinc-800 text-white bg-zinc-900 hover:bg-zinc-800 hover:bold-1 transition",
        active && "bg-violet-600 text-white border-violet-500 hover:bg-violet-600"
      )}
    >
      {children}
    </Button>
  )

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 p-2 backdrop-blur">
        <Btn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Btn>

        <Btn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Btn>

        <Btn
            active={editor.isActive("bulletList")}
            onClick={() =>
                editor.chain().focus().toggleBulletList().run()
            }
            disabled={!editor.can().chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Btn>

        <Btn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Btn>
      </div>

      <div className="rounded-md border border-zinc-800 bg-zinc-950 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition">
        <EditorContent editor={editor} className="rich-editor" />
      </div>
    </div>
  )
}