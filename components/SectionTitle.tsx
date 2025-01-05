import { twMerge } from "tailwind-merge";

export const SectionTitle = ({
  title,
  classname,
}: {
  title: string;
  classname?: string;
}) => {
  return (
    <div className="w-full flex justify-center">
      <span
        className={twMerge(
          "bg-gradient-to-r from-primary to-accent text-transparent text-4xl font-extrabold text-center bg-clip-text uppercase my-4",
          classname
        )}
      >
        {title}
      </span>
    </div>
  );
};
