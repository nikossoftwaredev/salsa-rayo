import React from "react";
import Image from "next/image";

interface ChipProps {
  image: string;
  label: string;
}

const Chip = ({ image, label }: ChipProps) => {
  return (
    <div className="badge h-8 w-auto bg-base-300 rounded-full flex items-center px-2">
      <div className="w-6 h-6 rounded-full overflow-hidden mr-2 flex-shrink-0">
        <Image
          src={image}
          alt={label}
          width={24}
          height={24}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
};

export default Chip;
