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

type TactileButtonProps = {
  label: string;
  color?: "gray" | "blue" | "green" | "red" | "orange";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const TactileButton = ({
  label,
  color = "gray",
  ...props
}: TactileButtonProps) => {
  const colors = {
    gray: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      shadow:
        "shadow-[inset_0_0.0625em_0_0_rgb(243,244,246),0_0.0625em_0_0_rgb(229,231,235),0_0.125em_0_0_rgb(209,213,219),0_0.25em_0_0_rgb(156,163,175),0_0.3125em_0_0_rgb(156,163,175),0_0.375em_0_0_rgb(107,114,128),0_0.425em_0_0_rgb(75,85,99),0_0.425em_0.5em_0_rgb(107,114,128)]",
      activeShadow:
        "active:shadow-[inset_0_0.03em_0_0_rgb(243,244,246),0_0.03em_0_0_rgb(229,231,235),0_0.0625em_0_0_rgb(209,213,219),0_0.125em_0_0_rgb(156,163,175),0_0.125em_0_0_rgb(156,163,175),0_0.2em_0_0_rgb(107,114,128),0_0.225em_0_0_rgb(75,85,99),0_0.225em_0.375em_0_rgb(107,114,128)]",
    },
    blue: {
      bg: "bg-blue-500",
      text: "text-white",
      shadow:
        "shadow-[inset_0_0.0625em_0_0_rgb(191,219,254),0_0.0625em_0_0_rgb(147,197,253),0_0.125em_0_0_rgb(96,165,250),0_0.25em_0_0_rgb(59,130,246),0_0.3125em_0_0_rgb(37,99,235),0_0.375em_0_0_rgb(29,78,216),0_0.425em_0_0_rgb(30,64,175),0_0.425em_0.5em_0_rgb(37,99,235)]",
      activeShadow:
        "active:shadow-[inset_0_0.03em_0_0_rgb(191,219,254),0_0.03em_0_0_rgb(147,197,253),0_0.0625em_0_0_rgb(96,165,250),0_0.125em_0_0_rgb(59,130,246),0_0.125em_0_0_rgb(37,99,235),0_0.2em_0_0_rgb(29,78,216),0_0.225em_0_0_rgb(30,64,175),0_0.225em_0.375em_0_rgb(37,99,235)]",
    },
    green: {
      bg: "bg-green-500",
      text: "text-white",
      shadow:
        "shadow-[inset_0_0.0625em_0_0_rgb(220,252,231),0_0.0625em_0_0_rgb(187,247,208),0_0.125em_0_0_rgb(134,239,172),0_0.25em_0_0_rgb(74,222,128),0_0.3125em_0_0_rgb(34,197,94),0_0.375em_0_0_rgb(22,163,74),0_0.425em_0_0_rgb(21,128,61),0_0.425em_0.5em_0_rgb(34,197,94)]",
      activeShadow:
        "active:shadow-[inset_0_0.03em_0_0_rgb(220,252,231),0_0.03em_0_0_rgb(187,247,208),0_0.0625em_0_0_rgb(134,239,172),0_0.125em_0_0_rgb(74,222,128),0_0.125em_0_0_rgb(34,197,94),0_0.2em_0_0_rgb(22,163,74),0_0.225em_0_0_rgb(21,128,61),0_0.225em_0.375em_0_rgb(34,197,94)]",
    },
    red: {
      bg: "bg-red-500",
      text: "text-white",
      shadow:
        "shadow-[inset_0_0.0625em_0_0_rgb(254,226,226),0_0.0625em_0_0_rgb(254,202,202),0_0.125em_0_0_rgb(252,165,165),0_0.25em_0_0_rgb(248,113,113),0_0.3125em_0_0_rgb(239,68,68),0_0.375em_0_0_rgb(220,38,38),0_0.425em_0_0_rgb(185,28,28),0_0.425em_0.5em_0_rgb(220,38,38)]",
      activeShadow:
        "active:shadow-[inset_0_0.03em_0_0_rgb(254,226,226),0_0.03em_0_0_rgb(254,202,202),0_0.0625em_0_0_rgb(252,165,165),0_0.125em_0_0_rgb(248,113,113),0_0.125em_0_0_rgb(239,68,68),0_0.2em_0_0_rgb(220,38,38),0_0.225em_0_0_rgb(185,28,28),0_0.225em_0.375em_0_rgb(220,38,38)]",
    },
    orange: {
      bg: "bg-orange-500",
      text: "text-white",
      shadow:
        "shadow-[inset_0_0.0625em_0_0_rgb(255,237,213),0_0.0625em_0_0_rgb(254,215,170),0_0.125em_0_0_rgb(253,186,116),0_0.25em_0_0_rgb(251,146,60),0_0.3125em_0_0_rgb(249,115,22),0_0.375em_0_0_rgb(234,88,12),0_0.425em_0_0_rgb(194,65,12),0_0.425em_0.5em_0_rgb(249,115,22)]",
      activeShadow:
        "active:shadow-[inset_0_0.03em_0_0_rgb(255,237,213),0_0.03em_0_0_rgb(254,215,170),0_0.0625em_0_0_rgb(253,186,116),0_0.125em_0_0_rgb(251,146,60),0_0.125em_0_0_rgb(249,115,22),0_0.2em_0_0_rgb(234,88,12),0_0.225em_0_0_rgb(194,65,12),0_0.225em_0.375em_0_rgb(249,115,22)]",
    },
  };

  const { bg, text, shadow, activeShadow } = colors[color] || colors.gray;
  return (
    <button
      className={`${bg} mb-4 w-full border-0 ${text} rounded-md text-[1.35rem] px-4 py-1.5 font-semibold ${shadow}
        text-shadow-[0_1px_0_rgb(255,255,255)] transition ease-linear duration-150 cursor-pointer
        active:translate-y-[0.225em] ${activeShadow}`}
      {...props}
    >
      {label}
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
    <TactileButton
      onClick={() => onChange(!value)}
      label={label}
      color="gray"
    />
  );
};
