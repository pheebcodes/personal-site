import Path from "path";
import { marked as Marked } from "marked";
import { markedHighlight as MarkedHighlight } from "marked-highlight";
import Highlight from "highlight.js";
import GrayMatter from "gray-matter";

Marked.use(
	MarkedHighlight({
		highlight(code, lang) {
			const language = Highlight.getLanguage(lang) ? lang : "plaintext";
			return Highlight.highlight(code, { language }).value;
		},
	}),
);

interface IFS {
	glob(matcher: string): AsyncIterable<string>;
	read(path: string): Promise<string>;
}

export class Markdown {
	#attributes: Record<string, unknown>;
	#body: string;
	#file: File;

	constructor(file: File) {
		const data = GrayMatter(file.content);
		this.#attributes = data.data;
		this.#body = Marked(data.content);
		this.#file = file;
	}

	get attributes(): Record<string, unknown> {
		return this.#attributes;
	}

	get body(): string {
		return this.#body;
	}

	get file(): File {
		return this.#file;
	}
}

export class File {
	#path: string;
	#content: string;

	constructor(path: string, content: string) {
		this.#path = path;
		this.#content = content;
	}

	md(): Markdown {
		return new Markdown(this);
	}

	get path(): string {
		return this.#path;
	}

	get content(): string {
		return this.#content;
	}

	get slug(): string {
		return Path.basename(this.path, Path.extname(this.path));
	}
}

interface StoreBuilder<T> {
	buildContentStore(content: Content): Promise<T>;
}

export class Content {
	#fs: IFS;
	#stores: WeakMap<StoreBuilder<unknown>, unknown> = new WeakMap();

	constructor(fs: IFS) {
		this.#fs = fs;
	}

	async read(path: string): Promise<File> {
		return new File(path, await this.#fs.read(path));
	}

	match(matcher: string): AsyncIterable<File> {
		return this.#match(matcher);
	}

	async *#match(matcher: string): AsyncIterable<File> {
		for await (const path of this.#fs.glob(matcher)) {
			yield this.read(path);
		}
	}

	async store<T>(storeBuilder: StoreBuilder<T>): Promise<T> {
		if (!this.#stores.has(storeBuilder)) {
			this.#stores.set(storeBuilder, await storeBuilder.buildContentStore(this));
		}
		return this.#stores.get(storeBuilder) as T;
	}
}
