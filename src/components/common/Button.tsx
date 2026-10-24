import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

interface LinkButtonProps extends Omit<ButtonProps, "onClick" | "type"> {
  href: string;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  "aria-label": ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  target,
  rel,
  "aria-label": ariaLabel,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
