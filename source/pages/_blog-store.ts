import z from "zod";
import { Content, Markdown } from "../content.ts";
import * as DateFns from "date-fns";

export class Categories {
	#data: Map<string, string>;

	constructor(data: Record<string, string>) {
		this.#data = new Map(Object.entries(data));
	}

	byId(id: string): Category | undefined {
		const label = this.#data.get(id);
		if (label) {
			return new Category(id, label);
		}
	}

	*categories(): Iterable<Category> {
		for (const [id, label] of this.#data.entries()) {
			yield new Category(id, label);
		}
	}

	static fromJSON(data: unknown): Categories {
		return new Categories(Categories.#validator.parse(data));
	}

	static #validator = z.record(z.string());
}

export class Category {
	#id: string;
	#label: string;

	constructor(id: string, label: string) {
		this.#id = id;
		this.#label = label;
	}

	get id(): string {
		return this.#id;
	}

	get label(): string {
		return this.#label;
	}
}

export class Post {
	#title: string;
	#slug: string;
	#category: Category;
	#date: Date;
	#body: string;

	constructor(md: Markdown, categories: Categories) {
		const data = Post.#validator.parse(md.attributes);
		this.#title = data.title;
		this.#body = md.body;
		this.#slug = md.file.slug;
		this.#date = DateFns.parse(this.#slug.slice(0, "YYYY-MM-DD".length), Post.#dateFormat, new Date());

		const category = categories.byId(data.category);
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
	#categories: Categories;
	#posts: Post[];

	constructor(categories: Categories, posts: Post[]) {
		this.#categories = categories;
		this.#posts = posts;
	}

	*categories(): Iterable<Category> {
		yield* this.#categories.categories();
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
		const categoryFile = await content.read("blog/categories.json");
		const categories = categoryFile.json(Categories);

		const posts: Post[] = [];
		for await (const file of content.match("blog/posts/*.md")) {
			const md = file.md();
			posts.push(new Post(md, categories));
		}

		return new Blog(categories, posts.toSorted(Post.sortDesc));
	}
}
