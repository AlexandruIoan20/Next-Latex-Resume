import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#f4f4f5",
            },
            classNames: {
              description: "text-zinc-400",
              success: "!border-l-4 !border-l-violet-500",
              error: "!border-l-4 !border-l-red-500",
            },
          }}
        />
      </body>
    </html>
  )
}