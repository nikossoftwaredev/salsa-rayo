import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xxl" | "xxxl";
}

const Logo = ({ size = "sm" }: LogoProps) => {
  const isLarge = size === "md" || size === "lg" || size === "xxl" || size === "xxxl";
  
  const dimensions = {
    sm: { width: 48, height: 48, className: "size-12" },
    md: { width: 120, height: 48, className: "w-[120px] h-[48px]" },
    lg: { width: 200, height: 80, className: "w-[200px] h-[80px]" },
    xxl: { width: 320, height: 128, className: "w-[320px] h-[128px]" },
    xxxl: { width: 480, height: 192, className: "w-[480px] h-[192px]" }
  };

  const { width, height, className } = dimensions[size];

  return (
    <Link href="/" className={`${className} flex items-center cursor-pointer`}>
      <Image
        src={isLarge ? "/images/logo-big.png" : "/images/logo.png"}
        alt="Logo"
        width={width}
        height={height}
        className={`${isLarge ? "object-contain" : "rounded-full"} hover:opacity-80 transition-opacity`}
      />
    </Link>
  );
};

export default Logo;