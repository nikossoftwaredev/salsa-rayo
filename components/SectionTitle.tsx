import { twMerge } from "tailwind-merge";

export const SectionTitle = ({
  title,
  isMainSection,
}: {
  title: string;
  isMainSection?: boolean;
}) => {
  return (
    <div className="w-full flex justify-center">
      <span
        className={twMerge(
          "bg-gradient-to-r from-primary to-brand-pink text-transparent text-3xl sm:text-4xl font-extrabold text-center bg-clip-text my-4",
          isMainSection ? "my-10 uppercase" : ""
        )}
      >
        {title}
      </span>
    </div>
  );
};
