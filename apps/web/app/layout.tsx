import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
