import type {
  Metadata,
  Viewport,
} from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PLATON Network",
  description:
    "Official PLATON digital currency ecosystem",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#030405",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh w-full flex-col overflow-x-hidden">
        {children}

        <Toaster
          position="top-right"
          containerStyle={{
            maxWidth:
              "calc(100vw - 24px)",
          }}
          toastOptions={{
            style: {
              maxWidth:
                "calc(100vw - 24px)",
              background: "#05070A",
              color: "#fff",
              border:
                "1px solid rgba(255,255,255,0.12)",
            },
          }}
        />
      </body>
    </html>
  );
}
