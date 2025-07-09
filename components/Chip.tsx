import React from "react";
import Image from "next/image";

interface ChipProps {
  image: string;
  label: string;
}

const Chip = ({ image, label }: ChipProps) => {
  return (
    <div className="badge h-8 w-auto bg-base-300 rounded-full flex items-center px-2">
      <Image
        src={image}
        alt={label}
        width={24}
        height={24}
        className="rounded-full object-cover mr-2"
      />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
};

export default Chip;
