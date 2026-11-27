import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "@fontsource-variable/outfit";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PublicOnly from "@/components/PublicOnly";

export const metadata: Metadata = {
  title: "MentorLagbe – Find a tutor who gets your subject",
  description: "Search approved online and home tutors by class, subject and budget.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <Suspense fallback={null}>
          <PublicOnly><Navbar /></PublicOnly>
        </Suspense>
        <main className="flex-1">{children}</main>
        <Suspense fallback={null}>
          <PublicOnly><Footer /></PublicOnly>
        </Suspense>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
