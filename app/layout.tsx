import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Cornerstone",
  description: "Bespoke Interior Architecture & Spatial Design, New Delhi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}