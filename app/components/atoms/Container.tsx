import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="p-4 bg-white rounded-md shadow-md grid gap-2 auto-rows-max">
      {children}
    </div>
  );
};
