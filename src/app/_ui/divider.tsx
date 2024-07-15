"use client";

import clsx from "clsx";

type DividerProps = {
  /** Vertical margin applied - in Tailwind spacing unit */
  className?: string;
};

export default function Divider(props: DividerProps) {
  const { className } = props;

  return (
    <hr
      className={clsx(
        "border-border bg-border h-0 w-full border-solid",
        className,
      )}
    />
  );
}
