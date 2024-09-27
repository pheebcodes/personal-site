import PostCSS from "postcss";
import CSSNano from "cssnano";
import PostCSSImport from "postcss-import";

import { Content } from "../content.ts";

const postcss = PostCSS([CSSNano, PostCSSImport]);

export async function* pages(content: Content) {
	const styleFile = await content.read("style.css");
	const compiled = await postcss.process(styleFile.content, {
		from: styleFile.path,
		to: "out/style.css",
	});
	yield {
		path: "style.css",
		content: compiled.css,
	};
}
