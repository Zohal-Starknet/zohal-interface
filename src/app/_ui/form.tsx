import clsx from "clsx";
import { type PropsWithChildren } from "react";

type FormProps = {
  /** className for the form component */
  className?: string;
  /** Handler called when form is submitted */
  onSubmit?: () => void;
};

export default function Form(props: PropsWithChildren<FormProps>) {
  const { children, className, onSubmit } = props;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className={clsx("flex h-full flex-col gap-1.5 pt-4", className)}
    >
      {children}
    </form>
  );
}
