import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "lg" | "xxl";
}

const Logo = ({ size = "sm" }: LogoProps) => {
  const isLarge = size === "lg" || size === "xxl";
  
  const dimensions = {
    sm: { width: 48, height: 48, className: "size-12" },
    lg: { width: 200, height: 80, className: "w-[200px] h-[80px]" },
    xxl: { width: 320, height: 128, className: "w-[320px] h-[128px]" }
  };

  const { width, height, className } = dimensions[size];

  return (
    <Link href="/" className={`${className} block cursor-pointer`}>
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