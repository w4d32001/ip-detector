type CardProps = {
  title: string;
  value: string;
};

export const Card = ({ title, value }: CardProps) => {
  return (
    <div className="col-span-2 bg-secondary shadow-xl rounded">
      <div className="flex flex-col items-center justify-center h-full p-4 gap-y-4">
        <span className="text-gray-300 text-xl">{title}</span>
        <span className="text-3xl text-white font-bold font-mono">{value}</span>
      </div>
    </div>
  );
};
