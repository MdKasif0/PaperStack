import type { Metadata } from "next";
import { ArrowUpRight, Download, Search } from "lucide-react";

import {
  Badge,
  Button,
  ButtonLink,
  Card,
  Checkbox,
  Container,
  IconButton,
  Input,
  Rule,
  SectionLabel,
  Select,
  Tag,
  Tooltip,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Design system — PaperStack",
  description: "Internal style guide for PaperStack.",
  robots: { index: false, follow: false },
};

interface SwatchSpec {
  name: string;
  hex: string;
  className: string;
  note?: string;
}

const swatchGroups: { title: string; blurb: string; swatches: SwatchSpec[] }[] =
  [
    {
      title: "Paper surfaces",
      blurb:
        "Warm paper grounds the page. Raised lifts cards; sunk insets code and metadata.",
      swatches: [
        { name: "paper", hex: "#F6F1E7", className: "bg-paper" },
        { name: "paper-raised", hex: "#FBF8F1", className: "bg-paper-raised" },
        { name: "paper-sunk", hex: "#EDE5D5", className: "bg-paper-sunk" },
      ],
    },
    {
      title: "Ink",
      blurb:
        "Every neutral carries an olive cast — there are no blue-tinted greys in the system.",
      swatches: [
        { name: "ink", hex: "#1E2620", className: "bg-ink" },
        { name: "ink-soft", hex: "#4A5249", className: "bg-ink-soft" },
        {
          name: "ink-muted",
          hex: "#63665A",
          className: "bg-ink-muted",
          note: "darkened from the proposed #77796B to hold AA on paper-sunk",
        },
      ],
    },
    {
      title: "Hairline rules",
      blurb: "Structure comes from 1px rules, never from shadows.",
      swatches: [
        { name: "rule", hex: "#D9CFBC", className: "bg-rule" },
        { name: "rule-strong", hex: "#BFB29A", className: "bg-rule-strong" },
      ],
    },
    {
      title: "Ink green — primary accent",
      blurb: "Links, focus rings, primary actions, and quiet emphasis.",
      swatches: [
        { name: "green-900", hex: "#14352A", className: "bg-green-900" },
        { name: "green-700", hex: "#1F4D3A", className: "bg-green-700" },
        { name: "green-600", hex: "#2B6350", className: "bg-green-600" },
        { name: "green-100", hex: "#DDE8DF", className: "bg-green-100" },
        { name: "green-50", hex: "#EDF3EE", className: "bg-green-50" },
      ],
    },
    {
      title: "Terracotta — secondary accent",
      blurb:
        "Link underlines, badges, and warm highlights. 700 is the text-safe tone.",
      swatches: [
        {
          name: "terracotta-700",
          hex: "#8F4A31",
          className: "bg-terracotta-700",
          note: "added so terracotta text passes AA on every paper surface",
        },
        {
          name: "terracotta-600",
          hex: "#A85D3F",
          className: "bg-terracotta-600",
          note: "decorative and large text only (4.3:1 on paper)",
        },
        {
          name: "terracotta-100",
          hex: "#F1DDD2",
          className: "bg-terracotta-100",
        },
      ],
    },
    {
      title: "Soft gold — tertiary accent",
      blurb:
        "Text selection, emphasis rules, and preprint badges. Never body text.",
      swatches: [
        {
          name: "gold-500",
          hex: "#BE9B4E",
          className: "bg-gold-500",
          note: "decorative only (2.3:1)",
        },
        { name: "gold-100", hex: "#F2E7C9", className: "bg-gold-100" },
      ],
    },
  ];

