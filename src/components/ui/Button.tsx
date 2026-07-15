import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import Link from "next/link";

type ButtonBaseProps = {
  variant?: "primary" | "secondary";
  size?: "default" | "lg";
  loading?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClasses =
  "btn-primary";

const sizeClasses: Record<string, string> = {
  default: "",
  lg: "btn-lg",
};

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "default",
    loading = false,
    className = "",
    ...rest
  } = props;

  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;

  if (props.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {props.children}
      </Link>
    );
  }

  const { ...buttonProps } = rest as ButtonAsButton;
  return (
    <button
      className={classes}
      disabled={loading || buttonProps.disabled}
      {...buttonProps}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Processing…
        </span>
      ) : (
        props.children
      )}
    </button>
  );
}