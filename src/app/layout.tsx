import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Locale Manager",
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
        <div className="w-full overflow-y-scroll">
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full rounded-lg border"
          >
            <ResizablePanel defaultSize={200} />
            <ResizableHandle />
            <ResizablePanel defaultSize={1200}>{children}</ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={200} />
          </ResizablePanelGroup>
        </div>
        <Toaster richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
