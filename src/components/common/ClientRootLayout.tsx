"use client";

import { ReactNode } from "react";
import { ArchiveTransitionProvider } from "./ArchiveTransitionProvider";

export function ClientRootLayout({ children }: { children: ReactNode }) {
  return (
    <ArchiveTransitionProvider>{children}</ArchiveTransitionProvider>
  );
}
