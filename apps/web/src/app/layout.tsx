import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://web-seven-pied-41.vercel.app"),
  title: "Lemonade - Mindful Spending",
  description:
    "A pre-purchase reuse companion that helps you check what you already own.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Lemonade - Mindful Spending",
    title: "Lemonade - Mindful Spending",
    description:
      "A gamified hackathon prototype that helps people pause before buying and reuse what they already own.",
    images: [
      {
        url: "/art/lemonade-lane-town.png",
        width: 1672,
        height: 941,
        alt: "Lemonade Lane mindful-spending town dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lemonade - Mindful Spending",
    description:
      "A gamified hackathon prototype for pausing purchases and reusing what you own.",
    images: ["/art/lemonade-lane-town.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
