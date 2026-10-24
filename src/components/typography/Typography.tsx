import styles from "./Typography.module.css";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function H1({ children, className = "", id }: HeadingProps) {
  return (
    <h1 id={id} className={`${styles.h1} ${className}`}>
      {children}
    </h1>
  );
}

export function H2({ children, className = "", id }: HeadingProps) {
  return (
    <h2 id={id} className={`${styles.h2} ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = "", id }: HeadingProps) {
  return (
    <h3 id={id} className={`${styles.h3} ${className}`}>
      {children}
    </h3>
  );
}

export function H4({ children, className = "", id }: HeadingProps) {
  return (
    <h4 id={id} className={`${styles.h4} ${className}`}>
      {children}
    </h4>
  );
}

interface BodyProps {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "div" | "span";
  variant?: "primary" | "secondary" | "tertiary";
}

export function Body({
  children,
  className = "",
  as: As = "p",
  variant = "primary",
}: BodyProps) {
  return (
    <As className={`${styles.body} ${styles[variant]} ${className}`}>
      {children}
    </As>
  );
}

interface CaptionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export function Caption({
  children,
  className = "",
  variant = "secondary",
}: CaptionProps) {
  return (
    <span className={`${styles.caption} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export function Label({ children, className = "" }: LabelProps) {
  return (
    <span className={`${styles.label} ${className}`}>
      {children}
    </span>
  );
}
