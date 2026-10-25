"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArchiveTransition } from "./ArchiveTransition";
import { silenceAllMedia } from "@/utils/mediaCoordinator";

interface ArchiveTransitionContextType {
  isTransitionActive: boolean;
  triggerTransition: (targetUrl?: string) => void;
}

const ArchiveTransitionContext = createContext<ArchiveTransitionContextType>({
  isTransitionActive: false,
  triggerTransition: () => {},
});

export function useArchiveTransition() {
  return useContext(ArchiveTransitionContext);
}

export function ArchiveTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitionActive, setIsTransitionActive] = useState(false);

  const triggerTransition = useCallback(
    (targetUrl = "/gallery") => {
      silenceAllMedia();
      setIsTransitionActive(true);

      // If we are navigating to a different page, push route
      if (pathname !== targetUrl) {
        // Small delay so overlay starts mounting seamlessly before route push
        setTimeout(() => {
          router.push(targetUrl);
        }, 120);
      }
    },
    [pathname, router]
  );

  // Global click interceptor: any anchor tag targeting /gallery will trigger the shader transition
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Check if link navigates to /gallery
      if (href === "/gallery" || href.startsWith("/gallery?")) {
        e.preventDefault();
        e.stopPropagation();
        triggerTransition(href);
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [triggerTransition]);

  return (
    <ArchiveTransitionContext.Provider
      value={{
        isTransitionActive,
        triggerTransition,
      }}
    >
      {children}
      <ArchiveTransition
        isActive={isTransitionActive}
        onComplete={() => setIsTransitionActive(false)}
      />
    </ArchiveTransitionContext.Provider>
  );
}

export default ArchiveTransitionProvider;
