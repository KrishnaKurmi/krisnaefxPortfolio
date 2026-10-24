import styles from "./Section.module.css";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  id?: string;
}

export function Section({
  children,
  className = "",
  spacing = "xl",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${styles.section} ${styles[`spacing-${spacing}`]} ${className}`}
    >
      {children}
    </section>
  );
}
