import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body className="bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}