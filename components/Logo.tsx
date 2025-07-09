import Image from "next/image";

const Logo = () => {
  return (
    <div className="size-10 rounded-full">
      <Image 
        src="/images/logo.webp" 
        alt="Logo" 
        width={40}
        height={40}
        className="rounded-full" 
      />
    </div>
  );
};

export default Logo;
