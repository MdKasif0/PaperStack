import type { ComponentProps } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { createCssVariablesTheme } from "shiki";

import { publicFileExists } from "@/lib/public-file";

/** Colours come from the --shiki-* variables in globals.css. */
const codeTheme = createCssVariablesTheme({ name: "paperstack" });

/** Wide tables scroll inside their own focusable region. */
function Table(props: ComponentProps<"table">) {
  return (
    <div role="region" aria-label="Table" tabIndex={0} className="paper-table">
      <table {...props} />
    </div>
  );
}

/**
 * MDX places images inside a paragraph, so this renders phrasing content
 * only. A figure whose file is not in public/ yet gets a framed stand-in
 * rather than a broken image.
 */
function Figure({ src, alt = "" }: ComponentProps<"img">) {
  const url = typeof src === "string" ? src : "";
  const missing = url.startsWith("/") && !publicFileExists(url);
  return (
    <span className="paper-figure">
      {missing ? (
        <span role="img" aria-label={alt} className="paper-figure-missing">
          <span aria-hidden="true">{alt}</span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- figure sizes are unknown until authored
        <img src={url} alt={alt} loading="lazy" />
      )}
    </span>
  );
}

/** Compiles and renders one paper's MDX body. */
export async function PaperBody({ source }: { source: string }) {
  const { content } = await compileMDX({
    source,
    components: { table: Table, img: Figure },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                className: ["heading-anchor"],
                ariaHidden: "true",
                tabIndex: -1,
              },
              content: { type: "text", value: "#" },
            },
          ],
          rehypeKatex,
          [rehypePrettyCode, { theme: codeTheme, keepBackground: false }],
        ],
      },
    },
  });
  return <div className="paper-body">{content}</div>;
}
