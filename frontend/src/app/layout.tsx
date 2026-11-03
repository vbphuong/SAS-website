import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const simplonNorm = localFont({
  src: [
    {
      path: "../../public/SimplonNorm-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/SimplonNorm-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/SimplonNorm-Medium.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/SimplonNorm-Medium.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/SimplonNorm-Medium.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-simplon",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "SAS — Student Academic Success", template: "%s — SAS" },
  description: "Student Academic Success at Swinburne University. Find unit tips and book a session.",
};

export const viewport: Viewport = {
  themeColor: "#111217",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={simplonNorm.variable}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
