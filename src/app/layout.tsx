import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://krishnakushwaha.com"),
  title: "Krishna Kushwaha | Editor, Motion Designer, VFX Artist",
  description:
    "Cinematic editing, motion design, and VFX. Precision-crafted work for creators and brands.",
  openGraph: {
    title: "Krishna Kushwaha | Editor & Motion Designer",
    description:
      "Cinematic editing, motion design, and VFX. Precision-crafted work for creators and brands.",
    type: "website",
    url: "https://krishnakushwaha.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Krishna Kushwaha Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishna Kushwaha | Editor & Motion Designer",
    description: "Cinematic editing, motion design, and VFX.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f0f0f" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
