import { twMerge } from "tailwind-merge";

export const SectionTitle = ({
  title,
  classname,
  isMainSection,
}: {
  title: string;
  classname?: string;
  isMainSection?: boolean;
}) => {
  return (
    <div className="w-full flex justify-center">
      <span
        className={twMerge(
          "bg-gradient-to-r from-primary to-accent text-transparent text-4xl font-extrabold text-center bg-clip-text my-4",
          classname,
          isMainSection ? "my-10 uppercase" : ""
        )}
      >
        {title}
      </span>
    </div>
  );
};
