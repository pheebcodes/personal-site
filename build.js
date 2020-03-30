const crypto = require("crypto");
const fs = require("fs").promises;
const path = require("path");
const { promisify } = require("util");
const walk = promisify(require("@nodelib/fs.walk").walk);
const mkdirp = require("mkdirp");
const Engine = require("./template-engine");
const getDataFromContentful = require("./data");

const ASSET_DIR = path.join(__dirname, "assets");
const OUT_DIR = path.join(__dirname, "out");
const OUT_ASSET_DIR = path.join(__dirname, "out", "assets");

async function main() {
	await mkdirp(OUT_DIR);

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
			"assets",
			nameWithHash,
		);
	}

	const contentfulData = await getDataFromContentful();
	const templateData = await fs.readFile("template.hbs", "utf8");
	const template = Engine.compile(templateData);
	const indexHtml = template({ ...contentfulData, assets });
	await fs.writeFile(path.join(__dirname, "out", "index.html"), indexHtml);
}

main();
