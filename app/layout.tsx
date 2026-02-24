import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blog Home - Discover Insights, Tutorials & Ideas",
  description: "Explore our collection of insightful articles, tutorials, and ideas on technology, business, programming, lifestyle, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
