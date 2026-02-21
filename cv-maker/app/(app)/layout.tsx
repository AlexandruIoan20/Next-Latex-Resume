import { Navbar } from "./navbar";
import { logoutUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <div className="w-full bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold">
                CV <span className="text-violet-400">Builder</span>
              </span>
            </div>

            {/* Logout */}
            <form action={logoutUser}>
              <button className="bg-violet-600 hover:bg-violet-700 transition px-4 py-2 rounded-xl text-sm font-medium">
                Logout
              </button>
            </form>

          </div>
        </div>
      {children}
    </>
  );
}