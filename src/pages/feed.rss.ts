import path from "path";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";

const glob = import.meta.glob("./blog/posts/*.md");
const posts = await Promise.all(Object.values(glob).map((fn) => fn()));
const items = await Promise.all(
	posts.map(async (post) => ({
		title: post.frontmatter.title,
		link: post.url,
		pubDate: post.frontmatter.date,
		guid: path.basename(post.url),
		content: await post.compiledContent(),
		author: "me@phoebe.codes (Phoebe Clarke)",
	}))
);

export function GET(context: APIContext) {
	return rss({
		// `<title>` field in output xml
		title: "phoebe.codes blog",
		// `<description>` field in output xml
		description: "phoebe's blog",
		// Pull in your project "site" from the endpoint context
		// https://docs.astro.build/en/reference/api-reference/#site
		site: context.site!,
		// Array of `<item>`s in output xml
		// See "Generating items" section for examples using content collections and glob imports
		items,
	});
}
