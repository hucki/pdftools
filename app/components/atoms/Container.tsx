import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  bg?: string;
  className?: string;
  rounded?: string;
  shadow?: string;
}

export const Container = ({
  children,
  className,
  bg = "bg-white",
  rounded = "rounded-md",
  shadow = "shadow-md",
}: ContainerProps) => {
  return (
    <div
      className={`p-4 ${bg} ${rounded} ${shadow} grid gap-2 auto-rows-max ${className}`}
    >
      {children}
    </div>
  );
};
