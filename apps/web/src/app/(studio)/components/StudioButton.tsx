import { ReactNode, ButtonHTMLAttributes } from "react";

type StudioButtonVariant = "primary" | "secondary" | "danger";
type StudioButtonSize = "md" | "sm" | "icon";

type StudioButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: StudioButtonVariant;
  size?: StudioButtonSize;
  children: ReactNode;
};

const VARIANT_CLASS: Record<StudioButtonVariant, string> = {
  primary: "studio-btn studio-btn-primary",
  secondary: "studio-btn studio-btn-secondary",
  danger: "studio-btn studio-btn-danger",
};

const SIZE_CLASS: Record<StudioButtonSize, string> = {
  md: "",
  sm: "studio-btn-sm",
  icon: "studio-btn-icon",
};

export default function StudioButton({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: StudioButtonProps) {
  const sizeClass = SIZE_CLASS[size];
  return (
    <button
      className={[VARIANT_CLASS[variant], sizeClass, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
