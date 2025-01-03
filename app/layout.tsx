'use client';
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import "./globals.css";
import { AuthProvider } from "./Providers";
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter(); // Use next/navigation

  return (
    <html lang="en">
      <body className={inter.className}>
        < AuthProvider >
          {children}
        </ AuthProvider >
      </body>
    </html>
  );
}
