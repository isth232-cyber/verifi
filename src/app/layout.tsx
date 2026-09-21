import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRUSTVERIFY AI — Digital Forensics & Verification Platform",
  description:
    "Verify Before You Trust. Enterprise news credibility assessment, biometric face verification, and multi-factor intelligence platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#F4F6F8] text-[#17202A] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
