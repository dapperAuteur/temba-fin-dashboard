import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./(components)/Header";
import AuthProvider from "./(components)/AuthProvider";
import ConsoltoChat from "./(components)/ConsoltoChat";
import ThemeProviderWrapper from "./(components)/ThemeProviderWrapper";
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
          <AuthProvider>
            <ThemeProviderWrapper>
              
                <Header/>
                <RouteGuard>
                  {children}
                </RouteGuard>
                <ConsoltoChat/>
              </ThemeProviderWrapper>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
