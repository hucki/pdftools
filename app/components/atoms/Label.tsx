import { ReactNode } from "react";

export const Label = ({ children }: { children: ReactNode }) => {
  return (
    <label className="text-slate-500 italic text-xs m-1">{children}</label>
  );
};
