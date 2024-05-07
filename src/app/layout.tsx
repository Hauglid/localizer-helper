import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Locale Editor",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} flex h-full w-full flex-col items-center`}
      >
        {children}
        <Toaster richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