const contrastRows: { pair: string; ratio: string; level: string }[] = [
  { pair: "ink on paper", ratio: "13.7", level: "AAA" },
  { pair: "ink on paper-raised", ratio: "14.5", level: "AAA" },
  { pair: "ink-soft on paper", ratio: "7.2", level: "AAA" },
  { pair: "ink-soft on paper-sunk", ratio: "6.5", level: "AAA" },
  { pair: "ink-muted on paper", ratio: "5.2", level: "AA" },
  { pair: "ink-muted on paper-sunk", ratio: "4.7", level: "AA" },
  { pair: "green-900 on paper", ratio: "11.9", level: "AAA" },
  { pair: "green-700 on paper (links)", ratio: "8.6", level: "AAA" },
  { pair: "green-600 on paper", ratio: "6.2", level: "AA" },
  { pair: "terracotta-700 on paper", ratio: "5.8", level: "AA" },
  { pair: "terracotta-700 on terracotta-100", ratio: "5.0", level: "AA" },
  { pair: "green-900 on green-50", ratio: "11.9", level: "AAA" },
  { pair: "green-900 on green-100", ratio: "10.6", level: "AAA" },
  { pair: "ink on gold-100", ratio: "12.5", level: "AAA" },
  { pair: "paper on green-700 (primary button)", ratio: "8.6", level: "AAA" },
];

function Swatch({ spec }: { spec: SwatchSpec }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "h-16 w-full rounded-sm border border-rule",
          spec.className,
        )}
      />
      <div>
        <p className="font-mono text-small text-ink">{spec.name}</p>
        <p className="font-mono text-small text-ink-muted">{spec.hex}</p>
        {spec.note && (
          <p className="mt-1 text-small text-ink-muted">{spec.note}</p>
        )}
      </div>
    </div>
  );
}

const typeSpecimens: {
  token: string;
  spec: string;
  className: string;
  sample: React.ReactNode;
}[] = [
  {
    token: "display",
    spec: "Newsreader · 44→72px · 1.05 · −0.02em",
    className: "font-serif text-display",
    sample: "The quiet machinery of proof",
  },
  {
    token: "h1",
    spec: "Newsreader · 36→52px · 1.1 · −0.015em",
    className: "font-serif text-h1",
    sample: "Side channels in the modern browsing stack",
  },
  {
    token: "h2",
    spec: "Newsreader · 28→38px · 1.15 · −0.01em",
    className: "font-serif text-h2",
    sample: "What we measured, and how",
  },
  {
    token: "h3",
    spec: "Newsreader · 22→28px · 1.25",
    className: "font-serif text-h3",
    sample: "Threat model and scope",
  },
  {
    token: "h4",
    spec: "Newsreader medium · 18→21px · 1.35",
    className: "font-serif text-h4 font-medium",
    sample: "A note on reproducibility",
  },
  {
    token: "h3 italic",
    spec: "Newsreader italic · optical sizing auto",
    className: "font-serif text-h3 italic",
    sample: "Reading closely, arguing slowly",
  },
  {
    token: "body-lg",
    spec: "Hanken Grotesk · 18→20px · 1.75 — long-form reading",
    className: "max-w-prose text-body-lg",
    sample:
      "Long-form body text is set at eighteen pixels with generous leading, wide enough to read for an hour, narrow enough to keep the eye from wandering. This is the measure the reading container enforces.",
  },
  {
    token: "body",
    spec: "Hanken Grotesk · 16px · 1.7 — UI and interface copy",
    className: "max-w-prose text-body",
    sample:
      "Interface copy sits one step down: sixteen pixels, slightly firmer leading, tuned for labels, summaries, and short explanations rather than immersion.",
  },
  {
    token: "small",
    spec: "Hanken Grotesk · 14px · 1.6 — captions and meta",
    className: "text-small",
    sample:
      "Figure 4 — Median handshake latency across 2,400 traces, error bars at 95%.",
  },
  {
    token: "label",
    spec: "Hanken Grotesk · 11.5px · uppercase · 0.12em tracking",
    className: "text-label uppercase",
    sample: "Correspondence — Section 3.2 — Further reading",
  },
  {
    token: "label mono",
    spec: "IBM Plex Mono · 11.5px · uppercase · tabular",
    className: "font-mono text-label uppercase tabular-nums",
    sample: "DOI 10.48550/arXiv.2601.01234 — Rev. 3",
  },
  {
    token: "tabular figures",
    spec: "IBM Plex Mono · 14px · tabular-nums",
    className: "font-mono text-small tabular-nums",
    sample: "pp. 014–126 · 2026 · 07 · 42 citations · h-index 11",
  },
];

