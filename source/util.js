import fs from "fs/promises";
import path from "path";
import { marked } from "marked";
import fm from "front-matter";
import vhtml from "vhtml";
import { BUILD_DIR } from "./config.js";

export const remove = async (p) => await fs.rm(p, { force: true, recursive: true });

export const makeDir = async (p) =>
	await fs.mkdir(p, { recursive: true }).catch((e) => (e.code === "EEXIST" ? undefined : Promise.reject(e)));

export const read = async (p, e = "utf8") => await fs.readFile(p, e);

export const readDir = async (p) => await fs.readdir(p);

export const write = async (p, d) => {
	if (path.dirname(p) !== ".") {
		await makeDir(path.join(BUILD_DIR, path.dirname(p)));
	}
	await fs.writeFile(path.join(BUILD_DIR, p), d);
};

export const copy = async (i, o = i) => await fs.cp(i, o, { recursive: true });

export const readMd = async (p) => {
	const d = fm(await read(p));
	const b = marked(d.body, { mangle: false, headerIds: false });
	return {
		...d.attributes,
		body: b,
	};
};

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

export const render = async (o, C, as = {}, ...cs) => await write(o, "<!DOCTYPE html>" + vhtml(C, as, ...cs));

export const mapP = (xs, fn) => Promise.all(xs.map(fn));

export const join = (...ps) => path.join(...ps);

export const basename = (p) => path.basename(p, path.extname(p));
