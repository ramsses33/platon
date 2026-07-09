type Props = {
  badge: string;
  title: string;
  description: string;
};

export default function PageHeader({
  badge,
  title,
  description,
}: Props) {
  return (
    <div className="mb-12">
      <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm uppercase tracking-[4px] text-emerald-300">
        {badge}
      </p>

      <h1 className="mt-6 text-6xl font-black leading-none">
        {title}
      </h1>

      <p className="mt-5 max-w-3xl text-xl text-gray-400">
        {description}
      </p>
    </div>
  );
}