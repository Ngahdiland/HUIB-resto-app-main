export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-red-600 min-h-screen antialiased">
        <main className="w-full min-h-screen flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}