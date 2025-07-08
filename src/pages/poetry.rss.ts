import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { compareDesc } from "date-fns";

const posts = await getCollection("poems");
const items = await Promise.all(
	posts
		.toSorted((a, b) => compareDesc(a.data.date, b.data.date))
		.map(async (post) => ({
			title: post.data.title,
			link: `/poetry/poems/${post.id}`,
			pubDate: post.data.date,
			guid: post.id,
			content: post.rendered!.html,
			author: "me@phoebe.codes (Phoebe Clarke)",
		}))
);

export function GET(context: APIContext) {
	return rss({
		title: "phoebe.codes poetry",
		description: "phoebe's poems",
		site: context.site!,
		items,
	});
}
