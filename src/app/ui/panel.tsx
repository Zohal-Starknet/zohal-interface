import { type PropsWithChildren } from "react";

type PanelProps = {
  className?: string;
};

// TODO - Use clsx package to resolve className merge issues
export default function Panel(props: PropsWithChildren<PanelProps>) {
  const { children, className } = props;

  return (
    <div className={`flex rounded-md bg-[#1D1F23] p-2 ${className}`}>
      {children}
    </div>
  );
}
