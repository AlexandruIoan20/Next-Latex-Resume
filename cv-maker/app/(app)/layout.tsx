import { Navbar } from "./navbar";
import { logoutUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar /> 
      {children}
    </>
  );
}