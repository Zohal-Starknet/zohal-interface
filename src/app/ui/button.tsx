import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "success" | "danger";

type ButtonProps = {
  /**
   * Styling variant of the button
   * @default "primary"
   * */
  variant?: ButtonVariant;
  /** Label displayed in the Button */
  children: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const { variant = "primary", children, className, ...buttonProps } = props;

  const buttonStyle = buttonVariantStyles[variant];

  return (
    <button
      {...buttonProps}
      className={`p-2 rounded-md ${buttonStyle} ${
        className !== undefined ? className : ""
      }`}
      aria-label={children}
    >
      {children}
    </button>
  );
}

const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary: "bg-btn-primary",
  success: "bg-btn-success",
  danger: "bg-btn-danger",
};
