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

const read = async (p) => await fs.readFile(p, "utf8");
const write = async (p, d) => await fs.writeFile(path.join(BUILD_DIR, p), d);
const copy = async (i, o = i) => await write(o, await read(i));

// Copy _redirects, license, and font files.
await copy("LICENSE.txt");
await copy("_redirects");
await copy("fonts/FiraMono-Regular.ttf", "font.ttf");

// Build stylesheet.
const stylesheet = await read("style.css");

// Build data object to pass to template.
const main = fm(await read("db/main.md"));
const links = JSON.parse(await read("db/links.json"));
const renderedBody = marked(main.body);

const data = {
	main: {
		...main.attributes,
		toString() {
			return renderedBody;
		},
	},
	links,
	stylesheet,
};

// Compile + minify template.
const templateSrc = await read("index.hbs");
const template = Handlebars.compile(templateSrc);
const output = template(data);
const minifiedOutput = minify(output, {
	collapseWhitespace: true,
	minifyCSS: true,
	removeComments: true,
	removeEmptyAttributes: true,
	removeRedundantAttributes: true,
});

// Write output.
await write("index.html", minifiedOutput);
