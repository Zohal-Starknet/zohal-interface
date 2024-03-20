"use client";

import {
  type AccessibleIconProps,
  Root,
} from "@radix-ui/react-accessible-icon";

type IconProps = {
  className?: string;
} & AccessibleIconProps;

export function LoadIcon(props: IconProps) {
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
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </Root>
  );
}

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

export function ExternalLinkIcon(props: IconProps) {
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
        <path d="M7 7h10v10" />
        <path d="M7 17 17 7" />
      </svg>
    </Root>
  );
}

export function CopyIcon(props: IconProps) {
  const { label, ...otherProps } = props;

  return (
    <Root label={label}>
      <svg
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <path d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </g>
      </svg>
    </Root>
  );
}

export function DisconnectIcon(props: IconProps) {
  const { label, ...otherProps } = props;

  return (
    <Root label={label}>
      <svg
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        viewBox="0 0 14 14"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
        {...otherProps}
      >
        <path d="M9.5 10.5v2a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2M6.5 7h7m-2-2l2 2l-2 2" />
      </svg>
    </Root>
  );
}
