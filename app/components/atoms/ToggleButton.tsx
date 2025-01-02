interface ToggleButtonProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const ToggleButton = ({ label, value, onChange }: ToggleButtonProps) => {
  return (
    <button
      className={`${
        value ? "bg-green-500" : "bg-red-500"
      } text-white rounded-md p-1`}
      onClick={() => onChange(!value)}
    >
      {label}
    </button>
  );
};
