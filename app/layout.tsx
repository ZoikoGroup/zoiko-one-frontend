import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0A0F1C] text-white">{children}</body>
    </html>
  );
}
