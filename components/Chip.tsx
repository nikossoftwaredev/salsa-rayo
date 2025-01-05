import React from "react";

interface ChipProps {
  image: string;
  label: string;
}

const Chip = ({ image, label }: ChipProps) => {
  return (
    <div className="badge h-8 w-auto p-0 bg-base-300">
      <div className="flex items-center gap-2 mr-2">
        <img
          src={image}
          alt={label}
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
    </div>
  );
};

export default Chip;
