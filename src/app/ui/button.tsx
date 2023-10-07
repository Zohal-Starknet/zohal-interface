import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "success" | "danger";

type ButtonProps = {
  /**
   * Styling variant of the button
   * @default "primary"
   * */
  variant?: ButtonVariant;
  /** Label displayed in the Button */
  label: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: ButtonProps) {
  const { variant = "primary", label, className, ...buttonProps } = props;

  const buttonColor = `bg-btn-${variant}`;

  return (
    <button
      {...buttonProps}
      className={`p-2 rounded-md ${buttonColor} ${
        className !== undefined ? className : ""
      }`}
      aria-label={label}
    >
      {label}
    </button>
  );
}
