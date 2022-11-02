import fs from "fs/promises";
import feather from "feather-icons";
import { marked } from "marked";
import fm from "front-matter";
import Handlebars from "handlebars";
import { minify } from "html-minifier";

try {
	await fs.mkdir("out");
} catch (e) {
	if (e.code !== "EEXIST") {
		throw e;
	}
}
const stylesheet = await fs.readFile("style.css", "utf8");

Handlebars.registerHelper({
	feather: (icon) => feather.icons[icon].toSvg(),
	render: (data) => marked(data),
});

const main = fm(await fs.readFile("db/main.md", "utf-8"));
const linkNames = await fs.readdir("db/links");
const linksData = await Promise.all(
	linkNames.map((linkName) => fs.readFile(`db/links/${linkName}`, "utf-8")),
);
const links = linksData.map((linkData) => fm(linkData));

const data = { main, links, stylesheet };

const templateSrc = await fs.readFile("index.hbs", "utf-8");
const template = Handlebars.compile(templateSrc);
const output = template(data);
const minifiedOutput = minify(output, {
	collapseWhitespace: true,
	minifyCSS: true,
	removeAttributeQuotes: true,
	removeComments: true,
	removeEmptyAttributes: true,
	removeEmptyElements: true,
	removeOptionalTags: true,
	removeRedundantAttributes: true,
});

await fs.writeFile("out/index.html", minifiedOutput);
