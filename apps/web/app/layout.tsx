import type { Metadata } from "next";
import { Familjen_Grotesk } from "next/font/google";
import "./globals.css";

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
});

export const metadata: Metadata = {
  title: "Vynq",
  description: "Private, one-to-one conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={familjen.variable}>
      <body>{children}</body>
    </html>
  );
}