export default function DesignSystemPage() {
  return (
    <div className="pt-16 pb-28 sm:pt-24">
      <Container width="site">
        <header className="max-w-3xl">
          <p className="text-label text-ink-muted uppercase">
            PaperStack · Internal reference · Not indexed
          </p>
          <h1 className="mt-4 font-serif text-h1 text-ink">Design system</h1>
          <p className="mt-6 max-w-prose text-body-lg text-ink-soft">
            Tokens, type, and primitives for a light, editorial reading
            experience: paper first, hairlines before shadows, ink green before
            anything loud. Everything on this page is built only from the tokens
            it documents.
          </p>
        </header>

        <Rule className="my-14 sm:my-20" />

        {/* ---------------------------------------------------------- */}
        <section>
          <SectionLabel index="01" title="Colour" />
          <div className="mt-10 flex flex-col gap-12">
            {swatchGroups.map((group) => (
              <div key={group.title}>
                <div className="flex-baseline flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-serif text-h4 text-ink">{group.title}</h3>
                  <p className="text-small text-ink-muted">{group.blurb}</p>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                  {group.swatches.map((spec) => (
                    <Swatch key={spec.name} spec={spec} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3 className="mt-16 font-serif text-h4 text-ink">
            Verified text pairings (WCAG)
          </h3>
          <div className="mt-5 max-w-3xl overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-rule-strong">
                  <th className="py-2.5 pr-6 text-label text-ink-muted uppercase">
                    Pairing
                  </th>
                  <th className="py-2.5 pr-6 text-right text-label text-ink-muted uppercase">
                    Ratio
                  </th>
                  <th className="py-2.5 text-right text-label text-ink-muted uppercase">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {contrastRows.map((row) => (
                  <tr key={row.pair} className="border-b border-rule">
                    <td className="py-2.5 pr-6 text-body text-ink">
                      {row.pair}
                    </td>
                    <td className="py-2.5 pr-6 text-right font-mono text-small text-ink-soft tabular-nums">
                      {row.ratio}
                    </td>
                    <td className="py-2.5 text-right font-mono text-small text-green-700">
                      {row.level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 max-w-prose text-small text-ink-muted">
              Two requested values were adjusted to pass AA: ink-muted (#77796B
              → #63665A) and a terracotta-700 step was added (#8F4A31) for text
              use, since terracotta-600 on paper measures 4.3:1. Gold is
              reserved for decorative surfaces and selection.
            </p>
          </div>
        </section>

        <Rule className="my-14 sm:my-20" />

        {/* ---------------------------------------------------------- */}
        <section>
          <SectionLabel index="02" title="Typography" />
          <div className="mt-10">
            {typeSpecimens.map((specimen) => (
              <div
                key={specimen.token}
                className="grid gap-3 border-b border-rule py-8 first:pt-0 sm:grid-cols-[14rem_1fr] sm:gap-10"
              >
                <div className="font-mono text-small">
                  <p className="text-ink">{specimen.token}</p>
                  <p className="mt-1 text-ink-muted">{specimen.spec}</p>
                </div>
                <div className={cn("text-ink", specimen.className)}>
                  {specimen.sample}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Rule className="my-14 sm:my-20" />

        {/* ---------------------------------------------------------- */}
        <section>
          <SectionLabel index="03" title="Components" />

          <div className="mt-12 flex flex-col gap-16">
            <div>
              <Rule label="Buttons" />
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button>Read the paper</Button>
                <Button variant="secondary">Download PDF</Button>
                <Button variant="text">
                  View all 24 papers
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Button size="sm">Small primary</Button>
                <Button size="sm" variant="secondary">
                  Small secondary
                </Button>
                <ButtonLink href="#components" variant="text">
                  Rendered as a link
                </ButtonLink>
              </div>
            </div>

            <div>
              <Rule label="Tags & badges" />
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Tag>machine learning</Tag>
                <Tag tone="green">peer reviewed</Tag>
                <Tag tone="terracotta">adversarial ML</Tag>
                <Tag tone="gold">web security</Tag>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Badge status="published" />
                <Badge status="preprint" />
                <Badge status="in-review" />
                <Badge status="draft" />
              </div>
            </div>

            <div>
              <Rule label="Forms" />
              <div className="mt-8 grid max-w-2xl gap-8 sm:grid-cols-2">
                <div className="flex flex-col gap-8">
                  <Input
                    label="Search papers"
                    placeholder="e.g. side-channel leakage"
                    hint="Titles, abstracts, and authors."
                  />
                  <Input
                    label="Corresponding author"
                    placeholder="name@institution.edu"
                    defaultValue="not-an-email"
                    error="Enter an email address in the standard form."
                  />
                  <Input
                    label="Disabled field"
                    placeholder="Read-only"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-8">
                  <Select
                    label="Primary topic"
                    hint="Shown on the paper card and topic page."
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>
                    <option>Machine learning</option>
                    <option>Cybersecurity</option>
                    <option>Web systems</option>
                  </Select>
                  <Checkbox
                    label="Include preprints"
                    description="Papers shared before peer review concludes."
                    defaultChecked
                  />
                  <Checkbox label="Email me new issues" />
                  <Checkbox
                    label="Disabled option"
                    description="Not available yet."
                    disabled
                  />
                </div>
              </div>
            </div>

            <div>
              <Rule label="Cards" />
              <div className="mt-8 grid gap-6 md:grid-cols-5">
                <Card className="p-6 md:col-span-3">
                  <p className="text-label text-terracotta-700 uppercase">
                    Working paper
                  </p>
                  <h4 className="mt-2.5 font-serif text-h3 text-ink">
                    On the limits of static analysis for single-page frameworks
                  </h4>
                  <p className="mt-3 text-body text-ink-soft">
                    We instrument four bundlers and three hydration strategies
                    to measure where static guarantees quietly expire, and
                    propose a conservative subset that survives production
                    builds.
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-rule pt-4">
                    <p className="font-mono text-small text-ink-muted tabular-nums">
                      2026 · 14 pp. · 3 authors
                    </p>
                    <Badge status="preprint" />
                  </div>
                </Card>
                <Card className="p-6 md:col-span-2">
                  <p className="text-label text-green-700 uppercase">Dataset</p>
                  <h4 className="mt-2.5 font-serif text-h4 text-ink">
                    Trace corpus, 2,400 sessions
                  </h4>
                  <p className="mt-3 text-small text-ink-soft">
                    Collected between March and June 2026 under an ethics-board
                    protocol. Sha-256 checksums accompany every release.
                  </p>
                </Card>
              </div>
            </div>

            <div>
              <Rule label="Tooltips & icon buttons" />
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Tooltip
                  content="Search titles, abstracts, and authors"
                  id="tip-search"
                >
                  <IconButton label="Search" aria-describedby="tip-search">
                    <Search aria-hidden="true" className="size-4" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Download the typeset PDF" id="tip-download">
                  <IconButton
                    label="Download PDF"
                    variant="outline"
                    aria-describedby="tip-download"
                  >
                    <Download aria-hidden="true" className="size-4" />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  content="Keyboard focus shows the tooltip too."
                  id="tip-focus"
                >
                  <Button variant="text" aria-describedby="tip-focus">
                    Focus shows it too
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </section>

        <Rule className="my-14 sm:my-20" />

        {/* ---------------------------------------------------------- */}
        <section>
          <SectionLabel index="04" title="Editorial details" />

          <div className="mt-10 flex max-w-3xl flex-col gap-10">
            <div>
              <h3 className="font-serif text-h4 text-ink">Links in prose</h3>
              <p className="mt-3 text-body-lg text-ink-soft">
                Prose links are{" "}
                <a href="#editorial">
                  ink green with a thin terracotta underline
                </a>{" "}
                that thickens on hover, so a long paper can be read without the
                page ever shouting. Focus follows the same rule with a{" "}
                <a href="#editorial">green-700 ring</a> and a two-pixel offset.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-h4 text-ink">Selection</h3>
              <p className="mt-3 text-body-lg text-ink-soft">
                Try selecting any text on this page: the highlight is gold-100
                with ink text, and this paragraph uses nothing but the global
                rule.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-h4 text-ink">
                Code — warm syntax, no blue
              </h3>
              <pre className="mt-3 overflow-x-auto rounded-sm border border-rule bg-paper-sunk p-5 font-mono text-small leading-relaxed text-ink-soft">
                <code>
                  <span className="text-[color:var(--syntax-comment)]">
                    {"// index every abstract for client-side search"}
                  </span>
                  {"\n"}
                  <span className="text-[color:var(--syntax-keyword)]">
                    const
                  </span>{" "}
                  <span className="text-[color:var(--syntax-function)]">
                    index
                  </span>{" "}
                  <span className="text-[color:var(--syntax-punctuation)]">
                    =
                  </span>{" "}
                  <span className="text-[color:var(--syntax-punctuation)]">
                    new
                  </span>{" "}
                  <span className="text-[color:var(--syntax-function)]">
                    MiniSearch
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    ({"{"}
                  </span>
                  {"\n  "}
                  <span className="text-[color:var(--syntax-string)]">
                    fields
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    :
                  </span>{" "}
                  <span className="text-[color:var(--syntax-punctuation)]">
                    [
                  </span>
                  <span className="text-[color:var(--syntax-string)]">
                    &quot;title&quot;
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    ,
                  </span>{" "}
                  <span className="text-[color:var(--syntax-string)]">
                    &quot;abstract&quot;
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    ]
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    ,
                  </span>
                  {"\n  "}
                  <span className="text-[color:var(--syntax-string)]">
                    storeFields
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    :
                  </span>{" "}
                  <span className="text-[color:var(--syntax-punctuation)]">
                    [
                  </span>
                  <span className="text-[color:var(--syntax-string)]">
                    &quot;slug&quot;
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    ,
                  </span>{" "}
                  <span className="text-[color:var(--syntax-string)]">
                    &quot;year&quot;
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    ]
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    ,
                  </span>
                  {"\n"}
                  <span className="text-[color:var(--syntax-punctuation)]">
                    {"});"}
                  </span>
                  {"\n\n"}
                  <span className="text-[color:var(--syntax-function)]">
                    index
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    .
                  </span>
                  <span className="text-[color:var(--syntax-function)]">
                    addAll
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    (
                  </span>
                  papers
                  <span className="text-[color:var(--syntax-punctuation)]">
                    .
                  </span>
                  <span className="text-[color:var(--syntax-function)]">
                    filter
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    ((p) =&gt; p.year &gt;{" "}
                  </span>
                  <span className="text-[color:var(--syntax-number)]">
                    2020
                  </span>
                  <span className="text-[color:var(--syntax-punctuation)]">
                    ));
                  </span>
                </code>
              </pre>
            </div>

            <div>
              <h3 className="font-serif text-h4 text-ink">Texture & motion</h3>
              <p className="mt-3 max-w-prose text-body text-ink-soft">
                A fixed paper-grain overlay sits over everything at 2.8% opacity
                (multiply blend, pointer-events none, hidden in print). Smooth
                scrolling and every transition are disabled under
                prefers-reduced-motion. There are no gradients, no glass, and no
                shadows anywhere in the system.
              </p>
            </div>
          </div>
        </section>

        <Rule className="mt-16" />
        <p className="mt-6 font-mono text-small text-ink-muted tabular-nums">
          PaperStack design system · step 2 of 10 · robots: noindex, nofollow
        </p>
      </Container>
    </div>
  );
}
