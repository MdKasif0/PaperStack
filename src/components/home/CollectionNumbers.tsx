import { SectionLabel } from "@/components/ui";

export interface CollectionNumbersProps {
  figures: { label: string; value: number }[];
}

/** The size of the collection, set like a publication index. */
export function CollectionNumbers({ figures }: CollectionNumbersProps) {
  return (
    <section aria-labelledby="in-numbers">
      <SectionLabel
        index="03"
        title="The collection in numbers"
        titleAs="h2"
        id="in-numbers"
      />
      <dl className="stat-grid mt-[1.625rem] mb-0 grid grid-cols-2 border-y border-rule md:grid-cols-4">
        {figures.map((figure) => (
          <div
            key={figure.label}
            className="stat-cell group flex flex-col-reverse justify-end px-5 py-[1.875rem] lg:px-9"
          >
            <dt className="mt-3 text-label text-ink-muted uppercase">
              {figure.label}
            </dt>
            <dd className="stat-value m-0 font-serif text-ink tabular-nums transition-colors duration-200 group-hover:text-green-700">
              {figure.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
