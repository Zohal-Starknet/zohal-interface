import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";

type ButtonVariant = "danger" | "primary" | "success";

type ButtonProps = {
  /**
   * Styling variant of the button
   * @default "primary"
   * */
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

// TODO: Require aria-label on buttons
export default function Button(props: PropsWithChildren<ButtonProps>) {
  const { children, className, variant = "primary", ...buttonProps } = props;

  const buttonStyle = buttonVariantStyles[variant];

  return (
    <button
      {...buttonProps}
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
