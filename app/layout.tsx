import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import IridescenceWrapper from "@/components/IridescenceWrapper";


export const metadata: Metadata = {
  title: "Campus Canteen - Food Ordering System",
  description:
    "Order delicious meals from our campus canteen with ease. Fresh food, quick service, and convenient ordering.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className="font-sans">
        {/* ✅ Iridescence yahan hai — page re-render pe kabhi re-mount nahi hoga */}
        <IridescenceWrapper />
        {children}
      </body>
    </html>
  );
}