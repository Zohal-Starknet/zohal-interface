import { PropsWithChildren, ReactNode } from "react";

type PanelProps = {
  className?: string;
};

// TODO - Use clsx package to resolve className merge issues
export default function Panel(props: PropsWithChildren<PanelProps>) {
  const { children, className } = props;

  return <div className={`flex ${className}`}>{children}</div>;
}
