import Path from "path";
import { Marked } from "marked";
import { markedHighlight as MarkedHighlight } from "marked-highlight";
import Highlight from "highlight.js";
import GrayMatter from "gray-matter";

const marked = new Marked(
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

interface Markdown<T> {
	attributes: T;
	body: string;
}

interface JsonParser<T> {
	fromJSON(data: unknown): T;
}

interface MarkdownParser<T> {
	fromGrayMatter(data: unknown): T;
}

export class File {
	#path: string;
	#content: string;

	constructor(path: string, content: string) {
		this.#path = path;
		this.#content = content;
	}

	async md<T>(markdownParser: MarkdownParser<T>): Promise<Markdown<T>> {
		const gray = GrayMatter(this.content);
		const attributes = markdownParser.fromGrayMatter(gray.data);
		const body = await marked.parse(gray.content, { async: true });
		return { attributes, body };
	}

	json<T>(jsonParser: JsonParser<T>): T {
		return jsonParser.fromJSON(JSON.parse(this.content));
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
