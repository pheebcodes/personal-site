import * as dateFns from "date-fns";
import { Home } from "./page/home.jsx";
import { BlogToc } from "./page/blog-toc.jsx";
import { BlogPost } from "./page/blog-post.jsx";
import { BlogTag } from "./page/blog-tag.jsx";
import { BUILD_DIR, POSTS_PER_PAGE, POST_DATE_FORMAT } from "./config.js";
import { remove, copy, readDir, readMd, render, join, paginate, basename, mapP, write } from "./util.js";

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

async function main() {
	// Create out dir.
	await remove(BUILD_DIR);
	await copy("static", BUILD_DIR);

	await write("commit.txt", process.env.COMMIT_REF);

	// Render index.html.
	const content = await readMd("content/index.md");
	await render("index.html", Home, { body: content.body });

	// Loading blog data.
	const postNames = await readDir(join("content", "blog", "posts"));
	const posts = await mapP(postNames, (filename) =>
		readMd(join("content", "blog", "posts", filename)).then((content) => {
			const dateString = filename.slice(0, POST_DATE_FORMAT.length);
			const date = dateFns.parse(dateString, POST_DATE_FORMAT, new Date());
			return {
				...content,
				tags: new Set(content.tags),
				date,
				slug: basename(filename),
			};
		}),
	);
	const postSort = (a, b) => dateFns.compareDesc(a.date, b.date);

	// Gathering post tags.
	const tags = new Set();
	for (const post of posts) {
		for (const tag of post.tags) {
			tags.add(tag);
		}
	}

	// Rendering blog index.
	for (const { prev, cur, next, items } of paginate(posts, POSTS_PER_PAGE, postSort)) {
		await render(join("blog", "toc", `${cur}.html`), BlogToc, { posts: items, tags, prev, cur, next });
	}

	// Rendering posts.
	for (const post of posts) {
		await render(join("blog", "posts", `${post.slug}.html`), BlogPost, post);
	}

	// Rendering tags.
	for (const tag of tags) {
		const tagPosts = posts.filter((post) => post.tags.has(tag));
		for (const { prev, cur, next, items } of paginate(tagPosts, POSTS_PER_PAGE, postSort)) {
			await render(join("blog", "tag", tag, `${cur}.html`), BlogTag, { posts: items, prev, cur, next, tag });
		}
	}
}
