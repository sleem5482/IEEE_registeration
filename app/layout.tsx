// app/layout.tsx
import "./globals.css";
import { Inter, Cairo, Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

// Google Fonts
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-cairo" });

// Geist fonts
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cairo.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
