import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./lib/ThemeContext";

export const metadata: Metadata = {
  title: "Zoiko One Super Admin",
  description: "Enterprise governance, security, and operations for Zoiko One.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
