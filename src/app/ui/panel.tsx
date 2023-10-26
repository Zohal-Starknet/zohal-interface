import { type PropsWithChildren } from "react";

type PanelProps = {
  className?: string;
};

// TODO - Use clsx package to resolve className merge issues
// TODO @YohanTz: take tabsItems as a prop
export default function Panel(props: PropsWithChildren<PanelProps>) {
  const { children, className } = props;

  return <div className={`flex ${className}`}>{children}</div>;
}
