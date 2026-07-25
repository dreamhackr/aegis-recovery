import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aegis-Recovery | Multi-Modal GenAI Recovery Platform",
  description: "Evidence-based craving management, caregiver support, and real-time clinical monitoring for substance use disorder recovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
