import { ReactNode } from "react";
import { Link as RemixLink } from "@remix-run/react";

type LinkProps = {
  className?: string;
  to: string;
  children?: ReactNode;
};
export const Link = ({ to, className, children }: LinkProps) => {
  return (
    <RemixLink
      className={`grid grid-cols-[1fr_2fr] px-2 py-1 m-1 text-xs items-center bg-blue-100 rounded hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
      to={to}
    >
      {children}
    </RemixLink>
  );
};
