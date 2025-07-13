import rss from "@astrojs/rss";
import { UTCDate } from "@date-fns/utc";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { compareDesc, isAfter } from "date-fns";

const posts = await getCollection(
	"blog",
	(post) =>
		import.meta.env.DEV ||
		(!post.data.draft && isAfter(new UTCDate(), post.data.date))
);
const items = await Promise.all(
	posts
		.toSorted((a, b) => compareDesc(a.data.date, b.data.date))
		.map(async (post) => ({
			title: post.data.title,
			link: `/blog/posts/${post.id}`,
			pubDate: post.data.date,
			guid: post.id,
			content: post.rendered!.html,
			author: "me@phoebe.codes (Phoebe Clarke)",
		}))
);

export function GET(context: APIContext) {
	return rss({
		title: "phoebe.codes blog",
		description: "phoebe's blog",
		site: context.site!,
		items,
	});
}
