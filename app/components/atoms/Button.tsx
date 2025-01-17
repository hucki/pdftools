interface ButtonProps {
  label: string;
}

export const Button = ({ label }: ButtonProps) => {
  return (
    <button className="bg-green-500 text-white rounded-md p-1">{label}</button>
  );
};

interface DeleteButtonProps {
  handleDelete: () => void;
  className?: string;
}

export const DeleteButton = ({
  handleDelete,
  className,
}: DeleteButtonProps) => {
  return (
    <button
      aria-label="reset"
      onClick={handleDelete}
      className={`m-1 cursor-pointer bg-red-500 text-white text-base font-sans rounded-md h-6 w-6 text-center justify-center ${className}`}
    >
      ⊖
    </button>
  );
};

interface ToggleButtonProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const ToggleButton = ({ label, value, onChange }: ToggleButtonProps) => {
  return (
    <button
      className={`w-full ${
        value ? "bg-green-500" : "bg-orange-500"
      } text-white py-3 rounded-lg ${
        value ? "hover:bg-green-600" : "hover:bg-orange-600"
      } focus:outline-none focus:ring-2 ${
        value ? "focus:ring-green-500" : "focus:ring-orange-500"
      }`}
      onClick={() => onChange(!value)}
    >
      {label}
    </button>
  );
};
