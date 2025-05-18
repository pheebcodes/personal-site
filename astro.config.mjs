// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
	site: "https://phoebe.codes",
	adapter: node({
		mode: "standalone",
	}),
	redirects: {
		"/blog": "/blog/toc",
		"/blog/toc/1": "/blog/toc",
	},
	markdown: {
		smartypants: false,
	},
});
