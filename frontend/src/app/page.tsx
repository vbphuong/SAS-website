import type { Metadata } from "next";
import LandingInteractive from "@/components/LandingInteractive";

export const metadata: Metadata = {
  title: { absolute: "SAS — Student Academic Success" },
  description:
    "Student Academic Success at Swinburne. Find expert tips for your units and book a free session.",
};

export default function HomePage() {
  return <LandingInteractive />;
}
