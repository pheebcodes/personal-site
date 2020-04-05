import * as gulp from "gulp";

// postcss
import postcss from "gulp-postcss";
import importer from "postcss-import";
import nano from "cssnano";

// handlebars
import handlebars from "gulp-compile-handlebars";
import rename from "gulp-rename";

import feather from "feather-icons";

import PrismicDOM from "prismic-dom";
import { getData } from "./prismic";

export const style = () =>
	gulp
		.src("style.css")
		.pipe(postcss([importer, nano]))
		.pipe(gulp.dest("out"));

export const watchStyle = () => gulp.watch("style.css", style);

const handlebarOpts = {
	helpers: {
		feather: (icon) => feather.icons[icon].toSvg(),
		render: (obj) => PrismicDOM.RichText.asHtml(obj),
	},
};

export const template = async () => {
	const data = await getData(
		process.env.PRISMIC_API_ENDPOINT,
		process.env.PRISMIC_ACCESS_TOKEN,
	);

	return gulp
		.src("index.hbs")
		.pipe(handlebars(data, handlebarOpts))
		.pipe(rename("index.html"))
		.pipe(gulp.dest("out"));
};

export const watchTemplate = () => gulp.watch("index.hbs", template);

export const build = gulp.parallel(style, template);

export const dev = gulp.series(build, gulp.parallel(watchStyle, watchTemplate));
