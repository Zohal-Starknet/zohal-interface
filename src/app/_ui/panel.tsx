import clsx from "clsx";
import { type PropsWithChildren } from "react";

type PanelProps = {
  className?: string;
};

// TODO @YohanTz: take tabsItems as a prop
export default function Panel(props: PropsWithChildren<PanelProps>) {
  const { children, className } = props;

  return <div className={clsx("flex", className)}>{children}</div>;
}
