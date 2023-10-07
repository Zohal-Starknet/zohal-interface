import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary";

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

  const buttonColor = `bg-button-${variant}`;

  return (
    <button
      {...buttonProps}
      className={`${buttonColor} ${className !== undefined ? className : ""}`}
      aria-label={label}
    >
      {label}
    </button>
  );
}
