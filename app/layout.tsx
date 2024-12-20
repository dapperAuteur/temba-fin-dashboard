import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./(components)/Header";
import AuthProvider from "./(components)/AuthProvider";
import ConsoltoChat from "./(components)/ConsoltoChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elementary MBA Dashboard",
  description: "Financial dashboard to help you get your money right and understand what right is.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header/>
          {children}
          <ConsoltoChat/>
        </body>
      </AuthProvider>
    </html>
  );
}
