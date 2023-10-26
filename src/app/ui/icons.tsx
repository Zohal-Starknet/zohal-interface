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
        fill="none"
        height="24"
        role="img"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        x="256"
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <path d="m3 16 4 4 4-4" />
        <path d="M7 20V4" />
        <path d="m21 8-4-4-4 4" />
        <path d="M17 4v16" />
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
