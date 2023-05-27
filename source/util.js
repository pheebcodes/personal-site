import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import fm from "front-matter";
import vhtml from "vhtml";
import { BUILD_DIR } from "./config.js";

export const rmrf = async (p) => await fs.rm(p, { force: true, recursive: true });
export const mkdir = async (p) => await fs.mkdir(p).catch((e) => (e.code === "EEXIST" ? undefined : Promise.reject(e)));
export const mkdirp = async (p) => {
	const stack = [];
	let cur = p;
	while (await mkdir(cur).catch((e) => e.code === "ENOENT")) {
		stack.push(path.basename(cur));
		cur = path.dirname(cur);
	}
	while (stack.length > 0) {
		cur = path.join(cur, stack.pop());
		await mkdir(cur);
	}
};
export const read = async (p, e = "utf8") => await fs.readFile(p, e);
export const readDir = async (p) => await fs.readdir(p);
export const write = async (p, d) => {
	if (path.dirname(p) !== ".") {
		await mkdirp(path.join(BUILD_DIR, path.dirname(p)));
	}
	await fs.writeFile(path.join(BUILD_DIR, p), d);
};
export const copy = async (i, o = i) => await write(o, await read(i, null));
export const renderMd = (d) => marked(d, { smartypants: true });
export const renderHbs = (t, d = {}) => t({ ...DEFAULT_TEMPLATE_PROPERTIES, ...d });
export const readMd = async (p) => {
	const d = fm(await read(p));
	const b = renderMd(d.body);
	return {
		...d.attributes,
		body: b,
	};
};
export const readJson = async (p) => JSON.parse(await read(p));
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
export const render = (o, C, ps = {}, ...children) =>
	write(o, "<!DOCTYPE html>" + vhtml(C, { ...ps, showBlog: true }, ...children));
export const mapP = (xs, fn) => Promise.all(xs.map(fn));

export const join = (...ps) => path.join(...ps);
export const basename = (p) => path.basename(p, path.extname(p));
