const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const { promisify } = require("util");
const PostCss = require("postcss");
const Autoprefixer = require("autoprefixer");
const Import = require("postcss-import");
const walk = promisify(require("@nodelib/fs.walk").walk);
const mkdirp = require("mkdirp");
const Engine = require("./template-engine");
const getDataFromContentful = require("./data");

const STYLE_FILE = "style.css";
const TEMPLATE_FILE = "template.hbs";

const ASSET_DIR = "assets";
const OUT_DIR = "out";
const OUT_ASSET_DIR = path.join(OUT_DIR, ASSET_DIR);

async function copyAssets() {
	const assets = {};
	const assetEntries = await walk(ASSET_DIR);

	if (assetEntries.length > 0) {
		await mkdirp(OUT_ASSET_DIR);
	}
	for (const asset of assetEntries) {
		if (asset.dirent.isDirectory()) {
			const p = path.join(OUT_ASSET_DIR, path.relative(ASSET_DIR, asset.path));
			await mkdirp(p);
			continue;
		}
		const hash = crypto.createHash("sha256");
		const data = await fs.readFile(asset.path);
		hash.write(data);
		const ext = path.extname(asset.path);
		const dir = path.relative(ASSET_DIR, path.dirname(asset.path));
		const nameWithHash = path.join(
			dir,
			`${path.basename(asset.path, ext)}-${hash.digest("hex")}${ext}`,
		);
		await fs.writeFile(path.join(OUT_ASSET_DIR, nameWithHash), data);
		assets[path.relative(ASSET_DIR, asset.path)] = path.join(
			ASSET_DIR,
			nameWithHash,
		);
	}

	return assets;
}

async function buildCss() {
	const processor = PostCss([Autoprefixer, Import]);
	const css = await fs.readFile(STYLE_FILE, "utf8");
	const result = await processor.process(css, {
		from: STYLE_FILE,
		to: path.join(OUT_DIR, STYLE_FILE),
	});
	await fs.writeFile(path.join(OUT_DIR, STYLE_FILE), result.css);
}

async function main() {
	await mkdirp(OUT_DIR);

	const assets = await copyAssets();

	await buildCss();

	const contentfulData = await getDataFromContentful();
	const templateData = await fs.readFile(TEMPLATE_FILE, "utf8");
	const template = Engine.compile(templateData);
	const indexHtml = template({ ...contentfulData, assets });
	await fs.writeFile(path.join(OUT_DIR, "index.html"), indexHtml);
}

main();
