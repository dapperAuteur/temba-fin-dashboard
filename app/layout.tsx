import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./(components)/Header";
import AuthProvider from "./(components)/AuthProvider";
import ConsoltoChat from "./(components)/ConsoltoChat";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "./(components)/ErrorBoundary";
import { RouteGuard } from "./(components)/RouteGuard";

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
      <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              
                <Header/>
                <RouteGuard>
                  {children}
                </RouteGuard>
                <ConsoltoChat/>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
