import { PropsWithChildren } from "react";

type FormProps = {
  /** Handler called when form is submitted */
  onSubmit?: () => void;
};

export default function Form(props: PropsWithChildren<FormProps>) {
  const { children, onSubmit } = props;

  return (
    <form
      className="py-4 flex flex-col gap-1.5 h-full"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
    >
      {children}
    </form>
  );
}
