import fs from "fs/promises";
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

// Copy license file.
await fs.writeFile("out/LICENSE.txt", await fs.readFile("LICENSE.txt"));

// Copy font file.
await fs.writeFile(
	"out/font.ttf",
	await fs.readFile("fonts/FiraMono-Regular.ttf"),
);

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
