import { Feed, FeedOptions } from "feed";
import { Content } from "../content.ts";
import { Posts } from "./_posts-store.ts";
import { z } from "zod";

class FeedData {
	static fromJSON(json: unknown) {
		return z
			.object({
				id: z.string(),
				title: z.string(),
				description: z.string(),
				link: z.string().url(),
				copyright: z.string(),
				language: z.string(),
				feedLinks: z
					.object({
						atom: z.string().url(),
						json: z.string().url(),
						rss: z.string().url(),
					})
					.partial(),
				author: z.object({
					name: z.string(),
					email: z.string().email(),
					link: z.string().url(),
				}),
			})
			.parse(json) satisfies FeedOptions;
	}
}

export async function* pages(content: Content) {
	const feedFile = await content.read("feed.json");
	const feedData = feedFile.json(FeedData);

	const posts = await content.store(Posts);
	const feed = new Feed(feedData);

	for (const post of posts) {
		const url = new URL(`blog/posts/${post.slug}.html`, "https://www.phoebe.codes");
		feed.addItem({
			id: post.slug,
			title: post.title,
			link: url.toString(),
			content: post.body,
			date: post.date,
			author: [feedData.author],
		});
	}

	feed.addCategory("Tech");
	feed.addCategory("Game Dev");
	feed.addContributor(feedData.author);

	if (feedData.feedLinks.atom) {
		yield {
			path: new URL(feedData.feedLinks.atom).pathname.slice(1),
			content: feed.atom1(),
		};
	}

	if (feedData.feedLinks.json) {
		yield {
			path: new URL(feedData.feedLinks.json).pathname.slice(1),
			content: feed.json1(),
		};
	}

	if (feedData.feedLinks.rss) {
		yield {
			path: new URL(feedData.feedLinks.rss).pathname.slice(1),
			content: feed.rss2(),
		};
	}
}
