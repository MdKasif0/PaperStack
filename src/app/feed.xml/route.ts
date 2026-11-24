import { getAllAuthors, getAllPapers, getAllTopics } from "@/lib/content";
import { renderFeed } from "@/lib/feed";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export async function GET() {
  const [papers, authors, topics] = await Promise.all([
    getAllPapers(),
    getAllAuthors(),
    getAllTopics(),
  ]);
  const authorNames = new Map(authors.map((a) => [a.slug, a.name]));
  const topicNames = new Map(topics.map((t) => [t.slug, t.name]));

  const xml = renderFeed(
    papers.map((paper) => ({
      ...paper,
      authorNames: paper.authors.map(
        (author) => authorNames.get(author.slug) ?? author.slug,
      ),
      topicNames: paper.topics.map((slug) => topicNames.get(slug) ?? slug),
    })),
    {
      siteUrl: siteUrl(),
      title: "PaperStack",
      description:
        "An open journal of independent research — papers on AI, cybersecurity, and web engineering.",
    },
  );
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
