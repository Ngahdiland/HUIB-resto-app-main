import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import useAuthRedirect from '@/hooks/useAuthRedirect';
import AuthGuard from '@/components/AuthGuard';
import { CartProvider } from '../context/CartContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CCF Resto",
  description: "Food ordering system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-red-600 min-h-screen antialiased">
        <CartProvider>
          <AuthGuard>
            <main>
              {children}
            </main>
          </AuthGuard>
        </CartProvider>
      </body>
    </html>
  );
}
