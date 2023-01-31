import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import fm from "front-matter";
import Handlebars from "handlebars";
import HandlebarsLayouts from "handlebars-layouts";
import * as dateFns from "date-fns";

const BUILD_DIR = "out";
const BLOG_POST_DIR = "content/blog/posts";
const POSTS_PER_PAGE = 10;
const POST_DATE_FORMAT = "yyyy-MM-dd";

const DEFAULT_TEMPLATE_PROPERTIES = {
	["showBlog"]: process.env.SHOW_BLOG === "true",
};

// Helper functions.
const rmrf = async (p) => await fs.rm(p, { force: true, recursive: true });
const mkdir = async (p) =>
	await fs
		.mkdir(p)
		.catch((e) => (e.code === "EEXIST" ? undefined : Promise.reject(e)));
const mkdirp = async (p) => {
	const stack = [];
	let cur = p;
	while (await mkdir(cur).catch((e) => e.code === "ENOENT")) {
		stack.push(path.basename(cur));
		cur = path.dirname(cur);
	}
	while (stack.length > 0) {
		cur = path.join(cur, stack.pop());
		await mkdir(cur);
	}
};
const read = async (p, e = "utf8") => await fs.readFile(p, e);
const readDir = async (p) => await fs.readdir(p);
const write = async (p, d) => {
	if (path.dirname(p) !== ".") {
		await mkdirp(path.join(BUILD_DIR, path.dirname(p)));
	}
	await fs.writeFile(path.join(BUILD_DIR, p), d);
};
const copy = async (i, o = i) => await write(o, await read(i, null));
const renderMd = (d) => marked(d, { smartypants: true });
const renderHbs = (t, d = {}) => t({ ...DEFAULT_TEMPLATE_PROPERTIES, ...d });
const readMd = async (p) => {
	const d = fm(await read(p));
	const b = renderMd(d.body);
	return {
		...d.attributes,
		body: b,
	};
};
const readJson = async (p) => JSON.parse(await read(p));
function* paginate(xs, perPage) {
	let page = 1;
	while (xs.length > 0) {
		const slice = xs.slice(0, perPage);
		xs = xs.slice(perPage);
		yield {
			prev: page - 1 || null,
			cur: page,
			next: xs.length > 0 ? page + 1 : null,
			items: slice,
		};
		page++;
	}
}

// Setup Handlebars.
HandlebarsLayouts.register(Handlebars);
Handlebars.registerPartial("_layout", await read("views/_layout.hbs"));
Handlebars.registerPartial(
	"_blog-layout",
	await read("views/blog/_layout.hbs"),
);
Handlebars.registerHelper("eq", (a, b) => a == b);
Handlebars.registerHelper("and", (a, b) => a && b);
Handlebars.registerHelper("or", (a, b) => a || b);
Handlebars.registerHelper("format-blog-post-date", (d) =>
	dateFns.format(d, "do 'of' LLLL, y").toLowerCase(),
);

// Create out dir.
await rmrf(BUILD_DIR);
await mkdirp(BUILD_DIR);

// Copy _redirects, license, and font files.
await copy("static/LICENSE.txt", "LICENSE.txt");
await copy("static/_redirects", "_redirects");
await copy("static/fonts/FiraMono-Regular.ttf", "fonts/FiraMono-Regular.ttf");
await copy("static/style.css", "style.css");

// Handlebars rendering helpers.
const makeCachedReadHbs = () => {
	const cache = new Map();
	return async (p) =>
		cache.has(p)
			? cache.get(p)
			: cache.set(p, Handlebars.compile(await read(p))).get(p);
};
const readHbs = makeCachedReadHbs();
const render = async (i, o, data) =>
	await write(o, renderHbs(await readHbs(i), data));

// Render index.
const content = await readMd("content/index.md");
const links = await readJson("content/links.json");
await render("views/index.hbs", "index.html", {
	...content,
	links: links.map((link) => ({
		text: link.text,
		label: link.label,
		link: link.link,
		target: link.newTab !== false ? "_blank" : "_self",
		rel: [link.newTab ? "noopener noreferrer" : undefined, link.rel]
			.filter((s) => typeof s === "string" && s.length > 0)
			.join(" "),
	})),
});

// Render blog.
const postLink = (slug) => `/blog/posts/${slug}`;
const tagLink = (tag, page = 1) => `/blog/tags/${tag}/${page}`;
const tocLink = (page = 1) => `/blog/toc/${page}`;
const maybeLink = (fn, page = null, ...args) =>
	page !== null ? fn(...args, page) : null;
const linkToFileName = (link) => `${link.slice(1)}.html`;

const postFileNames = await readDir(BLOG_POST_DIR);
const unsortedPosts = await Promise.all(
	postFileNames.map(async (postFileName) => {
		const data = await readMd(path.join(BLOG_POST_DIR, postFileName));
		const slug = path.basename(postFileName, path.extname(postFileName));
		const dateString = postFileName.slice(0, POST_DATE_FORMAT.length);
		const date = dateFns.parse(dateString, POST_DATE_FORMAT, new Date());
		return {
			title: data.title,
			body: data.body,
			slug,
			tags: data.tags.map((name) => ({ name, link: tagLink(name) })),
			date,
			link: postLink(slug),
		};
	}),
);
const posts = unsortedPosts.sort((a, b) => dateFns.compareDesc(a.date, b.date));
const tagNames = Array.from(
	new Set(posts.flatMap((p) => p.tags.map((tag) => tag.name))),
);
const postsByTagName = new Map(
	tagNames.map((tag) => [
		tag,
		posts.filter((post) => post.tags.map((t) => t.name).includes(tag)),
	]),
);
const tags = tagNames.map((name) => ({
	name,
	link: tagLink(name),
	posts: postsByTagName.get(name),
}));

for (const page of paginate(posts, POSTS_PER_PAGE)) {
	await render("views/blog/toc.hbs", `blog/toc/${page.cur}.html`, {
		tags,
		page: {
			prev: maybeLink(tocLink, page.prev),
			cur: page.cur,
			next: maybeLink(tocLink, page.next),
			items: page.items,
		},
	});
}

for (const tag of tags) {
	for (const page of paginate(tag.posts, POSTS_PER_PAGE)) {
		await render("views/blog/tag.hbs", linkToFileName(tag.link), {
			tag,
			page: {
				prev: maybeLink(tagLink, page.prev, tag.name),
				cur: page.cur,
				next: maybeLink(tagLink, page.next, tag.name),
				items: page.items,
			},
		});
	}
}
for (const post of posts) {
	await render("views/blog/post.hbs", linkToFileName(post.link), post);
}

// Render 404.
await render("views/404.hbs", "404.html");
