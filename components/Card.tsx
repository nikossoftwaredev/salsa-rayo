import { twMerge } from "tailwind-merge";

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={twMerge(`card bg-base-200 shadow-xl`, className)}>
      {children}
    </div>
  );
};

export default Card;
