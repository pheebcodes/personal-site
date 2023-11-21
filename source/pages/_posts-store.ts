import z from "zod";
import { Content } from "../content.ts";
import * as DateFns from "date-fns";
import { Page, paginate } from "../utils/paginate.tsx";

interface PostGrayMatter {
	title: string;
	category: string;
}

interface PostMatcherOpts {
	category: string;
}

export interface Post {
	title: string;
	slug: string;
	category: string;
	date: Date;
	body: string;
}

export class Posts {
	#posts: Post[];
	#categories: Set<string>;

	constructor(posts: Post[]) {
		this.#posts = posts.toSorted(Posts.#sort);
		this.#categories = new Set(this.#posts.map((post) => post.category));
	}

	*categories(): IterableIterator<string> {
		yield* this.#categories.values();
	}

	*posts(matcher?: PostMatcherOpts): IterableIterator<Post> {
		if (!matcher) {
			yield* this.#posts;
			return;
		}
		for (const post of this.#posts) {
			if (post.category === matcher.category) {
				yield post;
			}
		}
	}

	*pages(matcher?: PostMatcherOpts): IterableIterator<Page<Post>> {
		yield* paginate(this.posts(matcher), Posts.#perPage);
	}

	*[Symbol.iterator](): IterableIterator<Readonly<Post>> {
		yield* this.posts();
	}

	static #perPage = 10;

	static async buildContentStore(content: Content): Promise<Posts> {
		const posts: Post[] = [];
		for await (const file of content.match("blog/posts/*.md")) {
			const md = await file.md(Posts);
			const body = md.body;
			const { title, category } = md.attributes;
			const { slug } = file;
			const dateText = slug.slice(0, Posts.#dateFormat.length);

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
