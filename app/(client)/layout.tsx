import ClientFooter from '@/components/client-footer';
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
        <main className="pt-16">
          {children}
        </main>
        <ClientFooter />
      </body>
    </html>
  );
}
