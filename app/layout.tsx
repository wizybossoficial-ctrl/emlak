import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emlak | Spaces for a life well lived",
  description: "Discover exceptional homes and explore them in 3D with Emlak.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
