import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import mdx from "@astrojs/mdx";

export default defineConfig({
	site: "https://phoebe.codes",
	adapter: node({
		mode: "middleware",
	}),
	redirects: {
		"/blog": "/blog/toc",
		"/blog/toc/1": "/blog/toc",
		"/blog/posts/2023-05-28-12-00-00-blocking-hacker-news":
			"/blog/posts/2023-05-28-blocking-hacker-news",
		"/feed": "/feed.rss",
		"/feed.xml": "/feed.rss",
		"/poetry": "/poetry/toc",
		"/poetry/toc/1": "/poetry/toc",
	},
	markdown: {
		smartypants: false,
	},
	integrations: [mdx()],
});
