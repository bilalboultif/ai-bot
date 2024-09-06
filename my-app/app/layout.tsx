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
import { ModalProvider } from "@/components/ui/modal-provider";
import { ToasterProvider } from "@/components/toaster-provider";
import { CrispProvider } from "@/components/ui/crisp-provider";

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
        <CrispProvider/>
        <body className={inter.className}>
          <ModalProvider/>
          <ToasterProvider/>
          {children}
        </body>
      </html>
    </LanguageProvider>
  </ClerkProvider>
  );
}
