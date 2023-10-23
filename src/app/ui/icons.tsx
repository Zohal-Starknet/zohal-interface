import { Root, AccessibleIconProps } from "@radix-ui/react-accessible-icon";

type IconProps = {
  className?: string;
} & AccessibleIconProps;

export function SwapIcon(props: IconProps) {
  const { label, ...otherProps } = props;

  return (
    <Root label={label}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        x="256"
        y="256"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        {...otherProps}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M11 8L7 4m0 0L3 8m4-4v16m6-4l4 4m0 0l4-4m-4 4V4"
        ></path>
      </svg>
    </Root>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden="true"
      role="img"
      x="256"
      y="256"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6l4.6-4.6Z"
      ></path>
    </svg>
  );
}
