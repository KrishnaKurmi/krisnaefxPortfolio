import { ReactNode, ElementType } from "react";
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
  const Tag: ElementType = as;

  return (
    <Tag className={`${styles.container} ${className}`}>
      {children}
    </Tag>
  );
}
