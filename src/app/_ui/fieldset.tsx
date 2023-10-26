import { type ReactElement, cloneElement, useId } from "react";

type FieldsetProps = {
  /** Component displayed for the Field */
  field: ReactElement;
  /** Label shown for the Field */
  label: string;
};

export default function Fieldset(props: FieldsetProps) {
  const { field, label } = props;

  const id = useId();

  return (
    <fieldset className="flex flex-col gap-1 rounded-md border border-[#363636] bg-[#25272E] p-3">
      <label className="block text-xs" htmlFor={id}>
        {label}
      </label>
      {cloneElement(field, { id })}
    </fieldset>
  );
}
