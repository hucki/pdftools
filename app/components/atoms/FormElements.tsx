import { ReactNode } from "react";

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  title?: string;
  pattern?: string;
}
export const Input = ({
  label,
  value,
  name,
  disabled = false,
  onChange,
  autoComplete,
  placeholder,
  required,
  type = "text",
  title,
  pattern,
}: InputProps) => {
  return (
    <Label>
      {label}
      <input
        className="text-slate-900 text-sm w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        type={type}
        autoComplete={autoComplete}
        name={name}
        title={title}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
      />
    </Label>
  );
};

export const Label = ({ children }: { children: ReactNode }) => {
  return (
    <label className="text-sm text-slate-500 italic  m-1">{children}</label>
  );
};
