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
        "mt-1.5 h-0 w-full border-solid border-border bg-border",
        className,
      )}
    />
  );
}
