import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import fm from "front-matter";
import Handlebars from "handlebars";
import { minify } from "html-minifier";

// Make output directory.
try {
	await fs.mkdir("out");
} catch (e) {
	if (e.code !== "EEXIST") {
		throw e;
	}
}

const copy = async (i, o = i) =>
	await fs.writeFile(path.join("out", o), await fs.readFile(i));

// Copy _redirects, license, and font files.
await copy("LICENSE.txt");
await copy("_redirects");
await copy("fonts/FiraMono-Regular.ttf", "font.ttf");

// Build stylesheet.
const stylesheet = await fs.readFile("style.css", "utf8");

// Build data object to pass to template.
const main = fm(await fs.readFile("db/main.md", "utf-8"));
const links = JSON.parse(await fs.readFile("db/links.json", "utf-8"));
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
const templateSrc = await fs.readFile("index.hbs", "utf-8");
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
await fs.writeFile("out/index.html", minifiedOutput);
