import rss from "@astrojs/rss";
import { UTCDate } from "@date-fns/utc";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { compareDesc, isAfter } from "date-fns";

const collection = await getCollection(
	"poems",
	(poem) => import.meta.env.DEV || isAfter(poem.data.date, new UTCDate())
);
const poems = await Promise.all(
	collection
		.toSorted((a, b) => compareDesc(a.data.date, b.data.date))
		.map(async (poem) => ({
			title: poem.data.title,
			link: `/poetry/poems/${poem.id}`,
			pubDate: poem.data.date,
			guid: poem.id,
			content: poem.rendered!.html,
			author: "me@phoebe.codes (Phoebe Clarke)",
		}))
);

export function GET(context: APIContext) {
	return rss({
		title: "phoebe.codes poetry",
		description: "phoebe's poems",
		site: context.site!,
		items: poems,
	});
}
