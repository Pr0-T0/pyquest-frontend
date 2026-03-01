"use client";

import { usePathname } from "next/navigation";
import AnimatedBackground from "./animated-background";

export default function BackgroundWrapper() {
  const pathname = usePathname();

  // Disable on coding pages: /learn/1/5
  const isCodingPage =
    pathname.startsWith("/learn/") &&
    pathname.split("/").length === 4;

  if (isCodingPage) return null;

  return <AnimatedBackground />;
}