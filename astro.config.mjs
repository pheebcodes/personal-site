// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://phoebe.codes",
	redirects: {
		"/blog": "/blog/toc",
		"/blog/toc/1": "/blog/toc",
	},
	markdown: {
		smartypants: false,
	},
});
