import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import fm from "front-matter";
import Handlebars from "handlebars";
import { minify } from "html-minifier";

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
const renderHbs = (t, d) => Handlebars.compile(t)(d);
const minifyHtml = (d) =>
	minify(d, {
		collapseWhitespace: true,
		minifyCSS: true,
		removeComments: true,
		removeEmptyAttributes: true,
		removeRedundantAttributes: true,
	});
const readMd = async (p) => {
	const d = fm(await read(p));
	const b = renderMd(d.body);
	return {
		...d.attributes,
		body: b,
	};
};
const readJson = async (p) => JSON.parse(await read(p));

// Copy _redirects, license, and font files.
await copy("LICENSE.txt");
await copy("_redirects");
await copy("fonts/FiraMono-Regular.ttf", "font.ttf");

// Read stylesheet.
const stylesheet = await read("style.css");

// Read content.
const content = await readMd("content/main.md");
const links = await readJson("content/links.json");

const data = {
	content,
	links,
	stylesheet,
};

// Compile + minify template.
const html = minifyHtml(renderHbs(await read("index.hbs"), data));

// Write output.
await write("index.html", html);
