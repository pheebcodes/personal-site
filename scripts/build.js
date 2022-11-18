import fs from "fs/promises";
import { marked } from "marked";
import fm from "front-matter";
import Handlebars from "handlebars";
import { minify } from "html-minifier";

import * as FontAwesome from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

FontAwesome.library.add(fas, fab);

// Make output directory.
try {
	await fs.mkdir("out");
} catch (e) {
	if (e.code !== "EEXIST") {
		throw e;
	}
}

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

const data = { main, links, stylesheet };

// Build handlebars instance.
const hbs = Handlebars.create();
hbs.registerHelper({
	icon: (iconName, prefix = "fas") => {
		return FontAwesome.icon({ prefix, iconName })?.html;
	},
	render: (markdown) => marked(markdown),
});

// Compile + minify template.
const templateSrc = await fs.readFile("index.hbs", "utf-8");
const template = hbs.compile(templateSrc);
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
