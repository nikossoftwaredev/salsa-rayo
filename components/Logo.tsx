import Image from "next/image";

const Logo = () => {
  return (
    <div className="size-12 rounded-full">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={48}
        height={48}
        className="rounded-full"
      />
    </div>
  );
};

export default Logo;
