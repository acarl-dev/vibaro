import { ReactNode, ButtonHTMLAttributes } from "react";

type StudioButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type StudioButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: StudioButtonVariant;
  children: ReactNode;
};

const VARIANT_CLASS: Record<StudioButtonVariant, string> = {
  primary: "studio-btn studio-btn-primary",
  secondary: "studio-btn studio-btn-secondary",
  danger: "studio-btn studio-btn-danger",
  ghost: "studio-btn studio-btn-ghost",
};

export default function StudioButton({
  variant = "primary",
  children,
  className = "",
  ...props
}: StudioButtonProps) {
  return (
    <button
      className={`${VARIANT_CLASS[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
