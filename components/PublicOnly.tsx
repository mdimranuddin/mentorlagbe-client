"use client";

import { usePathname } from "next/navigation";

// The dashboard has its own top bar and sidebar, so the public navbar and footer are hidden there.
export default function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;
  return <>{children}</>;
}
