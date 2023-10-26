import { type PropsWithChildren } from "react";

type FormProps = {
  /** Handler called when form is submitted */
  onSubmit?: () => void;
};

export default function Form(props: PropsWithChildren<FormProps>) {
  const { children, onSubmit } = props;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="flex h-full flex-col gap-1.5 pt-4"
    >
      {children}
    </form>
  );
}
