import { ReactElement, cloneElement, useId } from "react";

type FieldsetProps = {
  /** Label shown for the Field */
  label: string;
  /** Component displayed for the Field */
  field: ReactElement;
};

export default function Fieldset(props: FieldsetProps) {
  const { label, field } = props;

  const id = useId();

  return (
    <fieldset className="p-3 rounded-md bg-[#25272E] flex flex-col gap-1 border border-[#363636]">
      <label htmlFor={id} className="block text-xs">
        {label}
      </label>
      {cloneElement(field, { id })}
    </fieldset>
  );
}
