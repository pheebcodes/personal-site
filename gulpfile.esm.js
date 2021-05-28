import * as gulp from "gulp";
import feather from "feather-icons";

// postcss
import postcss from "gulp-postcss";
import importer from "postcss-import";
import nano from "cssnano";

// handlebars
import handlebars from "gulp-compile-handlebars";
import rename from "gulp-rename";

// fs db
import * as fs from "fs/promises";
import fm from "front-matter";
import marked from "marked";

export const style = () =>
	gulp
		.src("style.css")
		.pipe(postcss([importer, nano]))
		.pipe(gulp.dest("out"));

export const watchStyle = () => gulp.watch("style.css", style);

const handlebarOpts = {
	helpers: {
		feather: (icon) => feather.icons[icon].toSvg(),
		render: (data) => marked(data),
	},
};

export const template = async () => {
	const main = fm(await fs.readFile("db/main.md", "utf-8"));
	const linkNames = await fs.readdir("db/links");
	const linksData = await Promise.all(
		linkNames.map((linkName) => fs.readFile(`db/links/${linkName}`, "utf-8")),
	);
	const links = linksData.map((linkData) => fm(linkData));

	const data = { main, links };

	return gulp
		.src("index.hbs")
		.pipe(handlebars(data, handlebarOpts))
		.pipe(rename("index.html"))
		.pipe(gulp.dest("out"));
};

export const watchTemplate = () => gulp.watch("index.hbs", template);

export const build = gulp.parallel(style, template);

export const dev = gulp.series(build, gulp.parallel(watchStyle, watchTemplate));
