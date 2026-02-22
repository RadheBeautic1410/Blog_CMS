import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-indigo-400 to-violet-500 text-white shadow-md shadow-indigo-300/40 hover:from-indigo-500 hover:to-violet-600 hover:shadow-lg hover:shadow-indigo-400/50 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
  secondary:
    "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80 hover:bg-indigo-50 hover:text-indigo-600 hover:ring-indigo-200/60 transition-colors",
  outline:
    "border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-500 transition-all",
  ghost:
    "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs font-semibold gap-1.5 rounded-full",
  md: "px-5 py-2.5 text-sm font-semibold gap-2 rounded-full",
  lg: "px-8 py-3.5 text-base font-semibold gap-2 rounded-full",
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  type?: never;
  onClick?: () => void;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";

  const classes = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if ("href" in props && props.href) {
    const { href, type: _type, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { type = "button", onClick } = props;
  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
