
export const SectionTitle = ({
  title,
}: {
  title: string;
}) => {
  return (
    <div className="w-full flex justify-center">
      <span className="bg-gradient-to-r from-yellow to-purple text-transparent text-4xl font-extrabold text-center bg-clip-text uppercase my-4">
        {title}
      </span>
    </div>
  );
};
