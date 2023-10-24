import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "danger" | "primary" | "success";

type ButtonProps = {
  /** Label displayed in the Button */
  children: string;
  /**
   * Styling variant of the button
   * @default "primary"
   * */
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const { children, className, variant = "primary", ...buttonProps } = props;

  const buttonStyle = buttonVariantStyles[variant];

  return (
    <button
      {...buttonProps}
      aria-label={children}
      className={`rounded-md p-2 ${buttonStyle} ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

const buttonVariantStyles: Record<ButtonVariant, string> = {
  danger: "bg-btn-danger",
  primary: "bg-btn-primary",
  success: "bg-btn-success",
};
