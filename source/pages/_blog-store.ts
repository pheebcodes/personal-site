import z from "zod";
import { Content } from "../content.ts";
import * as DateFns from "date-fns";
import { Page, paginate } from "../utils/paginate.tsx";

export interface Category {
	id: string;
	label: string;
}

export class Categories {
	#categories: Map<string, string>;

	constructor(categories: Record<string, string>) {
		this.#categories = new Map(Object.entries(categories));
	}

	byId(id: string): Readonly<Category> {
		const label = this.#categories.get(id);
		if (!label) {
			throw new Error(`No category for id ${id}`);
		}
		return { id, label };
	}

	*iterator(): Iterable<Readonly<Category>> {
		for (const [id, label] of this.#categories) {
			yield { id, label };
		}
	}

	[Symbol.iterator](): Iterable<Readonly<Category>> {
		return this.iterator();
	}

	static async buildContentStore(content: Content): Promise<Categories> {
		const categoryFile = await content.read("blog/categories.json");
		return categoryFile.json(Categories);
	}

	static fromJSON(data: unknown): Categories {
		return new Categories(Categories.#validator.parse(data));
	}

	static #validator = z.record(z.string());
}

interface PostGrayMatter {
	title: string;
	category: string;
}

export interface Post {
	title: string;
	slug: string;
	category: Category;
	date: Date;
	body: string;
}

export class Posts {
	#posts: Post[];

	constructor(posts: Post[]) {
		this.#posts = posts.toSorted(Posts.#sort);
	}

	*iterator(): Iterable<Readonly<Post>> {
		yield* this.#posts;
	}

	[Symbol.iterator](): Iterable<Readonly<Post>> {
		return this.iterator();
	}

	*forCategory(category: Category | string): Iterable<Readonly<Post>> {
		const id = typeof category === "object" ? category.id : category;
		for (const post of this.#posts) {
			if (post.category.id === id) {
				yield post;
			}
		}
	}

	static async buildContentStore(content: Content): Promise<Posts> {
		const categories = await content.store(Categories);

		const posts: Post[] = [];
		for await (const file of content.match("blog/posts/*.md")) {
			const md = await file.md(Posts);
			const body = md.body;
			const { title, category: categoryId } = md.attributes;
			const { slug } = file;
			const dateText = slug.slice(0, Posts.#dateFormat.length);
			const category = categories.byId(categoryId);

			posts.push({
				title,
				body,
				slug,
				category,
				date: DateFns.parse(dateText, Posts.#dateFormat, 0),
			});
		}

		return new Posts(posts);
	}

	static fromGrayMatter(data: unknown): PostGrayMatter {
		return this.#validator.parse(data);
	}

	static #dateFormat = "yyyy-MM-dd";
	static #sort(a: Readonly<Post>, b: Readonly<Post>): number {
		return DateFns.compareDesc(a.date, b.date);
	}
	static #validator = z.object({
		title: z.string(),
		category: z.string(),
	});
}

export class Blog {
	#categories: Categories;
	#posts: Posts;

	constructor(categories: Categories, posts: Posts) {
		this.#categories = categories;
		this.#posts = posts;
	}

	categories(): Iterable<Category> {
		return this.#categories.iterator();
	}

	posts(): Iterable<Post> {
		return this.#posts.iterator();
	}

	paginatedPosts(): Iterable<Page<Post>> {
		return paginate(this.posts(), Blog.#postsPerPage);
	}

	postsByCategory(category: Category | string): Iterable<Page<Post>> {
		return paginate(this.#posts.forCategory(category), Blog.#postsPerPage);
	}

	static #postsPerPage = 10;

	static async buildContentStore(content: Content): Promise<Blog> {
		const categories = await content.store(Categories);
		const posts = await content.store(Posts);
		return new Blog(categories, posts);
	}
}
