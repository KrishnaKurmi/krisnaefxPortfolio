import { ReactNode } from "react";
import styles from "./Container.module.css";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "nav" | "header" | "footer" | "main";
}

export function Container({
  children,
  className = "",
  as = "div",
}: ContainerProps) {
  const Tag = as as any;

  return (
    <Tag className={`${styles.container} ${className}`}>
      {children}
    </Tag>
  );
}
