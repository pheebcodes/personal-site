import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import fm from "front-matter";
import Handlebars from "handlebars";
import HandlebarsLayouts from "handlebars-layouts";
import { minify } from "html-minifier";
import CleanCSS from "clean-css";

const BUILD_DIR = "out";

// Make output directory.
try {
	await fs.mkdir(BUILD_DIR);
} catch (e) {
	if (e.code !== "EEXIST") {
		throw e;
	}
}

// Helper functions.
const read = async (p) => await fs.readFile(p, "utf8");
const write = async (p, d) => await fs.writeFile(path.join(BUILD_DIR, p), d);
const copy = async (i, o = i) => await write(o, await read(i));
const renderMd = (d) => marked(d, { smartypants: true });
const renderHbs = (t, d) => t(d);
const minifyHtml = (d) =>
	minify(d, {
		collapseWhitespace: true,
		removeComments: true,
		removeEmptyAttributes: true,
		removeRedundantAttributes: true,
	});
const minifyCss = (d) => {
	const out = new CleanCSS({}).minify(d);
	for (const warn of out.warnings) {
		console.error("[css warning]: %s", warn);
	}
	for (const error of out.errors) {
		console.error("[css error]: %s", error);
	}
	return out.styles;
};
const readMd = async (p) => {
	const d = fm(await read(p));
	const b = renderMd(d.body);
	return {
		...d.attributes,
		body: b,
	};
};
const readJson = async (p) => JSON.parse(await read(p));

// Setup Handlebars.
HandlebarsLayouts.register(Handlebars);
Handlebars.registerPartial("_layout", await read("views/_layout.hbs"));

// Copy _redirects, license, and font files.
await copy("LICENSE.txt");
await copy("_redirects");
await copy("fonts/FiraMono-Regular.ttf", "font.ttf");

// Read stylesheet.
const stylesheet = await read("style.css");
await write("style.css", minifyCss(stylesheet));

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
	await write(o, minifyHtml(renderHbs(await readHbs(i), data)));

// Render index.
const content = await readMd("content/main.md");
const links = await readJson("content/links.json");
await render("views/index.hbs", "index.html", { ...content, links });

// Render 404.
await render("views/404.hbs", "404.html");
