import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google"; // Verify Orbitron availability
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GlobalLoadingIndicator } from "@/components/shared/GlobalLoadingIndicator";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

// Orbitron is a variable font on Google Fonts? 
// Actually it has weights. Let's specify them to be safe.
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "TechnoHack 2026",
  description: "From Ideas to Impact - The Ultimate Tech Fest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
        <body className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-black">
          <GlobalLoadingIndicator />
          <Navbar />
          <main className="flex-grow pt-16 relative z-10">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
