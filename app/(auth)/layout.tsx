export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen w-full">
        <main className="w-full min-h-screen flex items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}