import * as gulp from "gulp";

import merge from "merge-stream";

// postcss
import postcss from "gulp-postcss";
import importer from "postcss-import";
import nano from "cssnano";

// handlebars
import handlebars from "gulp-compile-handlebars";
import Markdown from "helper-markdown";
import rename from "gulp-rename";
import getData from "./contentful";

export const assets = () =>
	gulp
		.src("node_modules/feather-icons/dist/feather-sprite.svg")
		.pipe(gulp.dest("out/assets"));

export const style = () =>
	gulp
		.src("style.css")
		.pipe(postcss([importer, nano]))
		.pipe(gulp.dest("out"));

const handlebarOpts = {
	helpers: {
		and: (...args) => args.every((arg) => Boolean(arg) === true),
		markdown: Markdown(),
	},
};

export const template = async () => {
	const data = await getData();

	return gulp
		.src("index.hbs")
		.pipe(handlebars(data, handlebarOpts))
		.pipe(rename("index.html"))
		.pipe(gulp.dest("out"));
};

export const build = gulp.series(gulp.parallel(assets, style), template);
