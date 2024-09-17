import FS from "fs/promises";
import { globbyStream as glob } from "globby";
import Path from "path";
import { VNode } from "preact";
import { renderToString } from "preact-render-to-string";
import { Content } from "./content.ts";

class Builder {
	#contentRoot = "content";
	#outputRoot = "out";

	async build(): Promise<void> {
		await FS.rm(this.#outputRoot, { force: true, recursive: true });
		await FS.cp("static", this.#outputRoot, { recursive: true });
		await FS.copyFile("license.txt", Path.join(this.#outputRoot, "license.txt"));

		if (process.env.NODE_ENV === "production" && process.env.COMMIT_REF) {
			await FS.writeFile(Path.join(this.#outputRoot, "commit.txt"), process.env.COMMIT_REF);
		}

		const resolve = this.#resolveContent.bind(this);
		const content = new Content({
			async *glob(matcher: string): AsyncIterable<string> {
				for await (const path of glob(matcher, { cwd: resolve() })) {
					yield Buffer.isBuffer(path) ? path.toString("utf8") : path;
				}
			},
			async read(path: string): Promise<string> {
				return await FS.readFile(resolve(path), "utf8");
			},
		});

		for await (const pageFullPath of glob(["source/pages/*", "!source/pages/_*"])) {
			const pageImportPath = Path.relative("source", pageFullPath.toString("utf8"));
			const pageModule = await import(`./${pageImportPath}`);
			for await (const page of pageModule.pages(content)) {
				if (page.element) {
					await this.#render(page.path, page.element);
				} else if (page.content) {
					await this.#write(page.path, page.content);
				}
			}
		}
	}

	async #render(path: string, element: VNode) {
		await this.#write(path, "<!DOCTYPE html>" + renderToString(element));
	}

	async #write(path: string, content: string) {
		const output = this.#resolveOutput(path);
		await FS.mkdir(Path.dirname(output), { recursive: true });
		await FS.writeFile(output, content);
	}

	#resolveContent(...paths: string[]): string {
		return Path.resolve(this.#contentRoot, ...paths);
	}

	#resolveOutput(...paths: string[]): string {
		return Path.resolve(this.#outputRoot, ...paths);
	}
}

new Builder().build();
