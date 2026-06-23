import Image from "next/image";
import { Link } from "@/i18n/routing";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xxl" | "xxxl";
}

const DIMENSIONS = {
  sm: { width: 48, height: 48, className: "size-12" },
  md: { width: 120, height: 48, className: "w-[120px] h-[48px]" },
  lg: { width: 200, height: 80, className: "w-[200px] h-[80px]" },
  xxl: { width: 320, height: 128, className: "w-[320px] h-[128px]" },
  xxxl: { width: 480, height: 192, className: "w-[480px] h-[192px]" },
} as const;

const Logo = ({ size = "sm" }: LogoProps) => {
  const isLarge =
    size === "md" || size === "lg" || size === "xxl" || size === "xxxl";
  const isPriority = size === "xxl" || size === "xxxl";
  const { width, height, className } = DIMENSIONS[size];

  return (
    <Link href="/" className={`${className} flex items-center cursor-pointer`}>
      {isLarge ? (
        // Wide logo: pre-optimized static AVIF/WebP via plain <picture> to skip
        // the /_next/image cold-encode. Eager (no preload) above the fold so it
        // never competes with the hero background's high-priority fetch.
        <picture>
          <source srcSet="/images/logo-big.avif" type="image/avif" />
          <source srcSet="/images/logo-big.webp" type="image/webp" />
          <img
            src="/images/logo-big.png"
            alt="Salsa Rayo Dance School logo"
            width={width}
            height={height}
            className="object-contain hover:opacity-80 transition-opacity"
            loading={isPriority ? "eager" : "lazy"}
            decoding="async"
          />
        </picture>
      ) : (
        <Image
          src="/images/logo.png"
          alt="Salsa Rayo Dance School logo"
          width={width}
          height={height}
          className="rounded-full hover:opacity-80 transition-opacity"
          loading="lazy"
        />
      )}
    </Link>
  );
};

export default Logo;
