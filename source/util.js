import FS from "fs/promises";
import Path from "path";
import { marked as Marked } from "marked";
import { markedHighlight as MarkedHighlight } from "marked-highlight";
import Highlight from "highlight.js";
import FM from "front-matter";
import { h } from "preact";
import { renderToString } from "preact-render-to-string";
import { BUILD_DIR } from "./config.js";

Marked.use(
	MarkedHighlight({
		highlight(code, lang) {
			const language = Highlight.getLanguage(lang) ? lang : "plaintext";
			return Highlight.highlight(code, { language }).value;
		},
	}),
);

export async function remove(path) {
	await FS.rm(path, { force: true, recursive: true });
}

export async function makeDir(path) {
	try {
		await FS.mkdir(path, { recursive: true });
	} catch (e) {
		if (e.code === "EEXIST") {
			return undefined;
		}
		return Promise.reject(e);
	}
}

export async function read(path, encoding = "utf8") {
	return await FS.readFile(path, encoding);
}

export async function readDir(path) {
	return await FS.readdir(path, { recursive: true });
}

export async function write(path, data) {
	if (dirname(path) !== ".") {
		await makeDir(join(BUILD_DIR, dirname(path)));
	}
	await FS.writeFile(join(BUILD_DIR, path), data);
}

export async function copy(path, destination) {
	await FS.cp(path, destination, { recursive: true });
}

export async function readMd(path) {
	const data = FM(await read(path));
	const body = Marked(data.body, { mangle: false, headerIds: false });
	return {
		...data.attributes,
		body,
	};
}

export function* paginate(xs, perPage, sort) {
	xs = xs.slice();
	xs.sort(sort);

	let page = 1;
	while (xs.length > 0) {
		const slice = xs.slice(0, perPage);
		xs = xs.slice(perPage);
		yield {
			prev: page - 1 || null,
			cur: page,
			next: xs.length > 0 ? page + 1 : null,
			items: slice,
		};
		page++;
	}
}

export async function render(destination, Component, props, ...children) {
	await write(destination, "<!DOCTYPE html>" + renderToString(h(Component, props, ...children)));
}

export function mapP(list, func) {
	return Promise.all(list.map(func));
}

export function join(...paths) {
	return Path.join(...paths);
}

export function dirname(path) {
	return Path.dirname(path);
}

export function basename(path) {
	return Path.basename(path, Path.extname(path));
}
