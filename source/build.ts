import FS from "fs/promises";
import { globbyStream as GlobbyStream } from "globby";
import Path from "path";
import { renderToString } from "preact-render-to-string";

import { Content } from "./content.ts";
import { VNode } from "preact";

class Builder {
	#contentRoot = "content";
	#outputRoot = "out";

	async build(): Promise<void> {
		await FS.rm(this.#outputRoot, { force: true, recursive: true });
		await FS.cp("static", this.#outputRoot, { recursive: true });

		if (process.env.NODE_ENV === "production" && process.env.COMMIT_REF) {
			await FS.writeFile(Path.join(this.#outputRoot, "commit.txt"), process.env.COMMIT_REF);
		}

		const resolve = this.#resolveContent.bind(this);
		const content = new Content({
			async *glob(matcher: string): AsyncGenerator<string, void, void> {
				for await (const path of GlobbyStream(matcher, { cwd: resolve() })) {
					yield Buffer.isBuffer(path) ? path.toString("utf8") : path;
				}
			},
			async read(path: string): Promise<string> {
				return await FS.readFile(resolve(path), "utf8");
			},
		});

		for await (const pageFullPath of GlobbyStream(["source/pages/*", "!source/pages/_*"])) {
			const pageImportPath = Path.relative("source", pageFullPath.toString("utf8"));
			const pageModule = await import(`./${pageImportPath}`);
			for await (const page of pageModule.pages(content)) {
				await this.#render(page.path, page.element);
			}
		}
	}

	async #render(path: string, element: VNode) {
		const write = () => FS.writeFile(this.#resolveOutput(path), "<!DOCTYPE html>" + renderToString(element));
		try {
			await write();
		} catch (e) {
			if (e instanceof Error && "code" in e && e.code === "ENOENT") {
				await FS.mkdir(Path.dirname(this.#resolveOutput(path)), { recursive: true });
				await write();
			}
		}
	}

	#resolveContent(...paths: string[]): string {
		return Path.resolve(this.#contentRoot, ...paths);
	}

	#resolveOutput(...paths: string[]): string {
		return Path.resolve(this.#outputRoot, ...paths);
	}
}

new Builder().build();
