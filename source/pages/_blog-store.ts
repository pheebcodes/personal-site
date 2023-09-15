import z from "zod";
import { Content, Markdown } from "../content.ts";
import * as DateFns from "date-fns";

export class Category {
	#id: string;
	#label: string;

	constructor(md: Markdown) {
		const data = Category.#validator.parse(md.attributes);
		this.#id = data.id;
		this.#label = data.label;
	}

	get id(): string {
		return this.#id;
	}

	get label(): string {
		return this.#label;
	}

	static #validator = z.object({
		id: z.string(),
		label: z.string(),
	});
}

export class Post {
	#title: string;
	#slug: string;
	#category: Category;
	#date: Date;
	#body: string;

	constructor(md: Markdown, categoryById: Map<string, Category>) {
		const data = Post.#validator.parse(md.attributes);
		this.#title = data.title;
		this.#body = md.body;
		this.#slug = md.file.slug;
		this.#date = DateFns.parse(this.#slug.slice(0, "YYYY-MM-DD".length), Post.#dateFormat, new Date());

		const category = categoryById.get(data.category);
		if (!category) {
			throw new Error(`No category for post ${this.slug}`);
		}
		this.#category = category;
	}

	get title(): string {
		return this.#title;
	}

	get category(): Category {
		return this.#category;
	}

	get body(): string {
		return this.#body;
	}

	get slug(): string {
		return this.#slug;
	}

	get date(): Date {
		return this.#date;
	}

	static #dateFormat = "yyyy-MM-dd";

	static sortDesc(a: Post, b: Post): number {
		return DateFns.compareDesc(a.date, b.date);
	}

	static #validator = z.object({
		title: z.string(),
		category: z.string(),
	});
}

interface Page<T> {
	items: T[];
	page: number;
	first: boolean;
	last: boolean;
}

export class Blog {
	#categories: Category[];
	#posts: Post[];

	constructor(categories: Category[], posts: Post[]) {
		this.#categories = categories;
		this.#posts = posts;
	}

	*categories(): Iterable<Category> {
		for (const category of this.#categories) {
			yield category;
		}
	}

	*posts(): Iterable<Post> {
		for (const post of this.#posts) {
			yield post;
		}
	}

	*postsForCategory(category: Category | string): Iterable<Post> {
		const id = category instanceof Category ? category.id : category;
		for (const post of this.#posts) {
			if (post.category?.id === id) {
				yield post;
			}
		}
	}

	static *paginate<T>(items: Iterable<T>): Iterable<Page<T>> {
		let collectedItems = Array.from(items);
		const startLength = collectedItems.length;
		let page = 1;
		while (collectedItems.length > 0) {
			const first = collectedItems.length === startLength;
			const items = collectedItems.slice(0, this.#postsPerPage);
			collectedItems = collectedItems.slice(this.#postsPerPage);
			const last = collectedItems.length === 0;
			yield {
				items,
				page: page++,
				first,
				last,
			};
		}
	}

	static #postsPerPage = 10;

	static async buildContentStore(content: Content): Promise<Blog> {
		const categories: Category[] = [];
		for await (const file of content.match("blog/categories/*.md")) {
			categories.push(new Category(file.md()));
		}

		const categoryById = new Map(categories.map((category) => [category.id, category]));

		const posts: Post[] = [];
		for await (const file of content.match("blog/posts/*.md")) {
			const md = file.md();
			posts.push(new Post(md, categoryById));
		}

		return new Blog(categories, posts.toSorted(Post.sortDesc));
	}
}
