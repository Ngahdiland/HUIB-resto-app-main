import Navbar from '@/components/navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-red-600 min-h-screen antialiased">
        <Navbar />
        <main className="max-w-5xl mx-auto py-8 px-4">
          {children}
        </main>
      </body>
    </html>
  );
}
