"use client";

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
      />
    </svg>
  );
}

export function TwitterIcon(props: IconProps) {
  const { label, ...otherProps } = props;
  return (
    <Root label={label}>
      <svg
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    </Root>
  );
}
