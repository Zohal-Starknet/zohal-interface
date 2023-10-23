import {
  type AccessibleIconProps,
  Root,
} from "@radix-ui/react-accessible-icon";

type IconProps = {
  className?: string;
} & AccessibleIconProps;

export function SwapIcon(props: IconProps) {
  const { label, ...otherProps } = props;

  return (
    <Root label={label}>
      <svg
        aria-hidden="true"
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
        x="256"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        y="256"
        {...otherProps}
      >
        <path
          d="M11 8L7 4m0 0L3 8m4-4v16m6-4l4 4m0 0l4-4m-4 4V4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
      </svg>
    </Root>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      height="24"
      role="img"
      viewBox="0 0 24 24"
      width="24"
      x="256"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      y="256"
      {...props}
    >
      <path
        d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6l4.6-4.6Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
