"use client";
type DividerProps = {
  /** Vertical margin applied - in Tailwind spacing unit */
  verticalMargin?: number;
};

export default function Divider(props: DividerProps) {
  const { verticalMargin } = props;

  return (
    <hr
      className={`h-0 w-full bg-[#2A2E37] border-[#2A2E37] border-solid ${
        verticalMargin !== undefined ? `my-${verticalMargin}` : ""
      }`}
    />
  );
}
