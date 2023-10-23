"use client";
type DividerProps = {
  /** Vertical margin applied - in Tailwind spacing unit */
  className?: string;
};

export default function Divider(props: DividerProps) {
  const { className } = props;

  return (
    <hr
      className={`h-0 w-full bg-[#2A2E37] border-[#2A2E37] border-solid ${
        className !== undefined ? `${className}` : ""
      }`}
    />
  );
}
