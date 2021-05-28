import * as fs from "fs/promises";
import feather from "feather-icons";
import marked from "marked";
import fm from "front-matter";
import Handlebars from "handlebars";

try {
	await fs.mkdir("out");
} catch (e) {
	if (e.code !== "EEXIST") {
		throw e;
	}
}
await fs.writeFile("out/style.css", await fs.readFile("style.css"));

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

const data = { main, links };

const templateSrc = await fs.readFile("index.hbs", "utf-8");
const template = Handlebars.compile(templateSrc);
await fs.writeFile("out/index.html", template(data));
