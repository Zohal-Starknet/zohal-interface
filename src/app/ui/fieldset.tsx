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
    <fieldset className="p-3 rounded-md bg-[#25272E] flex flex-col gap-1 border border-[#363636]">
      <label className="block text-xs" htmlFor={id}>
        {label}
      </label>
      {cloneElement(field, { id })}
    </fieldset>
  );
}
