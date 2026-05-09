import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Factiso – Latest Facts, Guides & Trending Information",
  description:
    "Discover useful facts, guides, and trending information on technology, lifestyle, education, and more. Factiso brings easy-to-read blogs for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} font-sans antialiased`}>
        {children}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="UiYqrssSU7dTlsLn2acJjw"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
