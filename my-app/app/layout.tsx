import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { LanguageProvider } from '../components/contexts/LanguageContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maria-AI",
  description: "Bilal Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <LanguageProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </LanguageProvider>
  </ClerkProvider>
  );
}
