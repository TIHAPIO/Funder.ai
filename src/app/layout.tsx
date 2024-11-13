import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/navigation/sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "fundr.ai - CRM für Fundraising",
  description: "CRM-System für die Verwaltung von Fundraising-Kampagnen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen">
          <div className="w-64 h-full">
            <Sidebar />
          </div>
          <div className="flex-1 overflow-auto">
            <main className="p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
